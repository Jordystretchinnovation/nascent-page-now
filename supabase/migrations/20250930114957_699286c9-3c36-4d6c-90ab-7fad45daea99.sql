-- Delete all submissions from specified test email addresses
DELETE FROM form_submissions 
WHERE email IN (
  'elise.brys@coeck.be',
  'jordy@stretchinnovation.be',
  'pierre@stretchinnovation.be',
  'test@gmail.com',
  'test@test.be'
);