-- Create decision_triggers table
CREATE TABLE public.decision_triggers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  trigger_name text NOT NULL,
  adset_pattern text NOT NULL,
  market text,
  metric text NOT NULL,
  operator text NOT NULL,
  threshold_value decimal(10,2),
  severity text NOT NULL,
  action_success text,
  action_fail text,
  shift_to_adset text,
  evaluation_week int,
  applies_to_campaign_type text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- Create triggered_alerts table
CREATE TABLE public.triggered_alerts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  trigger_id uuid REFERENCES public.decision_triggers(id) ON DELETE SET NULL,
  triggered_at timestamp with time zone DEFAULT now(),
  campaign_name text NOT NULL,
  adset_name text NOT NULL,
  metric_name text NOT NULL,
  current_value decimal(10,2),
  threshold_value decimal(10,2),
  severity text NOT NULL,
  status text DEFAULT 'open',
  resolved_at timestamp with time zone,
  resolved_by text,
  notes text
);

-- Enable RLS
ALTER TABLE public.decision_triggers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.triggered_alerts ENABLE ROW LEVEL SECURITY;

-- RLS policies for decision_triggers
CREATE POLICY "Allow reading decision triggers" ON public.decision_triggers
  FOR SELECT USING (true);

CREATE POLICY "Allow inserting decision triggers" ON public.decision_triggers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow updating decision triggers" ON public.decision_triggers
  FOR UPDATE USING (true);

CREATE POLICY "Allow deleting decision triggers" ON public.decision_triggers
  FOR DELETE USING (true);

-- RLS policies for triggered_alerts
CREATE POLICY "Allow reading triggered alerts" ON public.triggered_alerts
  FOR SELECT USING (true);

CREATE POLICY "Allow inserting triggered alerts" ON public.triggered_alerts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow updating triggered alerts" ON public.triggered_alerts
  FOR UPDATE USING (true);

CREATE POLICY "Allow deleting triggered alerts" ON public.triggered_alerts
  FOR DELETE USING (true);

-- Create indexes
CREATE INDEX idx_decision_triggers_adset ON public.decision_triggers(adset_pattern);
CREATE INDEX idx_decision_triggers_active ON public.decision_triggers(is_active);
CREATE INDEX idx_triggered_alerts_status ON public.triggered_alerts(status);
CREATE INDEX idx_triggered_alerts_severity ON public.triggered_alerts(severity);
CREATE INDEX idx_triggered_alerts_triggered_at ON public.triggered_alerts(triggered_at DESC);

-- Seed decision triggers data
INSERT INTO public.decision_triggers (
  trigger_name, adset_pattern, market, metric, operator, 
  threshold_value, severity, action_success, action_fail, 
  shift_to_adset, evaluation_week, applies_to_campaign_type
) VALUES

-- WEEK 4 EVALUATIE - NL AUDIENCES
('NL LAL Scraping CPL OK', 'lookalike_scraping_nl', 'NL', 'cpl', 'lt', 
 9.00, 'info', 'Basis voor Fase 2 OK', NULL, 
 NULL, 4, 'leadgen'),

('NL LAL Scraping CPL Warning', 'lookalike_scraping_nl', 'NL', 'cpl', 'gt', 
 12.00, 'warning', NULL, 'Check targeting, mogelijk audience saturatie', 
 NULL, 4, 'leadgen'),

('NL Retargeting CPL OK', 'retargeting_engagement_nl', 'NL', 'cpl', 'lt', 
 16.00, 'info', 'Behoud 18% allocatie', NULL, 
 NULL, 4, 'leadgen'),

('NL Retargeting CPL Fail', 'retargeting_engagement_nl', 'NL', 'cpl', 'gt', 
 20.00, 'warning', NULL, 'Verlaag budget of stop', 
 'lookalike_scraping_nl', 4, 'leadgen'),

('NL Retargeting Freq Warning', 'retargeting_engagement_nl', 'NL', 'frequency', 'gt', 
 5.00, 'warning', NULL, 'Pool uitgeput, verlaag of stop', 
 'lookalike_scraping_nl', 4, 'leadgen'),

('NL LAL Leads CPL+Conv OK', 'lookalike_leads_nl', 'NL', 'cpl', 'lt', 
 10.00, 'info', 'Verhoog budget naar 20%', NULL, 
 NULL, 4, 'leadgen'),

('NL LAL Leads CPL Fail', 'lookalike_leads_nl', 'NL', 'cpl', 'gt', 
 12.00, 'warning', NULL, 'Stop, shift budget', 
 'lookalike_scraping_nl', 4, 'leadgen'),

('NL LAL Leads Conv Fail', 'lookalike_leads_nl', 'NL', 'conversion_rate', 'lt', 
 10.00, 'warning', NULL, 'Conversie te laag, stop', 
 'lookalike_scraping_nl', 4, 'leadgen'),

