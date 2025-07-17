
-- Add a language column to the form_submissions table
ALTER TABLE public.form_submissions 
ADD COLUMN language text DEFAULT 'nl' NOT NULL;

-- Add a comment to describe the column
COMMENT ON COLUMN public.form_submissions.language IS 'Language of the form submission (nl for Dutch, fr for French)';
