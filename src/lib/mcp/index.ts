import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listLeads from "./tools/list-leads";
import leadFunnelSummary from "./tools/lead-funnel-summary";
import campaignSpend from "./tools/campaign-spend";
import updateLeadQualification from "./tools/update-lead-qualification";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "covarte-landingspages",
  title: "covarte-landingspages",
  version: "0.1.0",
  instructions:
    "Tools for the Covarte landing pages and media dashboard. Use `list_leads` to inspect 2026 lead submissions, `lead_funnel_summary` for Leads → MQL → SQL totals per market and lead type, `campaign_spend` for Meta Ads spend, and `update_lead_qualification` to set quality or sales fields on a lead.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listLeads, leadFunnelSummary, campaignSpend, updateLeadQualification],
});
