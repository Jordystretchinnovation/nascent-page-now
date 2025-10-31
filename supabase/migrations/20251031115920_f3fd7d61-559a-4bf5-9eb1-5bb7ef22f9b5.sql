-- Fix UTM parameters for leads with {{site_source_name}}
UPDATE form_submissions 
SET 
  utm_source = 'fb',
  utm_medium = 'cpc',
  utm_campaign = '2506_gh5_leads'
WHERE utm_source = '{{site_source_name}}';