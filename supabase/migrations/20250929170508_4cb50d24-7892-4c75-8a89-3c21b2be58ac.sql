-- Set default sales status to "Te contacteren" for qualified leads that don't have a sales status yet
UPDATE form_submissions 
SET sales_status = 'Te contacteren'
WHERE (kwaliteit = 'Goed' OR kwaliteit = 'Goed - klant' OR kwaliteit = 'Redelijk')
AND (sales_status IS NULL OR sales_status = '');