import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { notAuthenticated, supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_leads",
  title: "List leads",
  description:
    "List lead form submissions from the 2026 table, optionally filtered by date range, language, lead type or quality.",
  inputSchema: {
    start_date: z.string().optional().describe("ISO date (YYYY-MM-DD) lower bound on created_at."),
    end_date: z.string().optional().describe("ISO date (YYYY-MM-DD) upper bound on created_at."),
    language: z.enum(["nl", "fr"]).optional().describe("Market language of the lead."),
    type: z.string().optional().describe("Lead magnet type, e.g. stalen, lookbook, korting, keukentrends."),
    kwaliteit: z.string().optional().describe("Lead quality label, e.g. Goed, Redelijk, Slecht."),
    limit: z.number().int().min(1).max(200).default(50).describe("Maximum rows to return."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ start_date, end_date, language, type, kwaliteit, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated();

    let query = supabaseForUser(ctx)
      .from("form_submissions_2026")
      .select(
        "id, created_at, voornaam, achternaam, email, bedrijf, gemeente, language, type, kwaliteit, sales_status, sales_rep, utm_source, utm_medium, utm_campaign, utm_content, utm_term",
      )
      .order("created_at", { ascending: false })
      .limit(limit ?? 50);

    if (start_date) query = query.gte("created_at", start_date);
    if (end_date) query = query.lte("created_at", `${end_date}T23:59:59`);
    if (language) query = query.eq("language", language);
    if (type) query = query.eq("type", type);
    if (kwaliteit) query = query.eq("kwaliteit", kwaliteit);

    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { count: data?.length ?? 0, leads: data ?? [] },
    };
  },
});
