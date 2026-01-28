-- Create meta_performance table for daily Meta Ads data
CREATE TABLE public.meta_performance (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  date date NOT NULL,
  campaign_name text NOT NULL,
  adset_name text NOT NULL,
  ad_name text NOT NULL,
  spent decimal(10,2) NOT NULL,
  frequency decimal(5,2),
  created_at timestamp with time zone DEFAULT now()
);

-- Create index for common queries
CREATE INDEX idx_meta_performance_date ON public.meta_performance(date);
CREATE INDEX idx_meta_performance_campaign ON public.meta_performance(campaign_name);
CREATE INDEX idx_meta_performance_date_campaign ON public.meta_performance(date, campaign_name);

-- Enable Row Level Security
ALTER TABLE public.meta_performance ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow reading meta performance data"
ON public.meta_performance
FOR SELECT
USING (true);

CREATE POLICY "Allow inserting meta performance data"
ON public.meta_performance
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow updating meta performance data"
ON public.meta_performance
FOR UPDATE
USING (true);

CREATE POLICY "Allow deleting meta performance data"
ON public.meta_performance
FOR DELETE
USING (true);