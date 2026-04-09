"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ALL_CATEGORIES } from "@/constants/categories";
import SelectDropdown from "@/components/ui/SelectDropdown";
import type { PlaceFiltersProps } from "@/types/components";

const PlaceFilters = ({
  categoryLabels,
  allRegionsLabel,
  searchRegionLabel,
  regions,
  locale,
}: PlaceFiltersProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const categoryParam = searchParams.get("category") ?? "";
  const activeCategories = new Set(categoryParam ? categoryParam.split(",") : []);
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

  const toggleCategory = (cat: string) => {
    const next = new Set(activeCategories);
    if (next.has(cat)) {
      next.delete(cat);
    } else {
      next.add(cat);
    }
    setParam("category", [...next].join(","));
  };

  return (
    <div className="flex flex-col flex-row gap-4 items-start">
      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setParam("category", "")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors cursor-pointer ${
            activeCategories.size === 0
              ? "bg-green-700 text-white border-green-700"
              : "bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border-gray-200 dark:border-slate-600 hover:border-green-400"
          }`}
        >
          {categoryLabels["all"]}
        </button>
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => toggleCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors cursor-pointer ${
              activeCategories.has(cat)
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
        <SelectDropdown
          value={activeRegion}
          onChange={(val) => setParam("region", val)}
          options={regions.map((r) => ({
            value: r.region,
            label: locale === "bg" && r.region_bg ? r.region_bg : r.region,
          }))}
          placeholder={allRegionsLabel}
          searchPlaceholder={searchRegionLabel}
        />
      )}
    </div>
  );
};

export default PlaceFilters;
