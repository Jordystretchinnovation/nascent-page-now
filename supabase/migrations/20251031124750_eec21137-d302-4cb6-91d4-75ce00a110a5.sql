-- Add email-specific metrics to campaign_budgets table
ALTER TABLE campaign_budgets 
ADD COLUMN emails_sent integer,
ADD COLUMN open_rate numeric,
ADD COLUMN click_rate numeric;

COMMENT ON COLUMN campaign_budgets.emails_sent IS 'Number of emails sent for email campaigns';
COMMENT ON COLUMN campaign_budgets.open_rate IS 'Open rate as percentage (e.g., 25.5 for 25.5%)';
COMMENT ON COLUMN campaign_budgets.click_rate IS 'Click rate as percentage (e.g., 5.2 for 5.2%)';