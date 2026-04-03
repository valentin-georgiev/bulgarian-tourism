-- RPC function: return all places with extracted lat/lng for the map view
CREATE OR REPLACE FUNCTION get_map_places()
RETURNS TABLE (
  id          uuid,
  name        text,
  name_bg     text,
  slug        text,
  category    text,
  image_url   text,
  region      text,
  region_bg   text,
  description text,
  description_bg text,
  elevation_m int,
  lat         double precision,
  lng         double precision
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
    p.description,
    p.description_bg,
    p.elevation_m,
    ST_Y(p.location::geometry) AS lat,
    ST_X(p.location::geometry) AS lng
  FROM places p
  WHERE p.location IS NOT NULL
  ORDER BY p.name;
$$;
