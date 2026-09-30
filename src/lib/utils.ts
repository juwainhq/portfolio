import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Prefix a root-relative public asset path with the deployment base path
 * (e.g. `/portfolio` on GitHub Pages, set via NEXT_PUBLIC_BASE_PATH).
 *
 * `next/link`, `next/router`, and metadata icons apply basePath automatically;
 * plain `<img src="...">` and JS-injected URLs do not. Apply this helper at
 * those call sites so the same config paths work locally (base = "") and on
 * the deployed site.
 */
export function withBasePath(src: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH;
  if (!base || !src.startsWith("/")) return src;
  const normalizedBase = base.replace(/\/$/, "");
  if (src.startsWith(`${normalizedBase}/`)) return src; // already prefixed
  return `${normalizedBase}${src}`;
}
