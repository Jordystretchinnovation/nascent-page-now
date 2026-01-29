-- Insert dummy meta_performance data for 4 weeks (Feb 2 - Mar 1, 2026)
-- Campaign names based on Q1 2026 structure

-- NL Leadgen Campaign
INSERT INTO meta_performance (date, campaign_name, adset_name, ad_name, spent, frequency) VALUES
-- Week 1
('2026-02-02', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_scraping_nl', 'ad_scraping_nl_v1', 45.50, 1.2),
('2026-02-03', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_scraping_nl', 'ad_scraping_nl_v1', 52.30, 1.3),
('2026-02-04', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_scraping_nl', 'ad_scraping_nl_v1', 48.20, 1.4),
('2026-02-05', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_scraping_nl', 'ad_scraping_nl_v1', 55.00, 1.5),
('2026-02-06', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_scraping_nl', 'ad_scraping_nl_v1', 60.10, 1.6),
('2026-02-07', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_scraping_nl', 'ad_scraping_nl_v1', 42.80, 1.7),
('2026-02-08', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_scraping_nl', 'ad_scraping_nl_v1', 38.50, 1.8),
-- Week 2
('2026-02-09', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_scraping_nl', 'ad_scraping_nl_v1', 50.20, 2.0),
('2026-02-10', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_scraping_nl', 'ad_scraping_nl_v1', 55.80, 2.1),
('2026-02-11', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_scraping_nl', 'ad_scraping_nl_v1', 48.90, 2.2),
('2026-02-12', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_scraping_nl', 'ad_scraping_nl_v1', 62.40, 2.3),
('2026-02-13', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_scraping_nl', 'ad_scraping_nl_v1', 58.30, 2.4),
('2026-02-14', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_scraping_nl', 'ad_scraping_nl_v1', 45.60, 2.5),
('2026-02-15', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_scraping_nl', 'ad_scraping_nl_v1', 40.20, 2.6),
-- Week 3
('2026-02-16', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_scraping_nl', 'ad_scraping_nl_v1', 52.50, 2.8),
('2026-02-17', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_scraping_nl', 'ad_scraping_nl_v1', 58.10, 2.9),
('2026-02-18', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_scraping_nl', 'ad_scraping_nl_v1', 49.80, 3.0),
('2026-02-19', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_scraping_nl', 'ad_scraping_nl_v1', 63.20, 3.1),
('2026-02-20', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_scraping_nl', 'ad_scraping_nl_v1', 55.90, 3.2),
('2026-02-21', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_scraping_nl', 'ad_scraping_nl_v1', 47.40, 3.3),
('2026-02-22', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_scraping_nl', 'ad_scraping_nl_v1', 41.80, 3.4),
-- Week 4
('2026-02-23', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_scraping_nl', 'ad_scraping_nl_v1', 54.30, 3.5),
('2026-02-24', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_scraping_nl', 'ad_scraping_nl_v1', 59.70, 3.6),
('2026-02-25', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_scraping_nl', 'ad_scraping_nl_v1', 51.20, 3.7),
('2026-02-26', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_scraping_nl', 'ad_scraping_nl_v1', 64.80, 3.8),
('2026-02-27', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_scraping_nl', 'ad_scraping_nl_v1', 57.50, 3.9),
('2026-02-28', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_scraping_nl', 'ad_scraping_nl_v1', 48.90, 4.0),
('2026-03-01', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_scraping_nl', 'ad_scraping_nl_v1', 43.60, 4.1),

-- Retargeting NL (higher frequency - approaching threshold)
('2026-02-02', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'retargeting_engagement_nl', 'ad_retargeting_nl_v1', 35.20, 2.5),
('2026-02-03', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'retargeting_engagement_nl', 'ad_retargeting_nl_v1', 38.50, 2.8),
('2026-02-04', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'retargeting_engagement_nl', 'ad_retargeting_nl_v1', 42.10, 3.2),
('2026-02-05', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'retargeting_engagement_nl', 'ad_retargeting_nl_v1', 45.80, 3.6),
('2026-02-06', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'retargeting_engagement_nl', 'ad_retargeting_nl_v1', 48.30, 4.0),
('2026-02-07', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'retargeting_engagement_nl', 'ad_retargeting_nl_v1', 35.60, 4.2),
('2026-02-08', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'retargeting_engagement_nl', 'ad_retargeting_nl_v1', 32.40, 4.5),
('2026-02-09', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'retargeting_engagement_nl', 'ad_retargeting_nl_v1', 40.20, 4.8),
('2026-02-10', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'retargeting_engagement_nl', 'ad_retargeting_nl_v1', 44.80, 5.1),
('2026-02-11', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'retargeting_engagement_nl', 'ad_retargeting_nl_v1', 38.90, 5.4),
('2026-02-12', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'retargeting_engagement_nl', 'ad_retargeting_nl_v1', 50.40, 5.7),
('2026-02-13', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'retargeting_engagement_nl', 'ad_retargeting_nl_v1', 46.30, 6.0),
('2026-02-14', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'retargeting_engagement_nl', 'ad_retargeting_nl_v1', 37.60, 6.3),
('2026-02-15', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'retargeting_engagement_nl', 'ad_retargeting_nl_v1', 34.20, 6.5),
('2026-02-16', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'retargeting_engagement_nl', 'ad_retargeting_nl_v1', 42.50, 6.8),
('2026-02-17', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'retargeting_engagement_nl', 'ad_retargeting_nl_v1', 48.10, 7.1),
('2026-02-18', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'retargeting_engagement_nl', 'ad_retargeting_nl_v1', 39.80, 7.4),
('2026-02-19', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'retargeting_engagement_nl', 'ad_retargeting_nl_v1', 53.20, 7.6),
('2026-02-20', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'retargeting_engagement_nl', 'ad_retargeting_nl_v1', 45.90, 7.8),
('2026-02-21', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'retargeting_engagement_nl', 'ad_retargeting_nl_v1', 38.40, 8.0),
('2026-02-22', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'retargeting_engagement_nl', 'ad_retargeting_nl_v1', 33.80, 8.2),
('2026-02-23', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'retargeting_engagement_nl', 'ad_retargeting_nl_v1', 44.30, 8.5),
('2026-02-24', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'retargeting_engagement_nl', 'ad_retargeting_nl_v1', 49.70, 8.7),
('2026-02-25', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'retargeting_engagement_nl', 'ad_retargeting_nl_v1', 41.20, 8.9),
('2026-02-26', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'retargeting_engagement_nl', 'ad_retargeting_nl_v1', 54.80, 9.1),
('2026-02-27', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'retargeting_engagement_nl', 'ad_retargeting_nl_v1', 47.50, 9.3),
('2026-02-28', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'retargeting_engagement_nl', 'ad_retargeting_nl_v1', 40.90, 9.5),
('2026-03-01', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'retargeting_engagement_nl', 'ad_retargeting_nl_v1', 36.60, 9.7),

-- LAL Leads NL
('2026-02-02', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_leads_nl', 'ad_leads_nl_v1', 28.50, 1.1),
('2026-02-05', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_leads_nl', 'ad_leads_nl_v1', 32.00, 1.4),
('2026-02-08', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_leads_nl', 'ad_leads_nl_v1', 25.80, 1.7),
('2026-02-11', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_leads_nl', 'ad_leads_nl_v1', 35.40, 2.0),
('2026-02-14', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_leads_nl', 'ad_leads_nl_v1', 29.60, 2.3),
('2026-02-17', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_leads_nl', 'ad_leads_nl_v1', 38.20, 2.6),
('2026-02-20', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_leads_nl', 'ad_leads_nl_v1', 33.50, 2.9),
('2026-02-23', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_leads_nl', 'ad_leads_nl_v1', 40.10, 3.2),
('2026-02-26', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_leads_nl', 'ad_leads_nl_v1', 36.80, 3.5),
('2026-03-01', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_leads_nl', 'ad_leads_nl_v1', 31.20, 3.8),

-- FR Leadgen Campaign
('2026-02-02', 'stretch_be_nl_26_02_mofu_leadgen_scaling_fr', 'lookalike_scraping_fr', 'ad_scraping_fr_v1', 65.50, 1.3),
('2026-02-05', 'stretch_be_nl_26_02_mofu_leadgen_scaling_fr', 'lookalike_scraping_fr', 'ad_scraping_fr_v1', 72.30, 1.6),
('2026-02-08', 'stretch_be_nl_26_02_mofu_leadgen_scaling_fr', 'lookalike_scraping_fr', 'ad_scraping_fr_v1', 58.20, 1.9),
('2026-02-11', 'stretch_be_nl_26_02_mofu_leadgen_scaling_fr', 'lookalike_scraping_fr', 'ad_scraping_fr_v1', 78.00, 2.2),
('2026-02-14', 'stretch_be_nl_26_02_mofu_leadgen_scaling_fr', 'lookalike_scraping_fr', 'ad_scraping_fr_v1', 66.10, 2.5),
('2026-02-17', 'stretch_be_nl_26_02_mofu_leadgen_scaling_fr', 'lookalike_scraping_fr', 'ad_scraping_fr_v1', 82.80, 2.8),
('2026-02-20', 'stretch_be_nl_26_02_mofu_leadgen_scaling_fr', 'lookalike_scraping_fr', 'ad_scraping_fr_v1', 70.50, 3.1),
('2026-02-23', 'stretch_be_nl_26_02_mofu_leadgen_scaling_fr', 'lookalike_scraping_fr', 'ad_scraping_fr_v1', 88.20, 3.4),
('2026-02-26', 'stretch_be_nl_26_02_mofu_leadgen_scaling_fr', 'lookalike_scraping_fr', 'ad_scraping_fr_v1', 75.80, 3.7),
('2026-03-01', 'stretch_be_nl_26_02_mofu_leadgen_scaling_fr', 'lookalike_scraping_fr', 'ad_scraping_fr_v1', 62.50, 4.0),

-- Retargeting FR
('2026-02-02', 'stretch_be_nl_26_02_mofu_leadgen_scaling_fr', 'retargeting_engagement_fr', 'ad_retargeting_fr_v1', 42.20, 2.8),
('2026-02-05', 'stretch_be_nl_26_02_mofu_leadgen_scaling_fr', 'retargeting_engagement_fr', 'ad_retargeting_fr_v1', 48.50, 3.4),
('2026-02-08', 'stretch_be_nl_26_02_mofu_leadgen_scaling_fr', 'retargeting_engagement_fr', 'ad_retargeting_fr_v1', 38.10, 4.0),
('2026-02-11', 'stretch_be_nl_26_02_mofu_leadgen_scaling_fr', 'retargeting_engagement_fr', 'ad_retargeting_fr_v1', 55.80, 4.6),
('2026-02-14', 'stretch_be_nl_26_02_mofu_leadgen_scaling_fr', 'retargeting_engagement_fr', 'ad_retargeting_fr_v1', 46.30, 5.2),
('2026-02-17', 'stretch_be_nl_26_02_mofu_leadgen_scaling_fr', 'retargeting_engagement_fr', 'ad_retargeting_fr_v1', 58.10, 5.8),
('2026-02-20', 'stretch_be_nl_26_02_mofu_leadgen_scaling_fr', 'retargeting_engagement_fr', 'ad_retargeting_fr_v1', 49.80, 6.4),
('2026-02-23', 'stretch_be_nl_26_02_mofu_leadgen_scaling_fr', 'retargeting_engagement_fr', 'ad_retargeting_fr_v1', 62.20, 7.0),
('2026-02-26', 'stretch_be_nl_26_02_mofu_leadgen_scaling_fr', 'retargeting_engagement_fr', 'ad_retargeting_fr_v1', 52.90, 7.6),
('2026-03-01', 'stretch_be_nl_26_02_mofu_leadgen_scaling_fr', 'retargeting_engagement_fr', 'ad_retargeting_fr_v1', 44.40, 8.2),

-- LAL Leads FR
('2026-02-02', 'stretch_be_nl_26_02_mofu_leadgen_scaling_fr', 'lookalike_leads_fr', 'ad_leads_fr_v1', 38.50, 1.2),
('2026-02-08', 'stretch_be_nl_26_02_mofu_leadgen_scaling_fr', 'lookalike_leads_fr', 'ad_leads_fr_v1', 42.80, 1.8),
('2026-02-14', 'stretch_be_nl_26_02_mofu_leadgen_scaling_fr', 'lookalike_leads_fr', 'ad_leads_fr_v1', 36.60, 2.4),
('2026-02-20', 'stretch_be_nl_26_02_mofu_leadgen_scaling_fr', 'lookalike_leads_fr', 'ad_leads_fr_v1', 48.20, 3.0),
('2026-02-26', 'stretch_be_nl_26_02_mofu_leadgen_scaling_fr', 'lookalike_leads_fr', 'ad_leads_fr_v1', 41.50, 3.6),
('2026-03-01', 'stretch_be_nl_26_02_mofu_leadgen_scaling_fr', 'lookalike_leads_fr', 'ad_leads_fr_v1', 35.80, 4.2),

-- Awareness Campaign
('2026-02-02', 'stretch_be_nl_26_02_tofu_traffic_awareness_nl', 'lookalike_leads_customers_nl', 'ad_awareness_nl_v1', 22.50, 1.0),
('2026-02-05', 'stretch_be_nl_26_02_tofu_traffic_awareness_nl', 'lookalike_leads_customers_nl', 'ad_awareness_nl_v1', 25.30, 1.2),
('2026-02-08', 'stretch_be_nl_26_02_tofu_traffic_awareness_nl', 'lookalike_leads_customers_nl', 'ad_awareness_nl_v1', 20.20, 1.4),
('2026-02-11', 'stretch_be_nl_26_02_tofu_traffic_awareness_nl', 'lookalike_leads_customers_nl', 'ad_awareness_nl_v1', 28.00, 1.6),
('2026-02-14', 'stretch_be_nl_26_02_tofu_traffic_awareness_nl', 'lookalike_leads_customers_nl', 'ad_awareness_nl_v1', 24.10, 1.8),
('2026-02-17', 'stretch_be_nl_26_02_tofu_traffic_awareness_nl', 'lookalike_leads_customers_nl', 'ad_awareness_nl_v1', 30.80, 2.0),
('2026-02-20', 'stretch_be_nl_26_02_tofu_traffic_awareness_nl', 'lookalike_leads_customers_nl', 'ad_awareness_nl_v1', 26.50, 2.2),
('2026-02-23', 'stretch_be_nl_26_02_tofu_traffic_awareness_nl', 'lookalike_leads_customers_nl', 'ad_awareness_nl_v1', 32.20, 2.4),
('2026-02-26', 'stretch_be_nl_26_02_tofu_traffic_awareness_nl', 'lookalike_leads_customers_nl', 'ad_awareness_nl_v1', 28.80, 2.6),
('2026-03-01', 'stretch_be_nl_26_02_tofu_traffic_awareness_nl', 'lookalike_leads_customers_nl', 'ad_awareness_nl_v1', 24.50, 2.8);

-- Insert form submissions (leads) with utm_content matching adset names
INSERT INTO form_submissions_2026 (created_at, voornaam, achternaam, bedrijf, email, telefoon, type, language, utm_source, utm_medium, utm_campaign, utm_content, kwaliteit, sales_status, postcode, gemeente) VALUES
-- NL Leads from LAL Scraping (good performance, low CPL)
('2026-02-03 10:30:00+01', 'Jan', 'de Vries', 'Keuken Plus BV', 'jan@keukenplus.nl', '+31612345678', 'stalen', 'nl', 'facebook', 'paid', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_scraping_nl', 'Goed', 'Te contacteren', '1234AB', 'Amsterdam'),
('2026-02-05 14:20:00+01', 'Pieter', 'Bakker', 'Interieurs Modern', 'pieter@interieursmodern.nl', '+31623456789', 'lookbook', 'nl', 'facebook', 'paid', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_scraping_nl', 'Goed', 'Gecontacteerd', '5678CD', 'Rotterdam'),
('2026-02-07 09:15:00+01', 'Maria', 'Jansen', 'Woonstijl', 'maria@woonstijl.nl', '+31634567890', 'stalen', 'nl', 'facebook', 'paid', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_scraping_nl', 'Redelijk', 'Te contacteren', '9012EF', 'Utrecht'),
('2026-02-10 16:45:00+01', 'Willem', 'Smit', 'Design Keukens', 'willem@designkeukens.nl', '+31645678901', 'lookbook', 'nl', 'facebook', 'paid', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_scraping_nl', 'Goed', 'Afspraak gepland', '3456GH', 'Den Haag'),
('2026-02-13 11:00:00+01', 'Anna', 'van den Berg', 'Keuken Atelier', 'anna@keukenatelier.nl', '+31656789012', 'stalen', 'nl', 'facebook', 'paid', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_scraping_nl', 'Goed - klant', 'Offerte verstuurd', '7890IJ', 'Eindhoven'),
('2026-02-16 13:30:00+01', 'Thomas', 'Visser', 'Keukenwereld', 'thomas@keukenwereld.nl', '+31667890123', 'lookbook', 'nl', 'facebook', 'paid', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_scraping_nl', 'Goed', 'Te contacteren', '1122KL', 'Groningen'),
('2026-02-19 10:00:00+01', 'Sophie', 'de Boer', 'Modern Living', 'sophie@modernliving.nl', '+31678901234', 'stalen', 'nl', 'facebook', 'paid', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_scraping_nl', 'Redelijk', 'Gecontacteerd', '3344MN', 'Maastricht'),
('2026-02-22 15:15:00+01', 'Lucas', 'Mulder', 'Interieur Experts', 'lucas@interieurexperts.nl', '+31689012345', 'lookbook', 'nl', 'facebook', 'paid', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_scraping_nl', 'Goed', 'Te contacteren', '5566OP', 'Breda'),
('2026-02-25 08:45:00+01', 'Emma', 'van Dijk', 'Keuken Studio', 'emma@keukenstudio.nl', '+31690123456', 'stalen', 'nl', 'facebook', 'paid', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_scraping_nl', 'Goed', 'Afspraak gepland', '7788QR', 'Nijmegen'),
('2026-02-28 12:00:00+01', 'Daan', 'Hendriks', 'Woon Inspiratie', 'daan@wooninspiratie.nl', '+31601234567', 'lookbook', 'nl', 'facebook', 'paid', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_scraping_nl', 'Goed', 'Te contacteren', '9900ST', 'Tilburg'),

-- NL Leads from Retargeting (fewer leads, higher CPL)
('2026-02-08 11:30:00+01', 'Kees', 'Brouwer', 'Classic Keukens', 'kees@classickeukens.nl', '+31612121212', 'stalen', 'nl', 'facebook', 'paid', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'retargeting_engagement_nl', 'Goed', 'Gecontacteerd', '1010AB', 'Haarlem'),
('2026-02-18 14:00:00+01', 'Lisa', 'van Leeuwen', 'Keuken Dromen', 'lisa@keukendromen.nl', '+31623232323', 'lookbook', 'nl', 'facebook', 'paid', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'retargeting_engagement_nl', 'Redelijk', 'Te contacteren', '2020CD', 'Leiden'),
('2026-02-25 10:30:00+01', 'Mark', 'de Jong', 'Premium Interieurs', 'mark@premiuminterieurs.nl', '+31634343434', 'stalen', 'nl', 'facebook', 'paid', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'retargeting_engagement_nl', 'Slecht', NULL, '3030EF', 'Almere'),

-- NL Leads from LAL Leads
('2026-02-12 09:00:00+01', 'Rob', 'Dijkstra', 'Keuken Centrum', 'rob@keukencentrum.nl', '+31645454545', 'stalen', 'nl', 'facebook', 'paid', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_leads_nl', 'Goed', 'Te contacteren', '4040GH', 'Arnhem'),
('2026-02-22 16:30:00+01', 'Fleur', 'Vermeer', 'Design House', 'fleur@designhouse.nl', '+31656565656', 'lookbook', 'nl', 'facebook', 'paid', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_leads_nl', 'Goed', 'Afspraak gepland', '5050IJ', 'Apeldoorn'),
('2026-02-28 11:15:00+01', 'Bas', 'van der Meer', 'Keukens Op Maat', 'bas@keukensop maat.nl', '+31667676767', 'stalen', 'nl', 'facebook', 'paid', 'stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'lookalike_leads_nl', 'Redelijk', 'Gecontacteerd', '6060KL', 'Enschede'),

-- FR Leads from LAL Scraping
('2026-02-04 10:00:00+01', 'Jean', 'Dupont', 'Cuisines Modernes', 'jean@cuisinesmodernes.be', '+32478123456', 'stalen', 'fr', 'facebook', 'paid', 'stretch_be_nl_26_02_mofu_leadgen_scaling_fr', 'lookalike_scraping_fr', 'Goed', 'Te contacteren', '1000', 'Bruxelles'),
('2026-02-11 14:30:00+01', 'Marie', 'Martin', 'Intérieur Design', 'marie@interieurdesign.be', '+32478234567', 'lookbook', 'fr', 'facebook', 'paid', 'stretch_be_nl_26_02_mofu_leadgen_scaling_fr', 'lookalike_scraping_fr', 'Goed', 'Gecontacteerd', '4000', 'Liège'),
('2026-02-19 09:45:00+01', 'Pierre', 'Bernard', 'Cuisine Expert', 'pierre@cuisineexpert.be', '+32478345678', 'stalen', 'fr', 'facebook', 'paid', 'stretch_be_nl_26_02_mofu_leadgen_scaling_fr', 'lookalike_scraping_fr', 'Redelijk', 'Te contacteren', '6000', 'Charleroi'),
('2026-02-26 15:00:00+01', 'Sophie', 'Petit', 'Maison & Cuisine', 'sophie@maisonetcuisine.be', '+32478456789', 'lookbook', 'fr', 'facebook', 'paid', 'stretch_be_nl_26_02_mofu_leadgen_scaling_fr', 'lookalike_scraping_fr', 'Goed', 'Afspraak gepland', '5000', 'Namur'),

-- FR Leads from Retargeting (poor performance)
('2026-02-15 12:00:00+01', 'François', 'Leroy', 'Cuisine Belge', 'francois@cuisinebelge.be', '+32478567890', 'stalen', 'fr', 'facebook', 'paid', 'stretch_be_nl_26_02_mofu_leadgen_scaling_fr', 'retargeting_engagement_fr', 'Slecht', NULL, '7000', 'Mons'),

-- FR Leads from LAL Leads
('2026-02-10 11:00:00+01', 'Claire', 'Dubois', 'Aménagement Intérieur', 'claire@amenagementinterieur.be', '+32478678901', 'lookbook', 'fr', 'facebook', 'paid', 'stretch_be_nl_26_02_mofu_leadgen_scaling_fr', 'lookalike_leads_fr', 'Goed', 'Te contacteren', '1348', 'Louvain-la-Neuve'),
('2026-02-24 13:30:00+01', 'Antoine', 'Moreau', 'Design Cuisine', 'antoine@designcuisine.be', '+32478789012', 'stalen', 'fr', 'facebook', 'paid', 'stretch_be_nl_26_02_mofu_leadgen_scaling_fr', 'lookalike_leads_fr', 'Redelijk', 'Gecontacteerd', '1420', 'Braine-l''Alleud');

-- Insert some triggered alerts for testing
INSERT INTO triggered_alerts (campaign_name, adset_name, metric_name, current_value, threshold_value, severity, status, triggered_at) VALUES
('stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'retargeting_engagement_nl', 'frequency', 9.7, 7.0, 'critical', 'open', '2026-02-28 08:00:00+01'),
('stretch_be_nl_26_02_mofu_leadgen_scaling_fr', 'retargeting_engagement_fr', 'frequency', 8.2, 7.0, 'critical', 'open', '2026-02-27 14:30:00+01'),
('stretch_be_nl_26_02_mofu_leadgen_scaling_fr', 'lookalike_scraping_fr', 'cpl', 38.50, 32.00, 'warning', 'open', '2026-02-26 10:00:00+01'),
('stretch_be_nl_26_02_mofu_leadgen_scaling_nl', 'retargeting_engagement_nl', 'days_without_lead', 6, 5, 'warning', 'open', '2026-03-01 09:00:00+01');

-- Insert decision triggers if they don't exist
INSERT INTO decision_triggers (trigger_name, adset_pattern, market, metric, operator, threshold_value, severity, action_fail, evaluation_week, applies_to_campaign_type, is_active) VALUES
('Frequency Critical NL', 'retargeting_engagement_nl', 'NL', 'frequency', 'gt', 7.0, 'critical', 'Pause adset en shift budget naar LAL Scraping', NULL, 'leadgen', true),
('Frequency Critical FR', 'retargeting_engagement_fr', 'FR', 'frequency', 'gt', 7.0, 'critical', 'Pause adset en shift budget naar LAL Scraping', NULL, 'leadgen', true),
('CPL Warning NL Scraping', 'lookalike_scraping_nl', 'NL', 'cpl', 'gt', 12.0, 'warning', 'Monitor en optimaliseer creatives', 4, 'leadgen', true),
('CPL Warning FR Scraping', 'lookalike_scraping_fr', 'FR', 'cpl', 'gt', 38.0, 'warning', 'Monitor en optimaliseer creatives', 4, 'leadgen', true),
('Days Without Lead', '%', NULL, 'days_without_lead', 'gt', 5, 'warning', 'Check targeting en creatives', NULL, 'leadgen', true),
('Week 4 Eval NL Retargeting', 'retargeting_engagement_nl', 'NL', 'cpl', 'gt', 14.50, 'info', 'Evalueer budget shift naar betere audiences', 4, 'leadgen', true),
('Week 4 Eval FR Retargeting', 'retargeting_engagement_fr', 'FR', 'cpl', 'gt', 46.00, 'info', 'Evalueer budget shift naar betere audiences', 4, 'leadgen', true)
ON CONFLICT DO NOTHING;