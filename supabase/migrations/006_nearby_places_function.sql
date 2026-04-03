-- RPC function: find nearby places within a given radius (default 50 km)
CREATE OR REPLACE FUNCTION nearby_places(
  place_id uuid,
  radius_m int DEFAULT 50000,
  max_results int DEFAULT 4
)
RETURNS TABLE (
  id          uuid,
  name        text,
  name_bg     text,
  slug        text,
  category    text,
  image_url   text,
  region      text,
  region_bg   text,
  distance_m  double precision
)
LANGUAGE sql STABLE
AS $$
  SELECT
    p.id,
    p.name,
    p.name_bg,
    p.slug,
    p.category,
    p.image_url,
    p.region,
    p.region_bg,
    ST_Distance(p.location, ref.location) AS distance_m
  FROM places p
  CROSS JOIN (SELECT location FROM places WHERE places.id = place_id) ref
  WHERE p.id <> place_id
    AND ST_DWithin(p.location, ref.location, radius_m)
  ORDER BY distance_m
  LIMIT max_results;
$$;
