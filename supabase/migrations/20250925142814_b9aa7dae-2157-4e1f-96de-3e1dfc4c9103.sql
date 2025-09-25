-- Add new columns for lead qualification
ALTER TABLE public.form_submissions 
ADD COLUMN kwaliteit TEXT CHECK (kwaliteit IN ('Goed', 'Goed - klant', 'Redelijk', 'Slecht')),
ADD COLUMN toelichting TEXT;