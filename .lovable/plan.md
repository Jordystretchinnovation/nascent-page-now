# Sneller verzenden van de formulieren

## Waarom het nu traag voelt
Na een klik op "Verstuur" gebeurt alles na elkaar:
1. lead opslaan in onze database (wachten)
2. lead doorsturen naar HubSpot (wachten, ~0,3-1 s)
3. nog eens een vaste pauze van 1 seconde voor de bedankpagina opent

## Wat ik verander (4 formulieren: stalen + lookbook, NL + FR, ook op de aparte landingspagina's)
- **Geen vaste pauze meer**: de bedankpagina opent meteen zodra de lead is opgeslagen.
- **HubSpot op de achtergrond**: de lead wordt naar HubSpot gestuurd zonder dat de klant erop wacht. Dat gaat gewoon door terwijl de bedankpagina laadt (ook de automatische download).
- **Opslaan en HubSpot tegelijk**: beide vertrekken op hetzelfde moment in plaats van na elkaar.
- De knop toont meteen "Bezig met versturen..." en blijft geblokkeerd tegen dubbelklikken.
- De extra pop-up "Aanvraag verzonden!" vervalt, want de klant ziet direct de bedankpagina.

Resultaat: van klik tot bedankpagina gaat van ongeveer 1,5-2,5 s naar ongeveer 0,3 s.

Veiligheid blijft gelijk: de lead staat altijd in onze database en het vinkje "naar HubSpot gestuurd" wordt nog steeds gezet.

## Technische details
- Het ID voor de inzending wordt in de browser gemaakt (`crypto.randomUUID()`) en meegegeven bij de insert, dus `.select()` is niet meer nodig en de HubSpot-call heeft het ID meteen.
- `sendToHubspot` wordt aangeroepen zonder `await`, met `keepalive` via een directe `fetch` naar de functie-URL zodat het verzoek niet afbreekt als de pagina wisselt.
- `await` alleen op de database-insert, daarna direct `navigate()`; `setTimeout(…, 1000)` en de succes-toast worden verwijderd.
- Bestanden: `CTAForm.tsx`, `CTAFormFr.tsx`, `CTAFormDirect.tsx`, `CTAFormDirectFr.tsx`, `src/lib/hubspot.ts`.
