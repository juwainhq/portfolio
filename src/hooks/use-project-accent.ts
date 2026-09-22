"use client";

import { useEffect, useState } from "react";
import { extractAccentColor, type HSL } from "@/lib/color-extraction";

/**
 * Resolves the dynamic accent color for a project detail page.
 *
 * Returns `null` until extraction finishes, so pages can render with the
 * gold/bronze default (from CSS) and enhance once the color is known —
 * no flash, no layout shift.
 *
 * Results are cached per image URL, so navigating between projects (or back
 * to a previously visited one) is instant after the first visit.
 */
export function useProjectAccent(imageSrc: string | undefined): HSL | null {
  const [hsl, setHsl] = useState<HSL | null>(null);

  useEffect(() => {
    if (!imageSrc) return;

    let cancelled = false;
    const cached = accentCache.get(imageSrc);

    if (cached) {
      setHsl(cached);
      return;
    }

    setHsl(null);
    extractAccentColor(imageSrc).then((result) => {
      if (cancelled) return;
      // Cache even fallbacks so a broken image doesn't re-trigger a network
      // request on every revisit of the same project page.
      cacheAccent(imageSrc, result.accent);
      setHsl(result.accent);
    });

    return () => {
      cancelled = true;
    };
  }, [imageSrc]);

  return hsl;
}

/* -------------------------------------------------------------------------- */
/* Per-image cache                                                            */
/* -------------------------------------------------------------------------- */

const MAX_CACHE_ENTRIES = 24;

const accentCache = new Map<string, HSL>();

function cacheAccent(key: string, value: HSL) {
  if (!accentCache.has(key) && accentCache.size >= MAX_CACHE_ENTRIES) {
    // Map preserves insertion order: drop the oldest entry.
    const oldest = accentCache.keys().next().value;
    if (oldest !== undefined) accentCache.delete(oldest);
  }
  accentCache.set(key, value);
}
