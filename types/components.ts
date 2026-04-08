import type { Category, NearbyPlace } from "@/types/place";
import type { MapPlace } from "@/types/map";

/* ─── PlaceCard ─── */
export type PlaceCardProps = {
  slug: string;
  name: string;
  category: Category;
  categoryLabel: string;
  region: string | null;
  image_url: string | null;
  locale: string;
};

/* ─── PlaceGrid ─── */
export type PlaceItem = {
  id: string;
  slug: string;
  name: string;
  category: Category;
  region: string | null;
  image_url: string | null;
};

export type PlaceGridProps = {
  places: PlaceItem[];
  categoryLabels: Record<Category, string>;
  locale: string;
  emptyMessage: string;
};

/* ─── PlaceFilters ─── */
export type PlaceFiltersProps = {
  categoryLabels: Record<"all" | Category, string>;
  allRegionsLabel: string;
  regions: { region: string; region_bg: string | null }[];
  locale: string;
};

/* ─── NearbyPlaces ─── */
export type NearbyPlacesProps = {
  places: (NearbyPlace & { name_bg?: string | null; region_bg?: string | null })[];
  categoryLabels: Record<Category, string>;
  locale: string;
  heading: string;
  emptyMessage: string;
  distanceLabel: (distance: string) => string;
};

/* ─── Pagination ─── */
export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  baseParams: Record<string, string>;
  labels: {
    previous: string;
    next: string;
    page: string;
  };
};

/* ─── Badge ─── */
export type BadgeProps = {
  category: Category;
  label: string;
};

/* ─── MapView ─── */
export type MapViewProps = {
  places: MapPlace[];
  activeCategories: Set<Category>;
  onSelectPlace: (place: MapPlace) => void;
};

/* ─── MapFilters ─── */
export type MapFiltersProps = {
  activeCategories: Set<Category>;
  categoryLabels: Record<Category, string>;
  allLabel: string;
  onToggle: (category: Category) => void;
  onToggleAll: () => void;
  placesCount: number;
};

/* ─── PlacePanel ─── */
export type PlacePanelProps = {
  place: MapPlace;
  locale: string;
  categoryLabel: string;
  viewDetailsLabel: string;
  closeLabel: string;
  elevationLabel: string;
  metersLabel: string;
  onClose: () => void;
};

/* ─── MapClient ─── */
export type MapClientProps = {
  places: MapPlace[];
  locale: string;
  categoryLabels: Record<Category, string>;
  allLabel: string;
  viewDetailsLabel: string;
  closeLabel: string;
  elevationLabel: string;
  metersLabel: string;
};
