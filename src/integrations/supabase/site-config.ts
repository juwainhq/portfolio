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

export async function fetchSiteConfig(): Promise<unknown | null> {
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
}

export async function upsertSiteConfig(config: unknown): Promise<{
  ok: boolean;
  error?: string;
}> {
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
}
