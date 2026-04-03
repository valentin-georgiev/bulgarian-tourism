import { NextResponse } from "next/server";
import { VALID_CATEGORIES } from "@/constants/categories";

/**
 * Return a JSON response with consistent structure.
 */
export const jsonResponse = (body: unknown, status = 200) => {
  return NextResponse.json(body, { status });
};

/**
 * Return a JSON error response.
 */
export const jsonError = (message: string, status = 400) => {
  return NextResponse.json({ error: message }, { status });
};

/**
 * Safely parse an integer query param with bounds.
 */
export const parseIntParam = (
  value: string | null,
  defaultValue: number,
  min: number,
  max: number
): number => {
  if (!value) return defaultValue;
  const n = parseInt(value, 10);
  if (isNaN(n)) return defaultValue;
  return Math.max(min, Math.min(max, n));
};

/**
 * Parse a bounding box string "south,west,north,east" into numbers.
 * Returns null if invalid.
 */
export const parseBbox = (
  value: string | null
): { south: number; west: number; north: number; east: number } | null => {
  if (!value) return null;
  const parts = value.split(",").map(Number);
  if (parts.length !== 4 || parts.some(isNaN)) return null;
  const [south, west, north, east] = parts;
  if (south >= north || west >= east) return null;
  if (south < -90 || north > 90 || west < -180 || east > 180) return null;
  return { south, west, north, east };
};

/**
 * Validate a category string. Returns null if invalid.
 */
export const validateCategory = (value: string | null): string | null => {
  if (!value) return null;
  return VALID_CATEGORIES.has(value) ? value : null;
};
