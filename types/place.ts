export type Category = 'lake' | 'mountain' | 'cave' | 'city' | 'fishing' | 'trail' | 'beach' | 'museum' | 'hiking';

export type Region = string;

export interface Place {
  id: string;
  osm_id: number | null;
  name: string;
  name_bg: string | null;
  slug: string;
  category: Category;
  region: string | null;
  region_bg: string | null;
  description: string | null;
  description_bg: string | null;
  image_url: string | null;
  wikipedia: string | null;
  latitude: number;
  longitude: number;
  elevation_m: number | null;
  created_at: string;
}

export interface PlaceRow {
  id: string;
  osm_id: number | null;
  name: string;
  name_bg: string | null;
  slug: string;
  category: string;
  region: string | null;
  region_bg: string | null;
  description: string | null;
  description_bg: string | null;
  image_url: string | null;
  wikipedia: string | null;
  location: string; // PostGIS geography — returned as WKT or GeoJSON from Supabase
  elevation_m: number | null;
  created_at: string;
}

export interface NearbyPlace extends Pick<Place, 'id' | 'name' | 'slug' | 'category' | 'image_url' | 'region'> {
  distance_m: number;
}
