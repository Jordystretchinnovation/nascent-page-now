import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";
import { IK_BEN_EEN_OPTIONS } from "../_shared/ikBenEen.ts";

const PORTAL_ID = "148511656";
const FORM_GUIDS = {
  stalen: "156e5aa3-54f4-49a1-b08a-b4d2a5345f5d",
  renderboek: "5f755978-8346-40d9-83f2-736f22e84320",
} as const;
// Set HUBSPOT_SUBSCRIPTION_TYPE_ID to the marketing subscription type id to record marketing consent.
const SUBSCRIPTION_TYPE_ID = Deno.env.get("HUBSPOT_SUBSCRIPTION_TYPE_ID");

const allowed = IK_BEN_EEN_OPTIONS.map((o) => o.value) as [string, ...string[]];
const s = (max: number) => z.string().trim().max(max).optional().nullable();

const Body = z.object({
  submissionId: z.string().uuid().optional(),
  formType: z.enum(["stalen", "renderboek"]),
  language: z.enum(["nl", "fr"]),
  voornaam: z.string().trim().min(1).max(100),
  achternaam: z.string().trim().min(1).max(100),
  bedrijf: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(255),
  telefoon: s(50), straat: s(255), postcode: s(20), gemeente: s(120),
  ikBenEen: z.enum(allowed),
  marketingOptin: z.boolean(),
  consentText: z.string().max(1000),
  utm_source: s(255), utm_medium: s(255), utm_campaign: s(255), utm_term: s(255), utm_content: s(255),
  fbclid: s(500), gclid: s(500),
  hutk: s(100), pageUri: z.string().max(2000), pageName: z.string().max(500),
});

const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) return json({ error: parsed.error.flatten().fieldErrors }, 400);
    const d = parsed.data;

    const raw: Record<string, string | null | undefined> = {
      firstname: d.voornaam, lastname: d.achternaam, company: d.bedrijf, email: d.email,
      phone: d.telefoon, address: d.straat, zip: d.postcode, city: d.gemeente,
      ik_ben_een: d.ikBenEen,
      lead_magnet: d.formType === "stalen" ? "stalenpakket" : "lookbook",
      form_language: d.language,
      utm_source: d.utm_source, utm_medium: d.utm_medium, utm_campaign: d.utm_campaign,
      utm_term: d.utm_term, utm_content: d.utm_content, fbclid: d.fbclid, gclid: d.gclid,
    };
    const fields = Object.entries(raw)
      .filter(([, v]) => v)
      .map(([name, value]) => ({ objectTypeId: "0-1", name, value }));

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim();
    const context: Record<string, string> = { pageUri: d.pageUri, pageName: d.pageName };
    if (d.hutk) context.hutk = d.hutk;
    if (ip) context.ipAddress = ip;

    const payload: Record<string, unknown> = {
      submittedAt: Date.now().toString(),
      fields,
      context,
      legalConsentOptions: {
        consent: {
          consentToProcess: true,
          text: d.consentText,
          communications: SUBSCRIPTION_TYPE_ID
            ? [{ value: d.marketingOptin, subscriptionTypeId: Number(SUBSCRIPTION_TYPE_ID), text: d.consentText }]
            : [],
        },
      },
    };

    const res = await fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_GUIDS[d.formType]}`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) },
    );
    const text = await res.text();
    if (!res.ok) {
      console.error(`HubSpot submit failed [${res.status}]: ${text}`);
      return json({ error: "HubSpot request failed", status: res.status, details: text }, res.status);
    }

    if (d.submissionId) {
      const url = Deno.env.get("SUPABASE_URL")!;
      const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_ANON_KEY")!;
      await createClient(url, key).from("form_submissions_2026").update({ hubspot_synced: true }).eq("id", d.submissionId);
    }
    return json({ ok: true });
  } catch (e) {
    console.error("hubspot-form-submit error", e);
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
