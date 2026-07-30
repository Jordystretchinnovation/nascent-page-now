import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { notAuthenticated, supabaseForUser } from "../supabase";

export default defineTool({
  name: "campaign_spend",
  title: "Meta campaign spend",
  description:
    "Total Meta Ads spend for a date range, broken down by campaign and adset, from the synced meta_performance data.",
  inputSchema: {
    start_date: z.string().optional().describe("ISO date (YYYY-MM-DD) lower bound on the report date."),
    end_date: z.string().optional().describe("ISO date (YYYY-MM-DD) upper bound on the report date."),
    campaign_name: z.string().optional().describe("Filter to a single campaign name (exact match)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ start_date, end_date, campaign_name }, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated();

    const supabase = supabaseForUser(ctx);
    const rows: any[] = [];
    const pageSize = 1000;

    for (let from = 0; ; from += pageSize) {
      let query = supabase
        .from("meta_performance")
        .select("date, campaign_name, adset_name, spent")
        .order("date", { ascending: true })
        .range(from, from + pageSize - 1);

      if (start_date) query = query.gte("date", start_date);
      if (end_date) query = query.lte("date", end_date);
      if (campaign_name) query = query.eq("campaign_name", campaign_name);

      const { data, error } = await query;
      if (error) return { content: [{ type: "text", text: error.message }], isError: true };
      rows.push(...(data ?? []));
      if (!data || data.length < pageSize) break;
    }

    const sum = (list: any[]) =>
      Math.round(list.reduce((acc, r) => acc + Number(r.spent ?? 0), 0) * 100) / 100;

    const group = (key: "campaign_name" | "adset_name") =>
      Object.fromEntries(
        [...new Set(rows.map((r) => r[key] ?? "unknown"))].map((v) => [
          v,
          sum(rows.filter((r) => (r[key] ?? "unknown") === v)),
        ]),
      );

    const result = {
      range: { start_date: start_date ?? null, end_date: end_date ?? null },
      total_spend_eur: sum(rows),
      rows: rows.length,
      by_campaign: group("campaign_name"),
      by_adset: group("adset_name"),
    };

    return {
      content: [{ type: "text", text: JSON.stringify(result) }],
      structuredContent: result,
    };
  },
});
