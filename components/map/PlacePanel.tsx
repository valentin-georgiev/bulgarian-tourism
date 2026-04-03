"use client";

import Image from "next/image";
import Link from "next/link";
import { X, MapPin, MountainSnow, ArrowRight } from "lucide-react";
import Badge from "@/components/ui/Badge";
import type { PlacePanelProps } from "@/types/components";

const PlacePanel = ({
  place,
  locale,
  categoryLabel,
  viewDetailsLabel,
  closeLabel,
  elevationLabel,
  metersLabel,
  onClose,
}: PlacePanelProps) => {
  return (
    <div className="absolute top-0 right-0 z-[1000] h-full w-full sm:w-96 bg-white dark:bg-slate-900 shadow-2xl border-l border-gray-200 dark:border-slate-700 flex flex-col animate-slide-in">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
        aria-label={closeLabel}
      >
        <X className="w-5 h-5 text-gray-600 dark:text-slate-300" />
      </button>

      {/* Image */}
      <div className="relative h-48 bg-gray-100 dark:bg-slate-700 shrink-0">
        {place.image_url ? (
          <Image
            src={place.image_url}
            alt={place.name}
            fill
            className="object-cover"
            sizes="384px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-slate-500 text-5xl select-none">
            🇧🇬
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Badge category={place.category} label={categoryLabel} />
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">{place.name}</h2>

        {place.region && (
          <p className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-slate-400">
            <MapPin className="w-4 h-4" />
            {place.region}
          </p>
        )}

        {place.elevation_m != null && (
          <p className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-slate-400">
            <MountainSnow className="w-4 h-4" />
            {elevationLabel}: {place.elevation_m.toLocaleString()} {metersLabel}
          </p>
        )}

        {place.description && (
          <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed line-clamp-6">
            {place.description}
          </p>
        )}
      </div>

      {/* View details link */}
      <div className="p-4 border-t border-gray-100 dark:border-slate-700 shrink-0">
        <Link
          href={`/${locale}/places/${place.slug}`}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-green-700 text-white text-sm font-medium rounded-full hover:bg-green-800 transition-colors"
        >
          {viewDetailsLabel}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.25s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PlacePanel;
