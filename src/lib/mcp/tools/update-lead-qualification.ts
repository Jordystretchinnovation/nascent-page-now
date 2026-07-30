import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { notAuthenticated, supabaseForUser } from "../supabase";

export default defineTool({
  name: "update_lead_qualification",
  title: "Update lead qualification",
  description:
    "Update the qualification of a 2026 lead: quality label, sales status, sales rep and/or sales comment.",
  inputSchema: {
    lead_id: z.string().uuid().describe("The id of the lead in form_submissions_2026."),
    kwaliteit: z.string().optional().describe("Quality label, e.g. Goed, Redelijk, Slecht."),
    sales_status: z.string().optional().describe("Sales pipeline status."),
    sales_rep: z.string().optional().describe("Name of the responsible sales rep."),
    sales_comment: z.string().optional().describe("Free-text sales note."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ lead_id, kwaliteit, sales_status, sales_rep, sales_comment }, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated();

    const patch: Record<string, string> = {};
    if (kwaliteit !== undefined) patch.kwaliteit = kwaliteit;
    if (sales_status !== undefined) patch.sales_status = sales_status;
    if (sales_rep !== undefined) patch.sales_rep = sales_rep;
    if (sales_comment !== undefined) patch.sales_comment = sales_comment;

    if (Object.keys(patch).length === 0) {
      return { content: [{ type: "text", text: "Nothing to update." }], isError: true };
    }

    const { data, error } = await supabaseForUser(ctx)
      .from("form_submissions_2026")
      .update(patch)
      .eq("id", lead_id)
      .select("id, kwaliteit, sales_status, sales_rep, sales_comment");

    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data?.length) {
      return { content: [{ type: "text", text: "No lead updated (not found or not permitted)." }], isError: true };
    }

    return {
      content: [{ type: "text", text: JSON.stringify(data[0]) }],
      structuredContent: { lead: data[0] },
    };
  },
});
