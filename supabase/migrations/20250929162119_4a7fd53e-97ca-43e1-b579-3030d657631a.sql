-- Remove all sales status and sales rep values from all form submissions
UPDATE form_submissions 
SET sales_status = NULL, sales_rep = NULL
WHERE sales_status IS NOT NULL OR sales_rep IS NOT NULL;