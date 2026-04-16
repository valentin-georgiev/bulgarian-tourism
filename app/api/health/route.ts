import { createServerClient } from "@/lib/supabase/server";
import { jsonResponse, jsonError } from "@/lib/api";

/**
 * GET /api/health
 *
 * Lightweight Supabase ping to prevent free-tier project pausing.
 * Designed to be called by Vercel Cron Jobs on a weekly schedule.
 */
export const GET = async (request: Request) => {
  // Verify the request comes from Vercel Cron (production only)
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return jsonError("Unauthorized", 401);
  }

  const supabase = createServerClient();

  const { count, error } = await supabase
    .from("places")
    .select("id", { count: "exact", head: true });

  if (error) {
    return jsonError("Supabase unreachable", 500);
  }

  return jsonResponse({ status: "ok", places: count, timestamp: new Date().toISOString() });
};
