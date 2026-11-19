const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/hubspot-form-submit`;
const ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const getCookie = (name: string) =>
  document.cookie.split("; ").find((c) => c.startsWith(name + "="))?.split("=")[1] || "";

export interface HubspotLead {
  submissionId?: string;
  formType: "stalen" | "renderboek";
  language: "nl" | "fr";
  voornaam: string;
  achternaam: string;
  bedrijf: string;
  email: string;
  telefoon?: string | null;
  straat?: string | null;
  postcode?: string | null;
  gemeente?: string | null;
  ikBenEen: string;
  marketingOptin: boolean;
  consentText: string;
}

/** Sends the lead to HubSpot. Never throws: our own DB copy is the safety net. */
export async function sendToHubspot(lead: HubspotLead) {
  try {
    const params = new URLSearchParams(window.location.search);
    // keepalive: request survives the navigation to the thank-you page
    const res = await fetch(FN_URL, {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "application/json", apikey: ANON, Authorization: `Bearer ${ANON}` },
      body: JSON.stringify({
        ...lead,
        utm_source: params.get("utm_source") || "",
        utm_medium: params.get("utm_medium") || "",
        utm_campaign: params.get("utm_campaign") || "",
        utm_term: params.get("utm_term") || "",
        utm_content: params.get("utm_content") || "",
        fbclid: params.get("fbclid") || "",
        gclid: params.get("gclid") || "",
        hutk: getCookie("hubspotutk"),
        pageUri: window.location.href,
        pageName: document.title,
      }),
    });
    if (!res.ok) console.error("HubSpot sync failed:", res.status, await res.text());
  } catch (e) {
    console.error("HubSpot sync failed:", e);
  }
}
