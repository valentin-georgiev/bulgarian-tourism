import { type NextRequest } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { parseWkbPoint } from "@/lib/parseWkb";
import { jsonResponse, jsonError, parseIntParam, validateCategory } from "@/lib/api";

/**
 * GET /api/search?q=...
 *
 * Query params:
 *   q         — search query (required, min 1 char)
 *   category  — optional category filter
 *   limit     — max results (default 20, max 50)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const q = searchParams.get("q")?.trim();
  if (!q || q.length === 0) {
    return jsonError("Query parameter 'q' is required", 400);
  }

  const category = validateCategory(searchParams.get("category"));
  const limit = parseIntParam(searchParams.get("limit"), 20, 1, 50);

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
  let query = supabase
    .from("places")
    .select(
      "id, slug, name, name_bg, category, region, region_bg, image_url, description, description_bg, elevation_m, location"
    )
    .or(`name.ilike.%${q}%,name_bg.ilike.%${q}%`)
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
