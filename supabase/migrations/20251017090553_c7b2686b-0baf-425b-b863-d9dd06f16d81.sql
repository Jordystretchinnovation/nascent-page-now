-- Create colbloc_submissions table with same structure as form_submissions
CREATE TABLE public.colbloc_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  voornaam text NOT NULL,
  achternaam text NOT NULL,
  email text NOT NULL,
  bedrijf text NOT NULL,
  telefoon text,
  straat text,
  postcode text,
  gemeente text,
  type text NOT NULL,
  message text,
  type_bedrijf text,
  marketing_optin boolean NOT NULL DEFAULT false,
  language text NOT NULL DEFAULT 'nl'::text,
  renderbook_type text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  kwaliteit text,
  toelichting text,
  sales_status text,
  sales_rep text,
  sales_comment text
);

-- Enable RLS
ALTER TABLE public.colbloc_submissions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (same as form_submissions)
CREATE POLICY "Anyone can create colbloc submissions"
ON public.colbloc_submissions
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Authenticated users can view all colbloc submissions"
ON public.colbloc_submissions
FOR SELECT
USING (true);

CREATE POLICY "Allow updating colbloc submissions"
ON public.colbloc_submissions
FOR UPDATE
USING (true);

-- Add trigger for type_bedrijf normalization
CREATE TRIGGER normalize_type_bedrijf_colbloc
  BEFORE INSERT OR UPDATE ON public.colbloc_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.normalize_type_bedrijf();

-- Add trigger for default sales status
CREATE TRIGGER set_default_sales_status_colbloc
  BEFORE INSERT OR UPDATE ON public.colbloc_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.set_default_sales_status();

-- Migrate existing colbloc-coeck data
INSERT INTO public.colbloc_submissions (
  id, created_at, voornaam, achternaam, email, bedrijf, telefoon, 
  straat, postcode, gemeente, type, message, type_bedrijf, 
  marketing_optin, language, renderbook_type, utm_source, utm_medium, 
  utm_campaign, utm_term, utm_content, kwaliteit, toelichting, 
  sales_status, sales_rep, sales_comment
)
SELECT 
  id, created_at, voornaam, achternaam, email, bedrijf, telefoon, 
  straat, postcode, gemeente, type, message, type_bedrijf, 
  marketing_optin, language, renderbook_type, utm_source, utm_medium, 
  utm_campaign, utm_term, utm_content, kwaliteit, toelichting, 
  sales_status, sales_rep, sales_comment
FROM public.form_submissions
WHERE type IN ('Brochure Download', 'contactformulier');

-- Delete migrated records from form_submissions
DELETE FROM public.form_submissions
WHERE type IN ('Brochure Download', 'contactformulier');