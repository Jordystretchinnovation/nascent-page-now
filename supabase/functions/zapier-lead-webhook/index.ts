import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse incoming payload from Zapier
    const payload = await req.json();
    console.log('Received Zapier payload:', JSON.stringify(payload, null, 2));

    // Extract fields from Zapier payload
    const {
      voornaam,
      achternaam, 
      bedrijf,
      email,
      telefoon,
      straat,
      postcode,
      gemeente,
      utm_content, // This will be the ad set name from Zapier
    } = payload;

    // Validate required fields
    if (!voornaam || !achternaam || !email) {
      console.error('Missing required fields:', { voornaam, achternaam, email });
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: voornaam, achternaam, email' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Prepare data for insertion
    const leadData = {
      voornaam: voornaam?.trim(),
      achternaam: achternaam?.trim(),
      bedrijf: bedrijf?.trim() || 'Niet opgegeven',
      email: email?.trim(),
      telefoon: telefoon?.trim() || null,
      straat: straat?.trim() || null,
      postcode: postcode?.trim() || null,
      gemeente: gemeente?.trim() || null,
      type: 'stalen',
      marketing_optin: true,
      language: 'nl',
      utm_source: 'fb',
      utm_medium: 'cpc',
      utm_campaign: '2909_gh16_leads',
      utm_content: utm_content?.trim() || null,
    };

    console.log('Inserting lead data:', JSON.stringify(leadData, null, 2));

    // Insert into form_submissions table
    const { data, error } = await supabase
      .from('form_submissions')
      .insert([leadData])
      .select();

    if (error) {
      console.error('Database insertion error:', error);
      return new Response(JSON.stringify({ 
        error: 'Failed to save lead data',
        details: error.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Successfully inserted lead:', data);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Lead saved successfully',
      id: data[0]?.id 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});