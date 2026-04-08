"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ALL_CATEGORIES } from "@/constants/categories";
import type { PlaceFiltersProps } from "@/types/components";

const PlaceFilters = ({ categoryLabels, allRegionsLabel, regions, locale }: PlaceFiltersProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category") ?? "";
  const activeRegion = searchParams.get("region") ?? "";

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset page when filter changes
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col flex-row gap-4 items-start">
      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setParam("category", "")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors cursor-pointer ${
            !activeCategory
              ? "bg-green-700 text-white border-green-700"
              : "bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border-gray-200 dark:border-slate-600 hover:border-green-400"
          }`}
        >
          {categoryLabels["all"]}
        </button>
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setParam("category", activeCategory === cat ? "" : cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors cursor-pointer ${
              activeCategory === cat
                ? "bg-green-700 text-white border-green-700"
                : "bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border-gray-200 dark:border-slate-600 hover:border-green-400"
            }`}
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* Region dropdown */}
      {regions.length > 0 && (
        <select
          value={activeRegion}
          onChange={(e) => setParam("region", e.target.value)}
          className="ml-auto text-sm border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-1.5 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="">{allRegionsLabel}</option>
          {regions.map((r) => (
            <option key={r.region} value={r.region}>
              {locale === "bg" && r.region_bg ? r.region_bg : r.region}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default PlaceFilters;
