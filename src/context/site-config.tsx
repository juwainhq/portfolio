/**
 * Site configuration context.
 *
 * The public site reads from this context and the /admin editor writes to it.
 *
 * Data flow:
 *   1. Mount with local defaults (instant first paint via `loadConfig()`).
 *   2. Async: fetch latest config from Supabase → update state if different.
 *   3. On save: write to Supabase (authoritative) and update local cache.
 *   4. On reset: write bundled defaults to Supabase and clear cache.
 *
 * The `SiteConfig` shape and the context API are intentionally stable — no
 * consumer code (public components or the admin editor) needs to change.
 */

"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  defaultConfig,
  loadConfig,
  loadSiteConfig,
  saveConfig,
  resetConfig,
  type SiteConfig,
} from "@/data/site-config";

type SiteConfigContextValue = {
  config: SiteConfig;
  /** Whether Supabase has been loaded yet (false during initial hydration). */
  isHydrated: boolean;
  updateConfig: (patch: Partial<SiteConfig>) => void;
  /** Async save — returns `{ok, error?}`. */
  save: () => Promise<{ ok: boolean; error?: string }>;
  /** Async reset — returns `{ok, error?}`. */
  reset: () => Promise<{ ok: boolean; error?: string }>;
  hasUnsavedChanges: boolean;
};

const SiteConfigContext = createContext<SiteConfigContextValue | null>(null);

export function SiteConfigProvider({ children }: { children: React.ReactNode }) {
  // Start with the fastest available snapshot: local cache or bundled defaults.
  const [config, setConfig] = useState<SiteConfig>(loadConfig);
  const [isHydrated, setIsHydrated] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // 1. Hydrate from Supabase on mount (runs once).
  useEffect(() => {
    let cancelled = false;

    loadSiteConfig().then((remote) => {
      if (cancelled) return;
      setConfig(remote);
      setHasUnsavedChanges(false);
      setIsHydrated(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // 2. Keep `hasUnsavedChanges` in sync with the current canonical state.
  useEffect(() => {
    if (!isHydrated) return;
    const baseline = loadConfig();
    setHasUnsavedChanges(JSON.stringify(config) !== JSON.stringify(baseline));
  }, [config, isHydrated]);

  // 3. Listen for in-tab save events (e.g. same-browser admin tabs).
  useEffect(() => {
    const handler = (e: Event) => {
      const incoming = (e as CustomEvent<SiteConfig>).detail;
      setConfig(incoming);
      setHasUnsavedChanges(false);
    };
    window.addEventListener("site-config:update", handler);
    return () => window.removeEventListener("site-config:update", handler);
  }, []);

  const updateConfig = useCallback((patch: Partial<SiteConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  }, []);

  const save = useCallback(async (): Promise<{ ok: boolean; error?: string }> => {
    const result = await saveConfig(config);
    if (result.ok) {
      setHasUnsavedChanges(false);
    }
    return result;
  }, [config]);

  const reset = useCallback(async (): Promise<{ ok: boolean; error?: string }> => {
    const result = await resetConfig();
    if (result.ok) {
      setConfig(defaultConfig);
      setHasUnsavedChanges(false);
    }
    return result;
  }, []);

  return (
    <SiteConfigContext.Provider
      value={{
        config,
        isHydrated,
        updateConfig,
        save,
        reset,
        hasUnsavedChanges,
      }}
    >
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig(): SiteConfigContextValue {
  const ctx = useContext(SiteConfigContext);
  if (!ctx) {
    throw new Error("useSiteConfig must be used inside SiteConfigProvider");
  }
  return ctx;
}
