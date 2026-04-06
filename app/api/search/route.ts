import { type NextRequest } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { parseWkbPoint } from "@/lib/parseWkb";
import { jsonResponse, jsonError, jsonRateLimited, getClientIp, escapeIlike } from "@/lib/api";
import { searchQuerySchema } from "@/lib/api/validation";
import { searchLimiter } from "@/lib/api/rateLimit";

/**
 * GET /api/search?q=...
 *
 * Query params:
 *   q         — search query (required, 2–100 chars)
 *   category  — optional category filter
 *   limit     — max results (default 20, max 50)
 */
export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const rl = searchLimiter(ip);
  if (rl.limited) return jsonRateLimited(rl.retryAfter);

  const { searchParams } = request.nextUrl;

  const parsed = searchQuerySchema.safeParse({
    q: searchParams.get("q") ?? "",
    category: searchParams.get("category") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
  });

  if (!parsed.success) {
    return jsonError(parsed.error.issues.map((i) => i.message).join(", "), 400);
  }

  const { q, category, limit } = parsed.data;

  const supabase = createServerClient();

  /* Try the search_places RPC first (requires migration 008) */
  const { data: rpcData, error: rpcError } = await supabase.rpc("search_places", {
    query: q,
    cat: category,
    max_results: limit,
  });

  if (!rpcError && rpcData) {
    return jsonResponse({ data: rpcData, query: q });
  }

  /* Fallback: ILIKE search on name and name_bg (no full-text ranking) */
  const escaped = escapeIlike(q);
  let query = supabase
    .from("places")
    .select(
      "id, slug, name, name_bg, category, region, region_bg, image_url, description, description_bg, elevation_m, location"
    )
    .or(`name.ilike.%${escaped}%,name_bg.ilike.%${escaped}%`)
    .order("name")
    .limit(limit);

  if (category) query = query.eq("category", category);

  const { data, error } = await query;

  if (error) {
    return jsonError("Database error", 500);
  }

  const places = (data ?? []).map((row) => {
    const coords = parseWkbPoint(row.location as string);
    return {
      id: row.id,
      slug: row.slug,
      name: row.name,
      name_bg: row.name_bg,
      category: row.category,
      region: row.region,
      region_bg: row.region_bg,
      image_url: row.image_url,
      description: row.description,
      description_bg: row.description_bg,
      elevation_m: row.elevation_m,
      lat: coords?.lat ?? null,
      lng: coords?.lng ?? null,
    };
  });

  return jsonResponse({ data: places, query: q });
}
