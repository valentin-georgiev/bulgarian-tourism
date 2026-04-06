import { z } from "zod";
import { ALL_CATEGORIES } from "@/constants/categories";

const categoryEnum = z.enum(ALL_CATEGORIES as [string, ...string[]]);

/**
 * Schema for GET /api/places query params.
 */
export const placesQuerySchema = z.object({
  category: categoryEnum.optional().catch(undefined),
  region: z.string().max(100).optional(),
  bbox: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      const parts = val.split(",").map(Number);
      if (parts.length !== 4 || parts.some(isNaN)) return undefined;
      const [south, west, north, east] = parts;
      if (south >= north || west >= east) return undefined;
      if (south < -90 || north > 90 || west < -180 || east > 180) return undefined;
      return { south, west, north, east };
    }),
  page: z.coerce.number().int().min(1).max(1000).catch(1),
  limit: z.coerce.number().int().min(1).max(100).catch(24),
});

export type PlacesQuery = z.infer<typeof placesQuerySchema>;

/**
 * Schema for GET /api/places/:id param.
 */
export const placeIdSchema = z.object({
  id: z.string().min(1).max(200),
});

/**
 * Schema for GET /api/search query params.
 */
export const searchQuerySchema = z.object({
  q: z
    .string()
    .transform((s) => s.trim())
    .pipe(z.string().min(2, "Query must be at least 2 characters").max(100)),
  category: categoryEnum.optional().catch(undefined),
  limit: z.coerce.number().int().min(1).max(50).catch(20),
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;
