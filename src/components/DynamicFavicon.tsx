"use client";

import { useEffect } from "react";
import { useSiteConfig } from "@/context/site-config";

/**
 * Client component that updates the browser's favicon whenever the
 * SiteConfig `favicon` field changes (i.e. after a save).
 *
 * - If `favicon` is empty, the browser's current icon (Next.js default) is kept.
 * - If `favicon` is set, it inserts / replaces the `<link rel="icon">` tag.
 */
export function DynamicFavicon() {
  const { config } = useSiteConfig();

  useEffect(() => {
    if (!config.favicon) return;

    // Check if document is available
    if (typeof document === "undefined") {
      return;
    }

    const faviconUrl = config.favicon.startsWith("/")
      ? config.favicon
      : `/${config.favicon}`;

    // Try to find an existing icon link (any type)
    let link = document.querySelector<HTMLLinkElement>(
      'link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]'
    );

    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      link.type = getMimeType(faviconUrl);
      document.head.appendChild(link);
    } else {
      link.type = getMimeType(faviconUrl);
    }

    link.href = faviconUrl;
  }, [config.favicon]);

  return null;
}

function getMimeType(url: string): string {
  const ext = url.split(".").pop()?.toLowerCase();
  const map: Record<string, string> = {
    png: "image/png",
    ico: "image/x-icon",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
    svg: "image/svg+xml",
    gif: "image/gif",
    avif: "image/avif",
  };
  return map[ext ?? ""] ?? "image/png";
}