-- Update sales rep to "Michaël" for specific email addresses
UPDATE form_submissions 
SET sales_rep = 'Michaël'
WHERE email IN (
  'tahirilina809@gmail.com',
  'morkosnixo@gmail.com',
  'info@uni-build.be',
  'jodi_cartuyvels@hotmail.com',
  'nika.gordts@sensedesign.be',
  'diego@cucu.be',
  'neal.stegmann@hotmail.com',
  'kst.bvba@telenet.be',
  'pascar.ioana@yahoo.com',
  'olivier@studiofromm.be',
  'tomdeloose@hotmail.be',
  'evelienvanbrabant86@hotmail.com',
  'jacqueline.ruisi@live.be',
  'gilles.hendrickx1@gmail.com',
  'dagummy@gmail.com',
  'info@fugaziprojects.be',
  'ingrid.franssens@telenet.be'
);