import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Prefix a root-relative public asset path with the deployment base path
 * (`/portfolio` on GitHub Pages, injected as NEXT_PUBLIC_BASE_PATH at build
 * time). Plain <img> tags are not rewritten by `basePath`, so every asset URL
 * rendered by hand must pass through here.
 */
export function withBasePath(path: string): string {
  if (!path) return path;
  // Absolute URLs, data URIs and mailto/tel links are left untouched.
  if (/^([a-z][a-z0-9+.-]*:)?\/\//i.test(path) || path.startsWith("data:")) {
    return path;
  }
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  if (!base) return path;
  const normalised = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalised}`;
}

/** Small helper for building section ids from labels. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
