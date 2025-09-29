-- Update quality to "Goed - klant" for specific email addresses
UPDATE form_submissions 
SET kwaliteit = 'Goed - klant'
WHERE email IN (
  'team@yvebe.be',
  'jenno.adriaenssens@icloud.be',
  'info@braeckmansmaatwerk.be',
  'jonas@artifexinterior.be',
  'info@dekeuken-prins.be',
  'info@cuisines-mailleux.be',
  'cedric.hoffelt@hotmail.com',
  'cuisines@batyhome.be',
  'denis.vanboterdal@mons.mobalpa.com',
  'info@cuisitop.be',
  'jonathan.warnier@skynet.be',
  'gaetean@cubeconstruct.be'
);