-- WEEK 4 EVALUATIE - FR AUDIENCES
('FR LAL Scraping CPL OK', 'lookalike_scraping_fr', 'FR', 'cpl', 'lt', 
 35.00, 'info', 'FR baseline OK', NULL, 
 NULL, 4, 'leadgen'),

('FR LAL Scraping CPL Fail', 'lookalike_scraping_fr', 'FR', 'cpl', 'gt', 
 45.00, 'warning', NULL, 'FR CPL te hoog, check targeting', 
 NULL, 4, 'leadgen'),

('FR Retargeting CPL OK', 'retargeting_engagement_fr', 'FR', 'cpl', 'lt', 
 50.00, 'info', 'FR retargeting OK', NULL, 
 NULL, 4, 'leadgen'),

('FR Retargeting Freq Warning', 'retargeting_engagement_fr', 'FR', 'frequency', 'gt', 
 5.00, 'warning', NULL, 'Pool uitgeput (gedeeld met NL!)', 
 'lookalike_scraping_fr', 4, 'leadgen'),

('FR LAL Leads CPL OK', 'lookalike_leads_fr', 'FR', 'cpl', 'lt', 
 22.00, 'info', 'Verhoog budget naar 60%', NULL, 
 NULL, 4, 'leadgen'),

('FR LAL Leads CPL Fail', 'lookalike_leads_fr', 'FR', 'cpl', 'gt', 
 28.00, 'warning', NULL, 'Verlaag naar 30%', 
 'lookalike_scraping_fr', 4, 'leadgen'),

-- AWARENESS CAMPAIGN TRIGGERS
('Awareness CPC OK', 'lookalike_leads_customers_nl', 'NL', 'cpc', 'lt', 
 0.20, 'info', 'CPC binnen target', NULL, 
 NULL, 4, 'awareness'),

('Awareness CPC Warning', 'lookalike_leads_customers_nl', 'NL', 'cpc', 'gt', 
 0.30, 'warning', NULL, 'CPC te hoog, check creatives', 
 NULL, 4, 'awareness'),

('Awareness Freq Warning', 'lookalike_leads_customers_nl', 'NL', 'frequency', 'gt', 
 3.00, 'warning', NULL, 'Awareness freq hoog, pool raakt vol', 
 NULL, NULL, 'awareness'),

-- RODE VLAGGEN - ALTIJD ACTIEF
('Retargeting Freq Critical NL', 'retargeting_engagement_nl', 'NL', 'frequency', 'gt', 
 7.00, 'critical', NULL, 'STOP retargeting NL direct!', 
 NULL, NULL, 'leadgen'),

('Retargeting Freq Critical FR', 'retargeting_engagement_fr', 'FR', 'frequency', 'gt', 
 7.00, 'critical', NULL, 'STOP retargeting FR direct!', 
 NULL, NULL, 'leadgen'),

('CPL Spike NL Scraping', 'lookalike_scraping_nl', 'NL', 'cpl', 'gt', 
 16.00, 'critical', NULL, 'CPL verdubbeld! Pause binnen 24u', 
 NULL, NULL, 'leadgen'),

('CPL Spike FR Scraping', 'lookalike_scraping_fr', 'FR', 'cpl', 'gt', 
 64.00, 'critical', NULL, 'CPL verdubbeld! Pause binnen 24u', 
 NULL, NULL, 'leadgen'),

('Geen Leads NL', 'lookalike_%_nl', 'NL', 'days_without_lead', 'gt', 
 7.00, 'critical', NULL, 'Check tracking binnen 24u', 
 NULL, NULL, 'leadgen'),

('Geen Leads FR', 'lookalike_%_fr', 'FR', 'days_without_lead', 'gt', 
 7.00, 'critical', NULL, 'Check tracking binnen 24u', 
 NULL, NULL, 'leadgen'),

('Budget Burn NL', '%_nl', 'NL', 'daily_budget_pct', 'gt', 
 150.00, 'critical', NULL, 'Verlaag bids direct!', 
 NULL, NULL, 'all'),

('Budget Burn FR', '%_fr', 'FR', 'daily_budget_pct', 'gt', 
 150.00, 'critical', NULL, 'Verlaag bids direct!', 
 NULL, NULL, 'all'),

-- WEEK 8 EVALUATIE
('Week 8 Budget Pacing', '%', 'ALL', 'budget_pacing_pct', 'lt', 
 90.00, 'warning', NULL, 'Achter op schema, versnellen', 
 NULL, 8, 'all'),

('Week 8 Budget Overspend', '%', 'ALL', 'budget_pacing_pct', 'gt', 
 110.00, 'warning', NULL, 'Voor op schema, vertragen', 
 NULL, 8, 'all');