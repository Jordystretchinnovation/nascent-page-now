-- Create function for updated_at trigger if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create campaign_budgets table for storing media budget data
CREATE TABLE public.campaign_budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_name TEXT NOT NULL,
  utm_campaign TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  budget DECIMAL(10, 2) NOT NULL,
  start_date DATE,
  end_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.campaign_budgets ENABLE ROW LEVEL SECURITY;

-- RLS policies for campaign_budgets
CREATE POLICY "Authenticated users can view campaign budgets"
ON public.campaign_budgets
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert campaign budgets"
ON public.campaign_budgets
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Authenticated users can update campaign budgets"
ON public.campaign_budgets
FOR UPDATE
USING (true);

CREATE POLICY "Authenticated users can delete campaign budgets"
ON public.campaign_budgets
FOR DELETE
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_campaign_budgets_updated_at
BEFORE UPDATE ON public.campaign_budgets
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();