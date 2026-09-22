/**
 * Dominant vibrant color extraction from images.
 *
 * Client-side only (Canvas + Image APIs). Runs entirely in the browser, so it
 * works with the static export (`output: "export"`) — no server round-trip.
 *
 * The extracted color is used as a *subtle* per-project accent on an otherwise
 * black page: a low-opacity radial glow behind the hero text and small clean
 * details (underlines, nav highlight). It never becomes a background wash.
 *
 * Strategy:
 *   1. Draw a downsampled copy of the image onto a small canvas.
 *   2. Histogram pixels into a coarse RGB space (5 bits per channel), skipping
 *      near-black/near-white noise.
 *   3. Score buckets by vibrance × population and normalize the winner into a
 *      range that reads well as an accent on black (saturated, mid-toned).
 *
 * All colors are HSL (h 0–360, s/l 0–1) to match the site's CSS-variable
 * theming conventions — see tailwind.config.ts.
 */

export type RGB = { r: number; g: number; b: number };
export type HSL = { h: number; s: number; l: number };

/** Fallback accent: a warm gold/bronze (HSL 40° 65% 58%). */
export const FALLBACK_ACCENT_HSL: HSL = { h: 40, s: 0.65, l: 0.58 };

/* -------------------------------------------------------------------------- */
/* Color space conversions                                                    */
/* -------------------------------------------------------------------------- */

/** Standard RGB → HSL conversion. Inputs/outputs in 0–1 (h in 0–360). */
export function rgbToHsl({ r, g, b }: RGB): HSL {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) {
    return { h: 0, s: 0, l }; // achromatic
  }

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h: number;
  switch (max) {
    case r:
      h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      break;
    case g:
      h = ((b - r) / d + 2) / 6;
      break;
    default:
      h = ((r - g) / d + 4) / 6;
  }

  return { h: h * 360, s, l };
}

/** Standard HSL → RGB conversion. Inputs/outputs in 0–1 (h in 0–360). */
export function hslToRgb({ h, s, l }: HSL): RGB {
  const hue = (((h % 360) + 360) % 360) / 360;

  if (s === 0) {
    return { r: l, g: l, b: l };
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  const channel = (t: number) => {
    const x = (t + 1) % 1;
    if (x < 1 / 6) return p + (q - p) * 6 * x;
    if (x < 1 / 2) return q;
    if (x < 2 / 3) return p + (q - p) * (2 / 3 - x) * 6;
    return p;
  };

  return {
    r: channel(hue + 1 / 3),
    g: channel(hue),
    b: channel(hue - 1 / 3),
  };
}

/* -------------------------------------------------------------------------- */
/* Extraction                                                                 */
/* -------------------------------------------------------------------------- */

/** Bucket size for the coarse color histogram (5 bits per channel). */
const BUCKET_BITS = 5;
const BUCKET_SHIFT = 8 - BUCKET_BITS;

/** Extraction works on a tiny downsample for speed; quality is unaffected. */
const SAMPLE_SIZE = 64;

/** Result of extracting an accent color from an image. */
export type AccentResult = {
  /** HSL accent, hue in 0–360, s/l in 0–1. */
  accent: HSL;
  /** True when no usable color could be extracted (caller should use fallback). */
  usedFallback: boolean;
};

/**
 * Extract the dominant, vibrant accent color from an image URL.
 *
 * Resolves with `usedFallback: true` (and the gold/bronze default) when the
 * image fails to load or Canvas is unavailable (e.g. tainted cross-origin
 * canvas, SSR).
 */
export async function extractAccentColor(src: string): Promise<AccentResult> {
  const fallback: AccentResult = { accent: FALLBACK_ACCENT_HSL, usedFallback: true };

  if (typeof window === "undefined" || typeof document === "undefined") {
    return fallback;
  }

  try {
    const pixels = await loadImagePixels(src);
    if (!pixels) return fallback;

    const accent = pickVibrantAccent(pixels.data, pixels.width, pixels.height);
    if (!accent) return fallback;

    return { accent, usedFallback: false };
  } catch {
    // CORS, decode error, or anything unexpected — fall back gracefully.
    return fallback;
  }
}

/** Downsample the image into a canvas and return its pixel data. */
async function loadImagePixels(
  src: string
): Promise<{ data: Uint8ClampedArray; width: number; height: number } | null> {
  const image = await loadImage(src);
  if (!image) return null;

  const w = image.naturalWidth || image.width;
  const h = image.naturalHeight || image.height;
  if (!w || !h) return null;

  const scale = Math.min(1, SAMPLE_SIZE / Math.max(w, h));
  const width = Math.max(1, Math.round(w * scale));
  const height = Math.max(1, Math.round(h * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  ctx.drawImage(image, 0, 0, width, height);
  const imageData = ctx.getImageData(0, 0, width, height);
  return { data: imageData.data, width, height };
}

/**
 * next/image prepends the configured basePath automatically (the site exports
 * to `/portfolio` in production); a plain <img> does not. Apply the same
 * convention so the probe hits the same URL the visible image uses.
 */
function withBasePath(src: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH;
  if (!base || !src.startsWith("/")) return src;
  return `${base.replace(/\/$/, "")}${src}`;
}

/** Load an image, resolving `null` on error/timeout instead of throwing. */
function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.decoding = "async";
    // Not strictly needed for same-origin assets, and harmless when set.
    img.crossOrigin = "anonymous";

    const timeout = window.setTimeout(() => {
      cleanup();
      resolve(null);
    }, 10_000);

    const cleanup = () => {
      window.clearTimeout(timeout);
      img.onload = null;
      img.onerror = null;
    };

    img.onload = () => {
      cleanup();
      resolve(img);
    };
    img.onerror = () => {
      cleanup();
      resolve(null);
    };
    img.src = withBasePath(src);
  });
}

