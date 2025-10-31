-- Update email campaign UTM parameters - move old campaign to term, set new campaign
UPDATE form_submissions 
SET 
  utm_term = utm_campaign,
  utm_campaign = '2506_gh9_leads'
WHERE utm_campaign IN (
  'Un impact accru dans votre showroom',
  'Meer impact in je showroom',
  'We hebben je aanvraag voor stalen goed ontvangen!',
  'Pourquoi les cuisinistes choisissent-ils la céramique de 15 mm ?',
  'Waarom kiezen keukenbouwers voor 15 mm keramiek?',
  'E-mail de confirmation - Guide gratuit des tendances cuisine 2025',
  'E-mail de confirmation - Échantillons gratuits demandés'
);