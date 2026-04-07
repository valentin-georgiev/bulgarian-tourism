import { unstable_cache } from "next/cache";
import { createServerClient } from "./server";

/**
 * Fetch distinct regions from the database.
 * Cached for 1 hour — regions rarely change.
 */
export const getDistinctRegions = unstable_cache(
  async (): Promise<string[]> => {
    const supabase = createServerClient();

    // Try the RPC first (requires migration 010)
    const { data: rpcData, error: rpcError } = await supabase.rpc("get_distinct_regions");

    if (!rpcError && rpcData) {
      return (rpcData as { region: string }[]).map((r) => r.region);
    }

    // Fallback: fetch all rows and deduplicate in JS
    const { data } = await supabase
      .from("places")
      .select("region")
      .not("region", "is", null)
      .order("region");

    return [...new Set((data ?? []).map((r) => r.region as string))];
  },
  ["distinct-regions"],
  { revalidate: 3600 }
);
