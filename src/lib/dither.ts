/**
 * Ordered (Bayer) dithering toolkit.
 *
 * Everything the site draws "dithered" goes through this file: the animated
 * hero field, the static section dividers, the project-card treatments and
 * the desktop pointer trail. It is deliberately dependency-free, tiny and
 * allocation-light so it can run at 30fps on a phone.
 */

export type RGB = { r: number; g: number; b: number };

/** Classic 8x8 Bayer threshold matrix, values 0..63 (order 64 = 8x8). */
export const BAYER_8 = new Uint8Array([
  0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36,
  14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41,
  51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23,
  61, 29, 53, 21,
]);

/** Normalised threshold for a pixel position (0..1). */
export function bayerThreshold(x: number, y: number): number {
  return (BAYER_8[((y & 7) << 3) | (x & 7)] + 0.5) / 64;
}

/* -------------------------------------------------------------------------- */
/*  Colour helpers                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Parse a CSS custom-property value such as `"77 100% 65%"` (the HSL triplet
 * shape Tailwind keeps in globals.css) or a hex colour into RGB.
 */
export function parseColor(value: string): RGB | null {
  const raw = value.trim();
  if (!raw) return null;

  if (raw.startsWith("#")) {
    let hex = raw.slice(1);
    if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
    if (hex.length !== 6) return null;
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
    };
  }

  // "H S% L%" / "H, S%, L%" (HSL triplet)
  const match = raw.match(
    /^(-?[\d.]+)\s*[,\s]\s*(-?[\d.]+)%\s*[,\s]\s*(-?[\d.]+)%/
  );
  if (match) {
    return hslToRgb(
      Number(match[1]),
      Number(match[2]) / 100,
      Number(match[3]) / 100
    );
  }
  return null;
}

export function hslToRgb(h: number, s: number, l: number): RGB {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = (((h % 360) + 360) % 360) / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r = 0;
  let g = 0;
  let b = 0;
  if (hp < 1) [r, g, b] = [c, x, 0];
  else if (hp < 2) [r, g, b] = [x, c, 0];
  else if (hp < 3) [r, g, b] = [0, c, x];
  else if (hp < 4) [r, g, b] = [0, x, c];
  else if (hp < 5) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const m = l - c / 2;
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

export function luminance({ r, g, b }: RGB): number {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

/** Mix two RGB colours (t = 0 → a, t = 1 → b). */
export function mix(a: RGB, b: RGB, t: number): RGB {
  return {
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
  };
}

/**
 * Read dither colours off an element's computed style.
 * Falls back to a lime/cyan/magenta riso set when the vars are unavailable.
 */
export type DitherPalette = { colors: RGB[]; base: RGB; ink: RGB };

const FALLBACK: DitherPalette = {
  colors: [
    { r: 205, g: 255, b: 74 },
    { r: 79, g: 216, b: 255 },
    { r: 255, g: 92, b: 168 },
  ],
  base: { r: 8, g: 8, b: 13 },
  ink: { r: 0, g: 0, b: 0 },
};

export function readPalette(
  el: HTMLElement | null,
  options: { vivid?: number[]; accent?: boolean; withBase?: boolean } = {}
): DitherPalette {
  if (!el || typeof window === "undefined") return FALLBACK;
  const styles = window.getComputedStyle(el);
  const variables = options.accent
    ? ["--accent-1", "--accent-2", "--accent-3", "--accent-4", "--accent-5"]
    : ["--vivid-1", "--vivid-2", "--vivid-3", "--vivid-4", "--vivid-5"];

  const ids = options.vivid ?? [1, 2, 3];
  const colors = ids
    .map((id) => parseColor(styles.getPropertyValue(variables[id - 1] ?? "")))
    .filter((c): c is RGB => c !== null);

  const base =
    (options.withBase === false
      ? null
      : parseColor(styles.getPropertyValue("--background"))) ?? FALLBACK.base;
  const ink =
    parseColor(styles.getPropertyValue("--foreground")) ?? FALLBACK.ink;

  return { colors: colors.length ? colors : FALLBACK.colors, base, ink };
}

/* -------------------------------------------------------------------------- */
/*  Ordered dithering of a value field                                        */
/* -------------------------------------------------------------------------- */

/**
 * Map a 0..1 value to `palette` using an ordered dither. The fractional part
 * of the value decides, per pixel, which of the two neighbouring palette
 * entries to place — that is what makes the gradient read as a dot pattern.
 */
export function ditherValue(
  value: number,
  threshold: number,
  palette: RGB[]
): RGB {
  const n = palette.length;
  if (n === 1) return palette[0];
  const scaled = Math.min(0.999999, Math.max(0, value)) * (n - 1);
  const index = Math.floor(scaled);
  const fraction = scaled - index;
  return fraction > threshold
    ? palette[Math.min(index + 1, n - 1)]
    : palette[index];
}

/**
 * Auto-levels: find the luminance range that actually carries the picture and
 * return the 2nd/98.5th percentile bounds. Photographs are usually much darker
 * than the colour ramp, so without this the dither collapses into the bottom
 * one or two steps. `floor` guards against near-flat images.
 */
export function luminanceRange(
  source: ImageData,
  options: { low?: number; high?: number; floor?: number } = {}
): { lo: number; hi: number } {
  const { data, width, height } = source;
  const histogram = new Uint32Array(256);
  let counted = 0;

  for (let i = 0; i < width * height; i++) {
    const p = i * 4;
    if (data[p + 3] === 0) continue;
    const lum =
      0.2126 * data[p] + 0.7152 * data[p + 1] + 0.0722 * data[p + 2];
    histogram[lum | 0]++;
    counted++;
  }
  if (counted === 0) return { lo: 0, hi: 255 };

  const percentile = (q: number) => {
    const target = counted * q;
    let acc = 0;
    for (let v = 0; v < 256; v++) {
      acc += histogram[v];
      if (acc >= target) return v;
    }
    return 255;
  };

  const lo = percentile(options.low ?? 0.02);
  const hi = percentile(options.high ?? 0.985);
  return { lo, hi: Math.max(hi, lo + (options.floor ?? 24)) };
}

/**
 * Ordered-dither a source ImageData into an RGBA buffer using a luminance ramp
 * over `palette` — the photo treatment used by the project cards.
 *
 * The ramp runs dark → light, so `palette[0]` is the ink and the last entry is
 * the paper highlight. `levels` normalises the photo first, `gamma` decides how
 * the mid-tones are distributed across the ramp, and `floor` lifts the very
 * darkest pixels off pure ink so detail survives in the shadows.
 */
export function ditherImageRamp(
  source: ImageData,
  palette: RGB[],
  options: {
    cutoff?: number;
    gamma?: number;
    floor?: number;
    levels?: { lo: number; hi: number };
  } = {}
): ImageData {
  const { data, width, height } = source;
  const out = new Uint8ClampedArray(data.length);
  const cutoff = options.cutoff ?? 0;
  const gamma = options.gamma ?? 0.9;
  const floor = options.floor ?? 0.06;
  const levels = options.levels ?? luminanceRange(source);
  const span = Math.max(1, levels.hi - levels.lo);
  const levels_ = 1 - floor;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (data[i + 3] === 0) {
        out[i + 3] = 0;
        continue;
      }
      const lum =
        0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
      const normalised = Math.min(1, Math.max(0, (lum - levels.lo) / span));
      const shaped = Math.min(
        1,
        Math.max(0, (normalised - cutoff) / (1 - cutoff))
      );
      const value = floor + levels_ * Math.pow(shaped, gamma);
      const c = ditherValue(value, bayerThreshold(x, y), palette);
      out[i] = c.r;
      out[i + 1] = c.g;
      out[i + 2] = c.b;
      out[i + 3] = 255;
    }
  }

  return new ImageData(out, width, height);
}

