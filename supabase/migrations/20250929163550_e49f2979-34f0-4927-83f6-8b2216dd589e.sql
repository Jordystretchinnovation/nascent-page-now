-- Update sales status to "Afgewezen" for specific email addresses
UPDATE form_submissions 
SET sales_status = 'Afgewezen'
WHERE email IN (
  'charlotte.fockedey@gmail.com',
  'info@fugaziprojects.be',
  'info@guidosse.com',
  'gaetan.ackermans@hotmail.com',
  'leadegobert@gmail.com',
  'brigittepalmiero@gmail.com',
  'bjorn.vanalderwerelt@telenet.be'
);