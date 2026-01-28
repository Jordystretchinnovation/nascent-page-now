import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const META_API_BASE = 'https://graph.facebook.com/v19.0';

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const accessToken = Deno.env.get('META_ACCESS_TOKEN');
    const adAccountId = Deno.env.get('META_AD_ACCOUNT_ID');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!accessToken) {
      throw new Error('META_ACCESS_TOKEN is not configured');
    }
    if (!adAccountId) {
      throw new Error('META_AD_ACCOUNT_ID is not configured');
    }
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase credentials not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action, campaign_ids, start_date, end_date } = await req.json();
    console.log(`Meta sync action: ${action}`, { campaign_ids, start_date, end_date });

    // Action: List all campaigns from Meta
    if (action === 'list_campaigns') {
      const url = `${META_API_BASE}/act_${adAccountId}/campaigns?fields=id,name,status,objective,created_time&access_token=${accessToken}&limit=100`;
      console.log('Fetching campaigns from Meta...');
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        console.error('Meta API error:', data.error);
        throw new Error(`Meta API error: ${data.error.message}`);
      }

      console.log(`Found ${data.data?.length || 0} campaigns`);
      return new Response(JSON.stringify({ 
        success: true, 
        campaigns: data.data || [] 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Action: Auto-sync active campaigns (for cron job)
    if (action === 'auto_sync') {
      // Get all active campaigns from database
      const { data: activeCampaigns, error: fetchError } = await supabase
        .from('meta_sync_campaigns')
        .select('campaign_id')
        .eq('is_active', true);

      if (fetchError) {
        throw new Error(`Failed to fetch active campaigns: ${fetchError.message}`);
      }

      if (!activeCampaigns || activeCampaigns.length === 0) {
        console.log('No active campaigns configured for sync');
        return new Response(JSON.stringify({ 
          success: true, 
          message: 'No active campaigns to sync',
          synced_rows: 0
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const campaignIdsToSync = activeCampaigns.map(c => c.campaign_id);
      
      // Sync last 7 days to catch any delayed data
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
      
      const autoStartDate = sevenDaysAgo.toISOString().split('T')[0];
      const autoEndDate = today.toISOString().split('T')[0];

      console.log(`Auto-syncing ${campaignIdsToSync.length} campaigns from ${autoStartDate} to ${autoEndDate}`);

      // Continue to sync_performance logic below with these values
      const allInsights: any[] = [];

      for (const campaignId of campaignIdsToSync) {
        const campaignUrl = `${META_API_BASE}/${campaignId}?fields=name&access_token=${accessToken}`;
        const campaignResponse = await fetch(campaignUrl);
        const campaignData = await campaignResponse.json();
        
        if (campaignData.error) {
          console.error(`Error fetching campaign ${campaignId}:`, campaignData.error);
          continue;
        }

        const campaignName = campaignData.name;

        const insightsUrl = `${META_API_BASE}/${campaignId}/insights?fields=ad_id,ad_name,adset_id,adset_name,campaign_id,campaign_name,spend,frequency,date_start,date_stop&level=ad&time_increment=1&time_range={"since":"${autoStartDate}","until":"${autoEndDate}"}&access_token=${accessToken}&limit=500`;
        
        console.log(`Fetching insights for campaign: ${campaignName}`);
        const insightsResponse = await fetch(insightsUrl);
        const insightsData = await insightsResponse.json();

        if (insightsData.error) {
          console.error(`Error fetching insights for ${campaignId}:`, insightsData.error);
          continue;
        }

        if (insightsData.data) {
          for (const insight of insightsData.data) {
            allInsights.push({
              date: insight.date_start,
              campaign_name: insight.campaign_name || campaignName,
              adset_name: insight.adset_name || 'Unknown',
              ad_name: insight.ad_name || 'Unknown',
              spent: parseFloat(insight.spend || '0'),
              frequency: insight.frequency ? parseFloat(insight.frequency) : null,
            });
          }
        }
      }

      console.log(`Auto-sync: Total insights collected: ${allInsights.length}`);

      if (allInsights.length > 0) {
        const { error: deleteError } = await supabase
          .from('meta_performance')
          .delete()
          .gte('date', autoStartDate)
          .lte('date', autoEndDate)
          .in('campaign_name', [...new Set(allInsights.map(i => i.campaign_name))]);

        if (deleteError) {
          console.error('Error deleting existing data:', deleteError);
        }

        const { error: insertError } = await supabase
          .from('meta_performance')
          .insert(allInsights);

        if (insertError) {
          console.error('Error inserting data:', insertError);
          throw new Error(`Failed to insert data: ${insertError.message}`);
        }

        await supabase
          .from('meta_sync_campaigns')
          .update({ last_synced_at: new Date().toISOString() })
          .in('campaign_id', campaignIdsToSync);
      }

      return new Response(JSON.stringify({ 
        success: true, 
        synced_rows: allInsights.length,
        campaigns_synced: campaignIdsToSync.length,
        message: `Auto-sync complete: ${allInsights.length} records from ${campaignIdsToSync.length} campaigns`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Action: Sync performance data for selected campaigns
    if (action === 'sync_performance') {
      if (!campaign_ids || campaign_ids.length === 0) {
        throw new Error('No campaign_ids provided');
      }
      if (!start_date || !end_date) {
        throw new Error('start_date and end_date are required');
      }

      console.log(`Syncing performance for ${campaign_ids.length} campaigns from ${start_date} to ${end_date}`);

      const allInsights: any[] = [];

      for (const campaignId of campaign_ids) {
        // Fetch campaign name first
        const campaignUrl = `${META_API_BASE}/${campaignId}?fields=name&access_token=${accessToken}`;
        const campaignResponse = await fetch(campaignUrl);
        const campaignData = await campaignResponse.json();
        
        if (campaignData.error) {
          console.error(`Error fetching campaign ${campaignId}:`, campaignData.error);
          continue;
        }

        const campaignName = campaignData.name;

        // Fetch ad-level insights with breakdown
        const insightsUrl = `${META_API_BASE}/${campaignId}/insights?fields=ad_id,ad_name,adset_id,adset_name,campaign_id,campaign_name,spend,frequency,date_start,date_stop&level=ad&time_increment=1&time_range={"since":"${start_date}","until":"${end_date}"}&access_token=${accessToken}&limit=500`;
        
        console.log(`Fetching insights for campaign: ${campaignName}`);
        const insightsResponse = await fetch(insightsUrl);
        const insightsData = await insightsResponse.json();

        if (insightsData.error) {
          console.error(`Error fetching insights for ${campaignId}:`, insightsData.error);
          continue;
        }

        if (insightsData.data) {
          for (const insight of insightsData.data) {
            allInsights.push({
              date: insight.date_start,
              campaign_name: insight.campaign_name || campaignName,
              adset_name: insight.adset_name || 'Unknown',
              ad_name: insight.ad_name || 'Unknown',
              spent: parseFloat(insight.spend || '0'),
              frequency: insight.frequency ? parseFloat(insight.frequency) : null,
            });
          }
        }
      }

      console.log(`Total insights collected: ${allInsights.length}`);

      if (allInsights.length > 0) {
        // Delete existing data for this date range to avoid duplicates
        const { error: deleteError } = await supabase
          .from('meta_performance')
          .delete()
          .gte('date', start_date)
          .lte('date', end_date)
          .in('campaign_name', [...new Set(allInsights.map(i => i.campaign_name))]);

        if (deleteError) {
          console.error('Error deleting existing data:', deleteError);
        }

        // Insert new data
        const { data: insertData, error: insertError } = await supabase
          .from('meta_performance')
          .insert(allInsights);

        if (insertError) {
          console.error('Error inserting data:', insertError);
          throw new Error(`Failed to insert data: ${insertError.message}`);
        }

        // Update last_synced_at for campaigns
        await supabase
          .from('meta_sync_campaigns')
          .update({ last_synced_at: new Date().toISOString() })
          .in('campaign_id', campaign_ids);

        console.log(`Successfully synced ${allInsights.length} rows`);
      }

      return new Response(JSON.stringify({ 
        success: true, 
        synced_rows: allInsights.length,
        message: `Successfully synced ${allInsights.length} performance records`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error(`Unknown action: ${action}`);

  } catch (error) {
    console.error('Error in meta-sync function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
