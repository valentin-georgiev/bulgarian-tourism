import type { Category } from "@/types/place";

export const ALL_CATEGORIES: Category[] = [
  "mountain",
  "lake",
  "cave",
  "settlement",
  "fishing",
  "trail",
  "beach",
  "museum",
];

export const VALID_CATEGORIES: Set<string> = new Set(ALL_CATEGORIES);

export const PAGE_SIZE = 24;
