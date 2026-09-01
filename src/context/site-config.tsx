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
  saveConfig,
  type SiteConfig,
} from "@/data/site-config";

type SiteConfigContextValue = {
  config: SiteConfig;
  updateConfig: (patch: Partial<SiteConfig>) => void;
  save: () => void;
  reset: () => void;
  hasUnsavedChanges: boolean;
};

const SiteConfigContext = createContext<SiteConfigContextValue | null>(null);

export function SiteConfigProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);
  const [isHydrated, setIsHydrated] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Hydrate from localStorage on mount.
  useEffect(() => {
    setConfig(loadConfig());
    setIsHydrated(true);
  }, []);

  // Listen for cross-tab or in-memory updates.
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<SiteConfig>).detail;
      setConfig(detail);
      setHasUnsavedChanges(false);
    };
    window.addEventListener("site-config:update", handler);
    return () => window.removeEventListener("site-config:update", handler);
  }, []);

  const updateConfig = useCallback((patch: Partial<SiteConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...patch };
      // Track unsaved changes by diffing stringified state.
      setHasUnsavedChanges(
        JSON.stringify(next) !== JSON.stringify(loadConfig())
      );
      return next;
    });
  }, []);

  const save = useCallback(() => {
    saveConfig(config);
    setHasUnsavedChanges(false);
  }, [config]);

  const reset = useCallback(() => {
    setConfig(defaultConfig);
    localStorage.removeItem("site-config-v1");
    setHasUnsavedChanges(false);
  }, []);

  // Keep hasUnsavedChanges accurate when config changes from save().
  useEffect(() => {
    if (!isHydrated) return;
    setHasUnsavedChanges(JSON.stringify(config) !== JSON.stringify(loadConfig()));
  }, [config, isHydrated]);

  return (
    <SiteConfigContext.Provider
      value={{ config, updateConfig, save, reset, hasUnsavedChanges }}
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
