-- Update sales status to "Gesprek gepland" for specific email address
UPDATE form_submissions 
SET sales_status = 'Gesprek gepland'
WHERE email = 'info@exactinterior.com';