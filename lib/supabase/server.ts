import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

let client: SupabaseClient | null = null;

/**
 * Module-level singleton — reuses the same HTTP connection
 * instead of creating a new client on every request.
 */
export const createServerClient = (): SupabaseClient => {
  if (!client) {
    client = createClient(supabaseUrl, supabaseKey);
  }
  return client;
};
