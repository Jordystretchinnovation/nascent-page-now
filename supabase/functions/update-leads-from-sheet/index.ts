import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface LeadUpdate {
  email: string;
  sales_status: string | null;
  sales_rep: string | null;
  kwaliteit: string | null;
  toelichting: string | null;
  sales_comment: string | null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { updates } = await req.json() as { updates: LeadUpdate[] }
    
    console.log(`Processing ${updates.length} lead updates`)

    const results = {
      updated: 0,
      notFound: 0,
      errors: [] as string[]
    }

    // Process updates in batches
    for (const update of updates) {
      try {
        // Find ALL submissions by email (not just the most recent one)
        const { data: existingSubmissions, error: fetchError } = await supabaseClient
          .from('form_submissions')
          .select('id, email')
          .eq('email', update.email)

        if (fetchError || !existingSubmissions || existingSubmissions.length === 0) {
          console.log(`No submission found for ${update.email}`)
          results.notFound++
          continue
        }

        // Update ALL submissions with the same email to keep sync fields consistent
        const submissionIds = existingSubmissions.map(s => s.id)
        const { error: updateError } = await supabaseClient
          .from('form_submissions')
          .update({
            sales_status: update.sales_status || null,
            sales_rep: update.sales_rep || null,
            kwaliteit: update.kwaliteit || null,
            toelichting: update.toelichting || null,
            sales_comment: update.sales_comment || null
          })
          .in('id', submissionIds)

        if (updateError) {
          console.error(`Error updating ${update.email}:`, updateError)
          results.errors.push(`${update.email}: ${updateError.message}`)
        } else {
          results.updated += existingSubmissions.length
          console.log(`Updated ${existingSubmissions.length} submission(s) for ${update.email}`)
        }
      } catch (error) {
        console.error(`Error processing ${update.email}:`, error)
        results.errors.push(`${update.email}: ${error.message}`)
      }
    }

    return new Response(
      JSON.stringify(results),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})