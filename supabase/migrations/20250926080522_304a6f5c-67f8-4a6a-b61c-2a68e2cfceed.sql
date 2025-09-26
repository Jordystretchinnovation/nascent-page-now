-- Add new columns for sales tracking
ALTER TABLE public.form_submissions 
ADD COLUMN sales_status TEXT,
ADD COLUMN sales_rep TEXT,
ADD COLUMN sales_comment TEXT;