import {
  Waves,
  Mountain,
  Flame,
  Building2,
  Fish,
  Footprints,
  Umbrella,
  Landmark,
} from "lucide-react";
import type { Category } from "@/types/place";
import type { LucideIcon } from "lucide-react";

/** Tailwind classes for Badge component */
export const BADGE_STYLES: Record<Category, string> = {
  mountain: "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  lake: "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-200",
  cave: "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-200",
  settlement: "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-200",
  fishing: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/60 dark:text-cyan-200",
  trail: "bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-200",
  beach: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/60 dark:text-yellow-200",
  museum: "bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-200",
};

/** Hex colors for map markers */
export const CATEGORY_COLORS: Record<Category, string> = {
  mountain: "#64748b",
  lake: "#3b82f6",
  cave: "#f59e0b",
  settlement: "#a855f7",
  fishing: "#06b6d4",
  trail: "#22c55e",
  beach: "#eab308",
  museum: "#f43f5e",
};

/** Active/inactive chip colors for map filters */
export const CHIP_COLORS: Record<Category, { active: string; inactive: string }> = {
  mountain: { active: "bg-slate-600 text-white", inactive: "bg-slate-100 text-slate-600" },
  lake: { active: "bg-blue-600 text-white", inactive: "bg-blue-100 text-blue-600" },
  cave: { active: "bg-amber-600 text-white", inactive: "bg-amber-100 text-amber-600" },
  settlement: { active: "bg-purple-600 text-white", inactive: "bg-purple-100 text-purple-600" },
  fishing: { active: "bg-cyan-600 text-white", inactive: "bg-cyan-100 text-cyan-600" },
  trail: { active: "bg-green-600 text-white", inactive: "bg-green-100 text-green-600" },
  beach: { active: "bg-yellow-600 text-white", inactive: "bg-yellow-100 text-yellow-600" },
  museum: { active: "bg-rose-600 text-white", inactive: "bg-rose-100 text-rose-600" },
};

/** Category icons with colors for home page grid */
export const CATEGORY_ICONS: { key: Category; icon: LucideIcon; color: string }[] = [
  {
    key: "mountain",
    icon: Mountain,
    color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
  {
    key: "lake",
    icon: Waves,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  },
  {
    key: "cave",
    icon: Flame,
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
  },
  {
    key: "settlement",
    icon: Building2,
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
  },
  {
    key: "fishing",
    icon: Fish,
    color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300",
  },
  {
    key: "trail",
    icon: Footprints,
    color: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
  },
  {
    key: "beach",
    icon: Umbrella,
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300",
  },
  {
    key: "museum",
    icon: Landmark,
    color: "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300",
  },
];
