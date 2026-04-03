import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

// Server client for use in React Server Components and Route Handlers.
// Creates a new instance per call (no singleton — safe for concurrent requests).
export const createServerClient = () => {
  return createClient(supabaseUrl, supabasePublishableKey);
};
