-- Add UPDATE policy for form submissions
CREATE POLICY "Allow updating form submissions" 
ON public.form_submissions 
FOR UPDATE 
USING (true);