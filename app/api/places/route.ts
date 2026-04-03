import { type NextRequest } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { parseWkbPoint } from "@/lib/parseWkb";
import { jsonResponse, jsonError, parseIntParam, parseBbox, validateCategory } from "@/lib/api";

/**
 * GET /api/places
 *
 * Query params:
 *   category  — filter by category (lake, mountain, cave, …)
 *   region    — filter by region name
 *   bbox      — bounding box "south,west,north,east"
 *   page      — page number (default 1)
 *   limit     — results per page (default 24, max 100)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const category = validateCategory(searchParams.get("category"));
  const region = searchParams.get("region");
  const bbox = parseBbox(searchParams.get("bbox"));
  const page = parseIntParam(searchParams.get("page"), 1, 1, 1000);
  const limit = parseIntParam(searchParams.get("limit"), 24, 1, 100);

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const supabase = createServerClient();

  /* If bbox is requested, use RPC with PostGIS filter */
  if (bbox) {
    const { data, error } = await supabase.rpc("get_map_places");

    if (error) {
      return jsonError("Database error", 500);
    }

    /* Filter in-memory for bbox (the RPC returns all places with lat/lng) */
    let filtered = (data ?? []).filter(
      (p: { lat: number; lng: number }) =>
        p.lat >= bbox.south && p.lat <= bbox.north && p.lng >= bbox.west && p.lng <= bbox.east
    );

    if (category) {
      filtered = filtered.filter((p: { category: string }) => p.category === category);
    }
    if (region) {
      filtered = filtered.filter((p: { region: string | null }) => p.region === region);
    }

    const total = filtered.length;
    const paged = filtered.slice(from, from + limit);

    return jsonResponse({ data: paged, page, limit, count: total });
  }

  /* Standard query without bbox */
  let query = supabase
    .from("places")
    .select(
      "id, slug, name, name_bg, category, region, region_bg, image_url, description, description_bg, elevation_m, location",
      { count: "exact" }
    )
    .order("name")
    .range(from, to);

  if (category) query = query.eq("category", category);
  if (region) query = query.eq("region", region);

  const { data, count, error } = await query;

  if (error) {
    return jsonError("Database error", 500);
  }

  /* Transform rows: extract lat/lng from WKB location */
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

  return jsonResponse({ data: places, page, limit, count: count ?? 0 });
}
