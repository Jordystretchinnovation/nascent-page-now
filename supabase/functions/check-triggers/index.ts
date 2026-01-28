import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DecisionTrigger {
  id: string;
  trigger_name: string;
  adset_pattern: string;
  market: string | null;
  metric: string;
  operator: string;
  threshold_value: number | null;
  severity: string;
  action_fail: string | null;
  evaluation_week: number | null;
  applies_to_campaign_type: string | null;
  is_active: boolean;
}

interface AdsetMetrics {
  adset_name: string;
  campaign_name: string;
  spent: number;
  leads: number;
  sqls: number;
  cpl: number;
  frequency: number;
  clicks: number;
  cpc: number;
  days_without_lead: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting trigger check...');

    // Calculate current week from campaign start
    const campaignStart = new Date(2026, 1, 2); // Feb 2, 2026
    const now = new Date();
    const daysSinceStart = Math.floor((now.getTime() - campaignStart.getTime()) / (1000 * 60 * 60 * 24));
    const currentWeek = Math.max(1, Math.min(13, Math.ceil((daysSinceStart + 1) / 7)));

    console.log(`Current week: ${currentWeek}`);

    // Fetch active triggers
    const { data: triggers, error: triggersError } = await supabase
      .from('decision_triggers')
      .select('*')
      .eq('is_active', true);

    if (triggersError) throw triggersError;
    console.log(`Found ${triggers?.length || 0} active triggers`);

    // Filter triggers applicable to current week
    const applicableTriggers = (triggers as DecisionTrigger[]).filter(t => {
      if (t.evaluation_week === null) return true; // Always-on triggers
      return t.evaluation_week === currentWeek;
    });

    console.log(`${applicableTriggers.length} triggers applicable to week ${currentWeek}`);

    // Fetch meta performance (last 7 days)
    const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const { data: metaData, error: metaError } = await supabase
      .from('meta_performance')
      .select('*')
      .gte('date', startDate);

    if (metaError) throw metaError;

    // Fetch leads (last 28 days)
    const leadsStartDate = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString();
    const { data: leadsData, error: leadsError } = await supabase
      .from('form_submissions_2026')
      .select('id, created_at, utm_campaign, utm_content, kwaliteit')
      .gte('created_at', leadsStartDate);

    if (leadsError) throw leadsError;

    // Calculate adset metrics
    const adsetMap = new Map<string, AdsetMetrics>();

    (metaData || []).forEach((m: any) => {
      const key = m.adset_name;
      const existing = adsetMap.get(key);

      if (existing) {
        existing.spent += Number(m.spent);
        existing.frequency = m.frequency 
          ? (existing.frequency + Number(m.frequency)) / 2 
          : existing.frequency;
        existing.clicks += m.clicks || 0;
      } else {
        adsetMap.set(key, {
          adset_name: m.adset_name,
          campaign_name: m.campaign_name,
          spent: Number(m.spent),
          leads: 0,
          sqls: 0,
          cpl: 0,
          frequency: m.frequency ? Number(m.frequency) : 0,
          clicks: m.clicks || 0,
          cpc: 0,
          days_without_lead: 999,
        });
      }
    });

    // Add leads and calculate days without lead
    const lastLeadByAdset = new Map<string, Date>();
    (leadsData || []).forEach((l: any) => {
      if (l.utm_content) {
        const adset = adsetMap.get(l.utm_content);
        if (adset) {
          adset.leads++;
          const isSql = ['Goed', 'Goed - klant', 'Goed - Klant'].includes(l.kwaliteit);
          if (isSql) adset.sqls++;
        }

        const leadDate = new Date(l.created_at);
        const existing = lastLeadByAdset.get(l.utm_content);
        if (!existing || leadDate > existing) {
          lastLeadByAdset.set(l.utm_content, leadDate);
        }
      }
    });

    // Calculate derived metrics
    adsetMap.forEach((adset, key) => {
      adset.cpl = adset.leads > 0 ? adset.spent / adset.leads : 0;
      adset.cpc = adset.clicks > 0 ? adset.spent / adset.clicks : 0;
      
      const lastLead = lastLeadByAdset.get(key);
      if (lastLead) {
        adset.days_without_lead = Math.floor((Date.now() - lastLead.getTime()) / (1000 * 60 * 60 * 24));
      }
    });

    // Fetch existing open alerts to avoid duplicates
    const { data: existingAlerts, error: alertsError } = await supabase
      .from('triggered_alerts')
      .select('trigger_id, adset_name')
      .eq('status', 'open');

    if (alertsError) throw alertsError;

    const existingAlertKeys = new Set(
      (existingAlerts || []).map((a: any) => `${a.trigger_id}-${a.adset_name}`)
    );

    // Check triggers against metrics
    const newAlerts: any[] = [];
    const resolvedAlerts: string[] = [];

    for (const trigger of applicableTriggers) {
      // Match adsets by pattern
      const matchingAdsets = Array.from(adsetMap.values()).filter(adset => {
        if (trigger.adset_pattern.includes('%')) {
          const regex = new RegExp(trigger.adset_pattern.replace(/%/g, '.*'));
          return regex.test(adset.adset_name);
        }
        return adset.adset_name === trigger.adset_pattern;
      });

      for (const adset of matchingAdsets) {
        // Get the metric value
        let metricValue: number | null = null;
        switch (trigger.metric) {
          case 'cpl': metricValue = adset.cpl; break;
          case 'frequency': metricValue = adset.frequency; break;
          case 'cpc': metricValue = adset.cpc; break;
          case 'days_without_lead': metricValue = adset.days_without_lead; break;
          case 'conversion_rate': 
            metricValue = adset.leads > 0 ? (adset.sqls / adset.leads) * 100 : 0; 
            break;
          default: continue;
        }

        if (metricValue === null || trigger.threshold_value === null) continue;

        // Check if trigger condition is met
        let triggered = false;
        switch (trigger.operator) {
          case 'gt': triggered = metricValue > trigger.threshold_value; break;
          case 'gte': triggered = metricValue >= trigger.threshold_value; break;
          case 'lt': triggered = metricValue < trigger.threshold_value; break;
          case 'lte': triggered = metricValue <= trigger.threshold_value; break;
        }

        const alertKey = `${trigger.id}-${adset.adset_name}`;

        if (triggered && !existingAlertKeys.has(alertKey)) {
          // Create new alert
          newAlerts.push({
            trigger_id: trigger.id,
            campaign_name: adset.campaign_name,
            adset_name: adset.adset_name,
            metric_name: trigger.metric,
            current_value: metricValue,
            threshold_value: trigger.threshold_value,
            severity: trigger.severity,
            status: 'open',
          });
          console.log(`New alert: ${trigger.trigger_name} for ${adset.adset_name} (${metricValue} ${trigger.operator} ${trigger.threshold_value})`);
        }
      }
    }

    // Insert new alerts
    if (newAlerts.length > 0) {
      const { error: insertError } = await supabase
        .from('triggered_alerts')
        .insert(newAlerts);

      if (insertError) {
        console.error('Error inserting alerts:', insertError);
        throw insertError;
      }
      console.log(`Inserted ${newAlerts.length} new alerts`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        currentWeek,
        triggersChecked: applicableTriggers.length,
        adsetsAnalyzed: adsetMap.size,
        newAlertsCreated: newAlerts.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in check-triggers:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
