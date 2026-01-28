-- Create table to store which campaigns should be synced
CREATE TABLE public.meta_sync_campaigns (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id text NOT NULL UNIQUE,
  campaign_name text NOT NULL,
  is_active boolean DEFAULT true,
  last_synced_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create index for lookups
CREATE INDEX idx_meta_sync_campaigns_active ON public.meta_sync_campaigns(is_active);

-- Enable Row Level Security
ALTER TABLE public.meta_sync_campaigns ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow reading meta sync campaigns"
ON public.meta_sync_campaigns
FOR SELECT
USING (true);

CREATE POLICY "Allow inserting meta sync campaigns"
ON public.meta_sync_campaigns
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow updating meta sync campaigns"
ON public.meta_sync_campaigns
FOR UPDATE
USING (true);

CREATE POLICY "Allow deleting meta sync campaigns"
ON public.meta_sync_campaigns
FOR DELETE
USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_meta_sync_campaigns_updated_at
BEFORE UPDATE ON public.meta_sync_campaigns
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();