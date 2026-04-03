import type { Category } from "@/types/place";

export interface MapPlace {
  id: string;
  name: string;
  slug: string;
  category: Category;
  image_url: string | null;
  region: string | null;
  description: string | null;
  elevation_m: number | null;
  lat: number;
  lng: number;
}
