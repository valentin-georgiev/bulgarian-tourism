"use client";

import { useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import MapFilters from "@/components/map/MapFilters";
import PlacePanel from "@/components/map/PlacePanel";
import type { MapPlace } from "@/components/map/MapView";
import type { Category } from "@/types/place";

/* Leaflet must only run in the browser — dynamic import with SSR disabled */
const MapView = dynamic(() => import("@/components/map/MapView"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
      Loading map...
    </div>
  ),
});

const ALL_CATEGORIES: Category[] = [
  "mountain",
  "lake",
  "cave",
  "city",
  "fishing",
  "trail",
  "beach",
  "museum",
  "hiking",
];

type Props = {
  places: MapPlace[];
  locale: string;
  categoryLabels: Record<Category, string>;
  allLabel: string;
  viewDetailsLabel: string;
  closeLabel: string;
  elevationLabel: string;
  metersLabel: string;
};

export default function MapClient({
  places,
  locale,
  categoryLabels,
  allLabel,
  viewDetailsLabel,
  closeLabel,
  elevationLabel,
  metersLabel,
}: Props) {
  const [activeCategories, setActiveCategories] = useState<Set<Category>>(
    () => new Set(ALL_CATEGORIES)
  );
  const [selectedPlace, setSelectedPlace] = useState<MapPlace | null>(null);

  const handleToggle = useCallback((cat: Category) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  }, []);

  const handleToggleAll = useCallback(() => {
    setActiveCategories((prev) => {
      if (prev.size === ALL_CATEGORIES.length) {
        return new Set<Category>();
      }
      return new Set(ALL_CATEGORIES);
    });
  }, []);

  const handleSelectPlace = useCallback((place: MapPlace) => {
    setSelectedPlace(place);
  }, []);

  const handleClosePanel = useCallback(() => {
    setSelectedPlace(null);
  }, []);

  const visibleCount = useMemo(
    () => places.filter((p) => activeCategories.has(p.category)).length,
    [places, activeCategories]
  );

  return (
    <>
      <MapView
        places={places}
        activeCategories={activeCategories}
        onSelectPlace={handleSelectPlace}
      />

      <MapFilters
        activeCategories={activeCategories}
        categoryLabels={categoryLabels}
        allLabel={allLabel}
        onToggle={handleToggle}
        onToggleAll={handleToggleAll}
        placesCount={visibleCount}
      />

      {selectedPlace && (
        <PlacePanel
          place={selectedPlace}
          locale={locale}
          categoryLabel={categoryLabels[selectedPlace.category]}
          viewDetailsLabel={viewDetailsLabel}
          closeLabel={closeLabel}
          elevationLabel={elevationLabel}
          metersLabel={metersLabel}
          onClose={handleClosePanel}
        />
      )}
    </>
  );
}
