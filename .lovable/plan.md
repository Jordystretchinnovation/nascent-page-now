# HubSpot-koppeling stalenpakket- en lookbookformulier

## Wat jij in HubSpot (portal 148511656) aanmaakt

### 1. Eigen contact-eigenschappen (Instellingen → Eigenschappen → Contact)
| Label | Interne naam | Type |
|---|---|---|
| Ik ben een... | `ik_ben_een` | Keuzelijst (dropdown) met de 28 waarden uit je CSV (Handelaar ... Bestratingshandel). Interne waarde = label. |
| Lead magnet | `lead_magnet` | Keuzelijst: `stalenpakket`, `lookbook` |
| Taal formulier | `form_language` | Keuzelijst: `nl`, `fr` |
| UTM source / medium / campaign / term / content | `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content` | Eén regel tekst |
| Facebook click ID | `fbclid` | Eén regel tekst |
| Google click ID | `gclid` | Eén regel tekst |

Standaardvelden die al bestaan: `firstname`, `lastname`, `company`, `email`, `phone`, `address`, `zip`, `city`.

### 2. Formulier "Covarte – Stalenpakket 2026"
Velden (allemaal toevoegen, verborgen velden mogen verborgen staan):
- `firstname`, `lastname`, `company`, `email` (verplicht)
- `phone`, `address`, `zip`, `city` (verplicht)
- `ik_ben_een` (verplicht)
- Verborgen: `lead_magnet`, `form_language`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `fbclid`, `gclid`
- Toestemming: zet "GDPR / communicatietoestemming" aan, met een abonnementstype voor marketing (bv. "Marketing informatie") en "verwerking van gegevens".

### 3. Formulier "Covarte – Lookbook 2026"
- `firstname`, `lastname`, `company`, `email` (verplicht)
- `city` = "Gemeente" (verplicht)
- `ik_ben_een` (verplicht)
- Dezelfde verborgen velden en toestemming als hierboven

Daarna stuur je mij: de 2 form-ID's (in de URL van de formulier-editor) en de ID van het marketing-abonnementstype (Instellingen → Marketing → Abonnementen).

Eén formulier per lead magnet volstaat voor NL en FR; `form_language` maakt het onderscheid. Wil je liever aparte FR-formulieren, dan worden dat er 4.

## Wat ik in de app bouw
- Nieuw veld "Ik ben een..." (dropdown, verplicht) op stalen- en lookbookformulier; FR-versie "Je suis un..." afhankelijk van je antwoord op de taalvraag.
- Lookbookformulier: veld "Gemeente" toegevoegd (verplicht).
- Bij verzenden: inzending wordt zoals nu in onze eigen database bewaard (dashboards blijven werken) én doorgestuurd naar HubSpot.
- Tracking die meegaat naar HubSpot:
  - `hutk`-cookie (HubSpot-bezoekers-ID) zodat de lead gekoppeld wordt aan eerdere paginabezoeken en bronnen
  - pagina-URL, paginatitel, IP-adres van de bezoeker
  - UTM's, fbclid, gclid
  - toestemming voor verwerking en marketing (legal consent)
- HubSpot-trackingscript (portal 148511656) op alle landingspagina's, zodat bezoeken en bronattributie in HubSpot verschijnen.
- Faalt HubSpot, dan krijgt de bezoeker toch de bedankpagina en blijft de lead bewaard; de fout wordt gelogd.

## Technische details
- Edge function `hubspot-form-submit` roept `POST https://api.hsforms.com/submissions/v3/integration/submit/148511656/{formGuid}` aan met `fields`, `context { hutk, pageUri, pageName, ipAddress }`, `legalConsentOptions`. Geen API-sleutel nodig; IP komt uit `x-forwarded-for`.
- Form-GUIDs en subscription-type-ID als configuratie in de function; inputvalidatie met zod; `ik_ben_een` gevalideerd tegen de CSV-lijst.
- Nieuwe kolommen `ik_ben_een` en `hubspot_synced` (bool) in `form_submissions_2026`.
- Trackingscript `//js-eu1.hs-scripts.com/148511656.js` (of na1, afhankelijk van datacenter van je portal) in `index.html`, met respect voor cookiebanner indien aanwezig.
- Aangepaste bestanden: `CTAForm(Direct)(Fr).tsx`, lookbook-formulieren, `index.html`.
