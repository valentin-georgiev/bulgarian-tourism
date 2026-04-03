"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet.markercluster";
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

/* Category → marker colour (Tailwind-ish hex equivalents) */
const CATEGORY_COLORS: Record<Category, string> = {
  mountain: "#64748b",
  lake: "#3b82f6",
  cave: "#f59e0b",
  city: "#a855f7",
  fishing: "#06b6d4",
  trail: "#22c55e",
  beach: "#eab308",
  museum: "#f43f5e",
  hiking: "#10b981",
};

type Props = {
  places: MapPlace[];
  activeCategories: Set<Category>;
  onSelectPlace: (place: MapPlace) => void;
};

export default function MapView({ places, activeCategories, onSelectPlace }: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);

  /* initialise map once */
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [42.7, 25.5],
      zoom: 7,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  /* update markers when places or active categories change */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    /* remove old cluster group */
    if (clusterRef.current) {
      map.removeLayer(clusterRef.current);
    }

    const cluster = L.markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
    });

    const filtered = places.filter((p) => activeCategories.has(p.category));

    for (const place of filtered) {
      const color = CATEGORY_COLORS[place.category] ?? "#6b7280";

      const icon = L.divIcon({
        className: "custom-marker",
        html: `<span style="
          display:block;
          width:12px;
          height:12px;
          border-radius:50%;
          background:${color};
          border:2px solid white;
          box-shadow:0 1px 4px rgba(0,0,0,0.3);
        "></span>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      });

      const marker = L.marker([place.lat, place.lng], { icon });
      marker.on("click", () => onSelectPlace(place));
      cluster.addLayer(marker);
    }

    map.addLayer(cluster);
    clusterRef.current = cluster;
  }, [places, activeCategories, onSelectPlace]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0" style={{ background: "#e5e7eb" }} />
  );
}
