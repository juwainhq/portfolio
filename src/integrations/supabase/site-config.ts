import { supabase } from "@/integrations/supabase/client";

/**
 * Thin data-access layer over the `site_config` Supabase table.
 *
 * The portfolio is configured by exactly one row in `public.site_config`.
 * Its `config` column is a JSONB blob that mirrors the TypeScript `SiteConfig`
 * shape exported from `@/data/site-config`.
 *
 * RLS (enforced on the database side):
 *   - SELECT: public (anyone, including unauthenticated visitors, can read)
 *   - INSERT/UPDATE: only the authenticated admin user (example@gmail.com)
 *
 * Because RLS is the security boundary, this client-side code only needs the
 * publishable/anon key. There is no service-role access in the browser.
 */

export const SITE_CONFIG_ROW_ID = 1;

export type SiteConfigRow = {
  id: number;
  config: unknown;
  updated_at: string | null;
};

/**
 * Fetches the site config from Supabase.
 * Returns null if the request fails or if Supabase is not available.
 */
export async function fetchSiteConfig(): Promise<unknown | null> {
  // If supabase is not available (e.g., due to initialization error in restricted environments),
  // we cannot fetch from Supabase. Return null to fall back to cache/defaults.
  if (!supabase) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from("site_config")
      .select("config")
      .eq("id", SITE_CONFIG_ROW_ID)
      .maybeSingle();

    if (error) {
      // Surface a single warning so we can debug without breaking the page.
      console.warn("[supabase] fetchSiteConfig failed", error.message);
      return null;
    }
    return data?.config ?? null;
  } catch (err) {
    // Catch any unexpected errors (e.g., if supabase is null but we didn't check, or if the client is in a broken state)
    console.warn("[supabase] fetchSiteConfig failed", err);
    return null;
  }
}

/**
 * Upserts the site config to Supabase.
 * Returns { ok: true } on success, or { ok: false, error } on failure.
 * If supabase is not available, we treat it as a failure but we don't break the page.
 */
export async function upsertSiteConfig(config: unknown): Promise<{
  ok: boolean;
  error?: string;
}> {
  // If supabase is not available, we cannot upsert.
  if (!supabase) {
    return { ok: false, error: "Supabase client not available" };
  }

  try {
    const { error } = await supabase
      .from("site_config")
      .upsert(
        { id: SITE_CONFIG_ROW_ID, config },
        { onConflict: "id" }
      );

    if (error) {
      console.warn("[supabase] upsertSiteConfig failed", error.message);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    console.warn("[supabase] upsertSiteConfig failed", err);
    return { ok: false, error: "Unknown error" };
  }
}