-- Remove all quality statuses from all form submissions
UPDATE form_submissions 
SET kwaliteit = NULL
WHERE kwaliteit IS NOT NULL;