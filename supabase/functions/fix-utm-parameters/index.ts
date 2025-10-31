import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Update all leads with {{site_source_name}} to fb
    const { data, error } = await supabaseClient
      .from('form_submissions')
      .update({
        utm_source: 'fb',
        utm_medium: 'cpc',
        utm_campaign: '2506_gh5_leads'
      })
      .eq('utm_source', '{{site_source_name}}')
      .select()

    if (error) throw error

    return new Response(
      JSON.stringify({ 
        success: true, 
        updated: data?.length || 0,
        records: data
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})