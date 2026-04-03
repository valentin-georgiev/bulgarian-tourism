"use client";

import { useTranslations } from "next-intl";
import { ALL_CATEGORIES } from "@/constants/categories";
import { CHIP_COLORS } from "@/constants/categoryStyles";
import type { MapFiltersProps } from "@/types/components";

const MapFilters = ({
  activeCategories,
  categoryLabels,
  allLabel,
  onToggle,
  onToggleAll,
  placesCount,
}: MapFiltersProps) => {
  const t = useTranslations("map");
  const allActive = activeCategories.size === ALL_CATEGORIES.length;

  return (
    <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2 max-w-[calc(100%-2rem)] sm:max-w-md">
      <div className="flex flex-wrap gap-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-gray-200 dark:border-slate-700">
        {/* All toggle */}
        <button
          onClick={onToggleAll}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            allActive
              ? "bg-green-700 text-white"
              : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700"
          }`}
        >
          {allLabel}
        </button>

        {ALL_CATEGORIES.map((cat) => {
          const isActive = activeCategories.has(cat);
          const colors = CHIP_COLORS[cat];
          return (
            <button
              key={cat}
              onClick={() => onToggle(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                isActive ? colors.active : colors.inactive
              }`}
            >
              {categoryLabels[cat]}
            </button>
          );
        })}
      </div>

      {/* Places count badge */}
      <span className="self-start bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-xs text-gray-600 dark:text-slate-300 px-3 py-1 rounded-full shadow border border-gray-200 dark:border-slate-700">
        {t("places_count", { count: placesCount })}
      </span>
    </div>
  );
};

export default MapFilters;
