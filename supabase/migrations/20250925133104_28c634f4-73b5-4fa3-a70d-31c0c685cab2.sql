-- Add type_bedrijf column to form_submissions table
ALTER TABLE public.form_submissions 
ADD COLUMN type_bedrijf text;