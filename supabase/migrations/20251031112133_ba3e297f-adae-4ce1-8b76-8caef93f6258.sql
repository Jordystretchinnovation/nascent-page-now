-- Update campaign_budgets table to support multiple UTM values
ALTER TABLE campaign_budgets 
  ALTER COLUMN utm_campaign TYPE text[] USING CASE 
    WHEN utm_campaign IS NULL THEN NULL 
    ELSE ARRAY[utm_campaign] 
  END,
  ALTER COLUMN utm_source TYPE text[] USING CASE 
    WHEN utm_source IS NULL THEN NULL 
    ELSE ARRAY[utm_source] 
  END,
  ALTER COLUMN utm_medium TYPE text[] USING CASE 
    WHEN utm_medium IS NULL THEN NULL 
    ELSE ARRAY[utm_medium] 
  END;