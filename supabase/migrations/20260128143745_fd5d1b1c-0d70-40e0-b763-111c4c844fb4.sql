-- Create new form_submissions table for 2026
CREATE TABLE public.form_submissions_2026 (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  voornaam text NOT NULL,
  achternaam text NOT NULL,
  bedrijf text NOT NULL,
  email text NOT NULL,
  telefoon text,
  straat text,
  postcode text,
  gemeente text,
  type text NOT NULL,
  message text,
  type_bedrijf text,
  language text NOT NULL DEFAULT 'nl'::text,
  marketing_optin boolean NOT NULL DEFAULT false,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  kwaliteit text,
  toelichting text,
  sales_status text,
  sales_rep text,
  sales_comment text,
  renderbook_type text
);

-- Enable RLS
ALTER TABLE public.form_submissions_2026 ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (same as form_submissions)
CREATE POLICY "Anyone can create form submissions 2026" 
ON public.form_submissions_2026 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow reading form submissions 2026" 
ON public.form_submissions_2026 
FOR SELECT 
USING (true);

CREATE POLICY "Allow updating form submissions 2026" 
ON public.form_submissions_2026 
FOR UPDATE 
USING (true);

-- Add trigger for normalizing type_bedrijf
CREATE TRIGGER normalize_type_bedrijf_2026
BEFORE INSERT OR UPDATE ON public.form_submissions_2026
FOR EACH ROW
EXECUTE FUNCTION public.normalize_type_bedrijf();

-- Add trigger for setting default sales status
CREATE TRIGGER set_default_sales_status_2026
BEFORE UPDATE ON public.form_submissions_2026
FOR EACH ROW
EXECUTE FUNCTION public.set_default_sales_status();