-- Update Marie Vleegen UTM parameters
UPDATE form_submissions 
SET 
  utm_source = 'fb',
  utm_medium = 'cpc',
  utm_campaign = '2506_gh13_leads'
WHERE id = '5524756b-38dc-472f-870e-d143dc9fc30e';

-- Update Jean Marie HARDY UTM parameters
UPDATE form_submissions 
SET 
  utm_source = 'fb',
  utm_medium = 'cpc',
  utm_campaign = '2506_gh5_leads'
WHERE id = '104d8d27-88a2-4eb3-8c50-9d22f6120878';

-- Delete Kadidja De Witte duplicate (the one without UTMs)
DELETE FROM form_submissions 
WHERE id = 'b088923d-7a74-43a9-9fb3-6390f035de26';