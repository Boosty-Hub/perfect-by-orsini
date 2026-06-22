import { createClient } from "@supabase/supabase-js";

/** Service-role client — SERVER ONLY. Bypasses RLS. Used for admin tasks
 * (reading all profiles, creating users). Never import into client components. */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
