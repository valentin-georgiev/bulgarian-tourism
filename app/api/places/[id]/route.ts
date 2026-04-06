import { type NextRequest } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { parseWkbPoint } from "@/lib/parseWkb";
import { jsonResponse, jsonError, jsonRateLimited, getClientIp } from "@/lib/api";
import { placeIdSchema } from "@/lib/api/validation";
import { placesLimiter } from "@/lib/api/rateLimit";

/**
 * GET /api/places/:id
 *
 * Accepts a UUID or slug. Returns the place with nearby suggestions.
 */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const ip = getClientIp(_request);
  const rl = placesLimiter(ip);
  if (rl.limited) return jsonRateLimited(rl.retryAfter);

  const { id } = await params;

  const parsed = placeIdSchema.safeParse({ id });
  if (!parsed.success) {
    return jsonError("Invalid place identifier", 400);
  }

  const supabase = createServerClient();

  /* Determine if id is a UUID or a slug */
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  const { data: row, error } = await supabase
    .from("places")
    .select(
      "id, osm_id, name, name_bg, slug, category, region, region_bg, description, description_bg, image_url, location, elevation_m, created_at"
    )
    .eq(isUuid ? "id" : "slug", id)
    .single();

  if (error || !row) {
    return jsonError("Place not found", 404);
  }

  const coords = parseWkbPoint(row.location as string);

  const place = {
    id: row.id,
    osm_id: row.osm_id,
    name: row.name,
    name_bg: row.name_bg,
    slug: row.slug,
    category: row.category,
    region: row.region,
    region_bg: row.region_bg,
    description: row.description,
    description_bg: row.description_bg,
    image_url: row.image_url,
    elevation_m: row.elevation_m,
    lat: coords?.lat ?? null,
    lng: coords?.lng ?? null,
    created_at: row.created_at,
  };

  /* Fetch nearby places using existing RPC */
  const { data: nearbyData } = await supabase.rpc("nearby_places", {
    place_id: row.id,
    radius_m: 50000,
    max_results: 4,
  });

  const nearby = (nearbyData ?? []).map(
    (n: {
      id: string;
      name: string;
      name_bg: string | null;
      slug: string;
      category: string;
      image_url: string | null;
      region: string | null;
      region_bg: string | null;
      distance_m: number;
    }) => ({
      id: n.id,
      name: n.name,
      name_bg: n.name_bg,
      slug: n.slug,
      category: n.category,
      image_url: n.image_url,
      region: n.region,
      region_bg: n.region_bg,
      distance_m: Math.round(n.distance_m),
    })
  );

  return jsonResponse({ data: place, nearby });
}
