import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { notAuthenticated, supabaseForUser } from "../supabase";

const MQL = ["Redelijk", "Goed", "Goed-klant"];
const SQL = ["Goed", "Goed-klant"];

export default defineTool({
  name: "lead_funnel_summary",
  title: "Lead funnel summary",
  description:
    "Summarise the 2026 lead funnel (Leads → MQL → SQL) for a date range, broken down by market and lead type. SQL excludes keukentrends leads.",
  inputSchema: {
    start_date: z.string().optional().describe("ISO date (YYYY-MM-DD) lower bound on created_at."),
    end_date: z.string().optional().describe("ISO date (YYYY-MM-DD) upper bound on created_at."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ start_date, end_date }, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated();

    const supabase = supabaseForUser(ctx);
    const rows: any[] = [];
    const pageSize = 1000;

    for (let from = 0; ; from += pageSize) {
      let query = supabase
        .from("form_submissions_2026")
        .select("created_at, language, type, kwaliteit")
        .order("created_at", { ascending: true })
        .range(from, from + pageSize - 1);

      if (start_date) query = query.gte("created_at", start_date);
      if (end_date) query = query.lte("created_at", `${end_date}T23:59:59`);

      const { data, error } = await query;
      if (error) return { content: [{ type: "text", text: error.message }], isError: true };
      rows.push(...(data ?? []));
      if (!data || data.length < pageSize) break;
    }

    const isMql = (r: any) => MQL.includes(r.kwaliteit ?? "");
    const isSql = (r: any) => SQL.includes(r.kwaliteit ?? "") && r.type !== "keukentrends";

    const bucket = (list: any[]) => ({
      leads: list.length,
      mql: list.filter(isMql).length,
      sql: list.filter(isSql).length,
    });

    const byKey = (key: "language" | "type") =>
      Object.fromEntries(
        [...new Set(rows.map((r) => r[key] ?? "unknown"))].map((v) => [
          v,
          bucket(rows.filter((r) => (r[key] ?? "unknown") === v)),
        ]),
      );

    const summary = {
      range: { start_date: start_date ?? null, end_date: end_date ?? null },
      total: bucket(rows),
      by_market: byKey("language"),
      by_type: byKey("type"),
    };

    return {
      content: [{ type: "text", text: JSON.stringify(summary) }],
      structuredContent: summary,
    };
  },
});
