"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { Category } from "@/types/place";

const CATEGORIES: Category[] = [
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
  categoryLabels: Record<"all" | Category, string>;
  allRegionsLabel: string;
  regions: string[];
};

export default function PlaceFilters({ categoryLabels, allRegionsLabel, regions }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category") ?? "";
  const activeRegion = searchParams.get("region") ?? "";

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset page when filter changes
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setParam("category", "")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            !activeCategory
              ? "bg-green-700 text-white border-green-700"
              : "bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border-gray-200 dark:border-slate-600 hover:border-green-400"
          }`}
        >
          {categoryLabels["all"]}
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setParam("category", activeCategory === cat ? "" : cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
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
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
