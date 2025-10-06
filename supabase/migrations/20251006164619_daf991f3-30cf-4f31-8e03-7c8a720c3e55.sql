-- Clear marketing status for the specified email
UPDATE public.form_submissions 
SET kwaliteit = NULL 
WHERE email = 'info@inovainterieurafwerking.be';