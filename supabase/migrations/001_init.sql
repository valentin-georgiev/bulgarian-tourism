-- Enable PostGIS extension for geographic queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Main places table
CREATE TABLE IF NOT EXISTS places (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  osm_id       bigint UNIQUE,
  name         text NOT NULL,
  name_bg      text,
  slug         text UNIQUE NOT NULL,
  category     text NOT NULL CHECK (category IN ('lake', 'mountain', 'cave', 'city', 'fishing')),
  region       text,
  description  text,
  description_bg text,
  image_url    text,
  wikipedia    text,
  location     geography(Point, 4326) NOT NULL,
  elevation_m  int,
  tags         jsonb DEFAULT '{}',
  created_at   timestamptz DEFAULT now()
);

-- Geo index for fast bounding-box / nearest-neighbour queries
CREATE INDEX IF NOT EXISTS places_location_idx
  ON places USING GIST (location);

-- Full-text search index (English stemming on name + description)
CREATE INDEX IF NOT EXISTS places_search_idx
  ON places USING GIN (
    to_tsvector('english', name || ' ' || coalesce(description, ''))
  );

-- Category filter index
CREATE INDEX IF NOT EXISTS places_category_idx ON places (category);

-- Region filter index
CREATE INDEX IF NOT EXISTS places_region_idx ON places (region);
