# Lookbook type + Covarte marketing-abonnement naar HubSpot

## 1. Type Collection Lookbook (Digitaal / Fysiek)
- Het lookbookformulier (NL + FR, alle pagina's) stuurt de keuze naar HubSpot in de eigenschap `renderbook_type`, met waarde `digitaal` of `fysiek`.
- Kies je "Fysiek", dan gaan straat, postcode en gemeente mee naar HubSpot (`address`, `zip`, `city`). Dat gebeurt nu al wanneer die velden ingevuld zijn; ik zorg dat het voor Fysiek altijd zo is. Bij "Digitaal" gaat alleen de gemeente mee.

**Wat jij in HubSpot doet:**
- Maak de contact-eigenschap `renderbook_type` aan (keuzelijst met interne waarden `digitaal` en `fysiek`).
- Voeg aan het formulier "Covarte – Lookbook 2026" `renderbook_type` toe als verborgen veld, en ook `address` en `zip` (niet verplicht). Anders weigert HubSpot die velden.

## 2. Marketingtoestemming in "Marketing information - Covarte"
- Wie het toestemmingsvakje aanvinkt, wordt in HubSpot ingeschreven op het abonnement "Marketing information - Covarte" (niet op Coeck).
- Daarvoor heb ik het interne nummer van dat abonnement nodig. Dat staat niet in de HubSpot-schermen, dus ik zoek het zelf op: ik vraag je éénmalig om HubSpot te koppelen in deze chat (alleen voor mij tijdens het bouwen), lees de lijst met abonnementen en zet het juiste nummer vast in de koppeling.
- Wil je die koppeling liever niet maken, dan zoek ik het op via een eenmalige testinzending of krijg je van mij korte instructies.

## Technische details
- `hubspot.ts` + edge function: veld `renderbookType` (enum `digitaal|fysiek`, optioneel) toevoegen, mappen naar `renderbook_type`.
- Doorgeven vanuit `CTAForm`, `CTAFormFr`, `CTAFormDirect`, `CTAFormDirectFr` (`renderbookType` state bestaat al).
- Subscription-type-ID opzoeken via HubSpot MCP (`communication-preferences` definitions) en als constante in de edge function zetten in plaats van de ontbrekende `HUBSPOT_SUBSCRIPTION_TYPE_ID`-secret.
- Testen met één testinzending per formulier; eigen testrijen worden daarna verwijderd.