type Bucket = {
  count: number;
  rSum: number;
  gSum: number;
  bSum: number;
};

/**
 * Find the accent color from raw RGBA pixel data.
 *
 * Returns `null` when the image has no colorful region at all (pure
 * grayscale/monochrome artwork) — the caller then applies its own fallback.
 */
function pickVibrantAccent(
  data: Uint8ClampedArray,
  width: number,
  height: number
): HSL | null {
  const buckets = new Map<number, Bucket>();

  for (let i = 0; i < width * height; i++) {
    const a = data[i * 4 + 3];
    // Fully transparent pixels carry no color information.
    if (a < 125) continue;

    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];

    // The site is near-black; near-black/near-white pixels are visual noise.
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    if (max < 26 || (max > 230 && min > 200)) continue;

    const key =
      ((r >> BUCKET_SHIFT) << (BUCKET_BITS * 2)) |
      ((g >> BUCKET_SHIFT) << BUCKET_BITS) |
      (b >> BUCKET_SHIFT);

    const bucket = buckets.get(key);
    if (bucket) {
      bucket.count++;
      bucket.rSum += r;
      bucket.gSum += g;
      bucket.bSum += b;
    } else {
      buckets.set(key, { count: 1, rSum: r, gSum: g, bSum: b });
    }
  }

  if (buckets.size === 0) return null;

  const total = [...buckets.values()].reduce((sum, b) => sum + b.count, 0);
  if (total === 0) return null;

  let best: HSL | null = null;
  let bestScore = -1;

  for (const bucket of buckets.values()) {
    const rgb: RGB = {
      r: bucket.rSum / bucket.count / 255,
      g: bucket.gSum / bucket.count / 255,
      b: bucket.bSum / bucket.count / 255,
    };
    const hsl = rgbToHsl(rgb);

    // Score = vibrance × sqrt(population share), so a small but electric
    // region of the artwork can win over a large muted one — the accent
    // reflects the image's most saturated lively color, not its average.
    const score = vibrance(hsl) * Math.sqrt(bucket.count / total);

    if (score > bestScore) {
      bestScore = score;
      best = hsl;
    }
  }

  if (!best || bestScore <= 0) return null;
  return normalizeAccent(best);
}

/** How "accent-like" a color is: saturated and mid-toned. Grays score ~0. */
function vibrance({ s, l }: HSL): number {
  const lightnessPenalty = 1 - Math.abs(l - 0.55) / 0.55;
  return Math.max(0, s) * Math.max(0, lightnessPenalty);
}

export /**
 * Nudge the extracted color into a range that reads well as a small accent on
 * the site's black background: clearly saturated, bright enough to glow
 * subtly, never washed out. Saturation is boosted ~45% so muted artwork still
 * yields a color that pops as a premium accent on black.
 */
function normalizeAccent({ h, s, l }: HSL): HSL {
  const MIN_SATURATION = 0.55;
  const MIN_LIGHTNESS = 0.58;
  const MAX_LIGHTNESS = 0.74;

  const sat = Math.min(1, Math.max(MIN_SATURATION, s * 1.45));
  const light = Math.min(MAX_LIGHTNESS, Math.max(MIN_LIGHTNESS, l * 1.45));
  return { h: ((h % 360) + 360) % 360, s: sat, l: light };
}
