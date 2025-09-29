-- Enable real-time updates for form_submissions table
ALTER TABLE public.form_submissions REPLICA IDENTITY FULL;

-- Add the table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.form_submissions;