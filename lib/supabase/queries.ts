import { unstable_cache } from "next/cache";
import { createServerClient } from "./server";

export type RegionEntry = { region: string; region_bg: string | null };

/**
 * Fetch distinct regions from the database.
 * Cached for 1 hour — regions rarely change.
 */
export const getDistinctRegions = unstable_cache(
  async (): Promise<RegionEntry[]> => {
    const supabase = createServerClient();

    // Try the RPC first (requires updated migration 010 with region_bg column)
    const { data: rpcData, error: rpcError } = await supabase.rpc("get_distinct_regions");

    if (!rpcError && rpcData && rpcData.length > 0 && "region_bg" in rpcData[0]) {
      return rpcData as RegionEntry[];
    }

    // Fallback: fetch all rows and deduplicate in JS
    const { data } = await supabase
      .from("places")
      .select("region, region_bg")
      .not("region", "is", null)
      .order("region");

    const seen = new Set<string>();
    return (data ?? []).filter((r) => {
      if (seen.has(r.region as string)) return false;
      seen.add(r.region as string);
      return true;
    }) as RegionEntry[];
  },
  ["distinct-regions"],
  { revalidate: 3600 }
);
