"use client";

import { useTranslations } from "next-intl";
import type { Category } from "@/types/place";

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

const CHIP_COLORS: Record<Category, { active: string; inactive: string }> = {
  mountain: { active: "bg-slate-600 text-white", inactive: "bg-slate-100 text-slate-600" },
  lake: { active: "bg-blue-600 text-white", inactive: "bg-blue-100 text-blue-600" },
  cave: { active: "bg-amber-600 text-white", inactive: "bg-amber-100 text-amber-600" },
  city: { active: "bg-purple-600 text-white", inactive: "bg-purple-100 text-purple-600" },
  fishing: { active: "bg-cyan-600 text-white", inactive: "bg-cyan-100 text-cyan-600" },
  trail: { active: "bg-green-600 text-white", inactive: "bg-green-100 text-green-600" },
  beach: { active: "bg-yellow-600 text-white", inactive: "bg-yellow-100 text-yellow-600" },
  museum: { active: "bg-rose-600 text-white", inactive: "bg-rose-100 text-rose-600" },
  hiking: { active: "bg-emerald-600 text-white", inactive: "bg-emerald-100 text-emerald-600" },
};

type Props = {
  activeCategories: Set<Category>;
  categoryLabels: Record<Category, string>;
  allLabel: string;
  onToggle: (category: Category) => void;
  onToggleAll: () => void;
  placesCount: number;
};

export default function MapFilters({
  activeCategories,
  categoryLabels,
  allLabel,
  onToggle,
  onToggleAll,
  placesCount,
}: Props) {
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
}