/* -------------------------------------------------------------------------- */
/*  Fields used by the hero + dividers                                        */
/* -------------------------------------------------------------------------- */

/**
 * A cheap, seamless "ink field": three travelling waves. Everything the loop
 * needs per frame is two lookup tables (per column, per row/diagonal), so the
 * inner loop is table reads plus adds — no trigonometry per pixel.
 */
export type Field = {
  x: Float32Array;
  y: Float32Array;
  d: Float32Array;
  cols: number;
  rows: number;
};

export function createField(
  cols: number,
  rows: number,
  time: number,
  freq = { x: 0.24, y: 0.18, d: 0.12 }
): Field {
  const x = new Float32Array(cols);
  const y = new Float32Array(rows);
  const d = new Float32Array(cols + rows);
  for (let i = 0; i < cols; i++) x[i] = Math.sin(i * freq.x + time);
  for (let j = 0; j < rows; j++) y[j] = Math.sin(j * freq.y - time * 1.25);
  for (let i = 0; i < cols + rows; i++) {
    d[i] = Math.sin((i - cols) * freq.d + time * 0.6);
  }
  return { x, y, d, cols, rows };
}

/** Sample the field at (x, y) — returns 0..1. */
export function sampleField(field: Field, x: number, y: number): number {
  const v = (field.x[x] + field.y[y] + field.d[x + y]) / 3;
  return v * 0.5 + 0.5;
}

/**
 * Static gradient + dither used by dividers, panels and card backgrounds.
 * `angle` follows CSS conventions (0deg = to top).
 */
export function ditherGradient(
  width: number,
  height: number,
  palette: RGB[],
  options: { angle?: number; scale?: number; softness?: number } = {}
): ImageData {
  const out = new Uint8ClampedArray(width * height * 4);
  const angle = ((options.angle ?? 115) * Math.PI) / 180;
  // Projection of each pixel onto the gradient axis, normalised to 0..1.
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const extent = Math.max(1, Math.abs(cos) * width + Math.abs(sin) * height);
  const softness = options.softness ?? 1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const t =
        (x * cos + (height - y) * sin) / extent; // 0..1 across the axis
      const wave = Math.sin(t * Math.PI * softness);
      const value = Math.min(1, Math.max(0, t * 0.6 + wave * 0.4));
      const c = ditherValue(value, bayerThreshold(x, y), palette);
      const i = (y * width + x) * 4;
      out[i] = c.r;
      out[i + 1] = c.g;
      out[i + 2] = c.b;
      out[i + 3] = 255;
    }
  }

  return new ImageData(out, width, height);
}

/* -------------------------------------------------------------------------- */
/*  Sizing helpers                                                            */
/* -------------------------------------------------------------------------- */

/** Grid size for a box: one dither dot every `cell` CSS pixels. */
export function gridFor(
  width: number,
  height: number,
  cell: number,
  maxCols = 220
): { cols: number; rows: number; cell: number } {
  const cols = Math.max(8, Math.min(maxCols, Math.round(width / cell)));
  const step = width / cols;
  const rows = Math.max(6, Math.round(height / step));
  return { cols, rows, cell: step };
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** 30fps is plenty for a dither field and keeps phones cool. */
export const FRAME_MS = 1000 / 30;
