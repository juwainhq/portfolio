"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Grid2X2, Palette } from "lucide-react";
import {
  ditherImageRamp,
  frameFingerprint,
  gridFor,
  luminanceRange,
  parseColor,
  type RGB,
} from "@/lib/dither";
import { withBasePath } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  /** Extra classes for the frame. */
  className?: string;
  /** How the source image fills the frame (matches the old `fit` field). */
  fit?: "cover" | "contain";
  /** One dither dot every `cell` CSS pixels. */
  cell?: number;
  /** Longest edge of the processing canvas — the cost knob. */
  maxPixels?: number;
  /** Vivid accent ids (1-5) forming the tri-tone ramp, dark → light. */
  accents?: number[];
  /** Show the corner "colour / dither" toggle on touch devices. */
  touchToggle?: boolean;
  /** Image priority hint for the browser. */
  priority?: boolean;
  sizes?: string;
};

const INK: RGB = { r: 10, g: 10, b: 16 };

/**
 * Which crop of which photograph is already on screen.
 *
 * The project list reuses source files, and two cards built from the same
 * photograph look like a mistake. Each card fingerprints its cropped frame and,
 * if another card already shows that frame, shifts to the next candidate crop —
 * art direction instead of a duplicate.
 */
const claimedFrames = new Map<string, string>();

type Crop = { x: number; y: number; zoom: number };

/** Full frame first, then progressively tighter fields centred on it. */
const CROP_CANDIDATES: Crop[] = [
  { x: 0.5, y: 0.5, zoom: 1 },
  { x: 0.5, y: 0.5, zoom: 0.78 },
  { x: 0.42, y: 0.38, zoom: 0.62 },
  { x: 0.6, y: 0.62, zoom: 0.62 },
];
/**
 * Dark → light ramp for the photo treatment: ink shadow, violet mid-tone, hot
 * magenta, then the warm paper highlight. Four steps is what makes it read as
 * a riso print rather than a two-colour poster; the paper at the top keeps the
 * highlights from blowing out into a flat accent.
 */
const DEFAULT_ACCENTS = [5, 3];

/**
 * Project imagery: dithered by default, full colour on hover / keyboard focus,
 * and toggled by a dedicated button on touch devices (so tapping the card can
 * still follow its link).
 *
 * The dither is computed once, at a low resolution, when the frame scrolls
 * into view; the two layers then cross-fade with plain CSS opacity.
 */
export function DitherImage({
  src,
  alt,
  className = "",
  fit = "cover",
  cell = 3,
  maxPixels = 400,
  accents = DEFAULT_ACCENTS,
  touchToggle = true,
  priority = false,
  sizes,
}: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  // The crop actually used: the full frame, or a tighter field when the full
  // frame is already showing elsewhere on the page.
  const [crop, setCrop] = useState<Crop>(CROP_CANDIDATES[0]);
  const instanceId = useRef(
    `frame-${Math.random().toString(36).slice(2)}`
  ).current;
  const { resolvedTheme } = useTheme();
  const accentsKey = accents.join(",");

  useEffect(() => {
    const frame = frameRef.current;
    const canvas = canvasRef.current;
    if (!frame || !canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let cancelled = false;
    let observer: IntersectionObserver | null = null;
    const url = withBasePath(src);

    const styles = window.getComputedStyle(document.documentElement);
    // Fixed warm paper (not --foreground, which is ink in the light theme):
    // the card is a print either way, so the ramp always ends on paper.
    const paper =
      parseColor(styles.getPropertyValue("--print-paper")) ??
      ({ r: 246, g: 242, b: 233 } as RGB);
    const ramp: RGB[] = [
      INK,
      ...accentsKey
        .split(",")
        .map(Number)
        .map((id) => parseColor(styles.getPropertyValue(`--vivid-${id}`)))
        .filter((c): c is RGB => c !== null),
      paper,
    ];

    const render = (image: HTMLImageElement) => {
      const rect = frame.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const capped = Math.max(24, Math.min(maxPixels, rect.width));
      const grid = gridFor(capped, (capped * rect.height) / rect.width, cell, 320);
      canvas.width = grid.cols;
      canvas.height = grid.rows;
      ctx.imageSmoothingEnabled = true;
      ctx.clearRect(0, 0, grid.cols, grid.rows);

      const sourceAspect = image.naturalWidth / image.naturalHeight;
      const targetAspect = grid.cols / grid.rows;

      // The window `cover`/`contain` would show (centred), plus the extra zoom
      // window inside it that a repeated photograph falls back to.
      const cropWith = (point: Crop) => {
        const covers = fit === "cover" ? sourceAspect > targetAspect : sourceAspect < targetAspect;
        let baseW = image.naturalWidth;
        let baseH = image.naturalHeight;
        if (covers) baseW = image.naturalHeight * targetAspect;
        else baseH = image.naturalWidth / targetAspect;

        const sw = baseW * point.zoom;
        const sh = baseH * point.zoom;
        const sx = (image.naturalWidth - baseW) / 2 + (baseW - sw) * point.x;
        const sy = (image.naturalHeight - baseH) / 2 + (baseH - sh) * point.y;

        ctx.clearRect(0, 0, grid.cols, grid.rows);
        ctx.drawImage(image, sx, sy, sw, sh, 0, 0, grid.cols, grid.rows);
        return ctx.getImageData(0, 0, grid.cols, grid.rows);
      };

      // Walk the candidate crops until one is not already on screen. `contain`
      // never crops, so it only ever has the one frame.
      let source = cropWith(CROP_CANDIDATES[0]);
      let chosen = CROP_CANDIDATES[0];
      for (const candidate of CROP_CANDIDATES) {
        source = cropWith(candidate);
        const owner = claimedFrames.get(frameFingerprint(source));
        chosen = candidate;
        if (!owner || owner === instanceId) break;
      }
      // Re-claim the frame under this instance (a re-render releases its old one).
      for (const [key, owner] of claimedFrames) {
        if (owner === instanceId) claimedFrames.delete(key);
      }
      claimedFrames.set(frameFingerprint(source), instanceId);
      setCrop(chosen);

      // Normalise the photo once, then dither the whole frame through the same
      // levels so every card in the grid has matching density.
      const levels = luminanceRange(source);
      ctx.putImageData(
        ditherImageRamp(source, ramp, { levels, gamma: 0.85, floor: 0.08 }),
        0,
        0
      );
      ctx.imageSmoothingEnabled = false;
      setReady(true);
    };

    const load = () => {
      const image = new Image();
      image.decoding = "async";
      image.onload = () => {
        if (!cancelled) render(image);
      };
      image.onerror = () => {
        if (!cancelled) setFailed(true);
      };
      image.src = url;
    };

    if (priority) {
      load();
    } else {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            load();
            observer?.disconnect();
          }
        },
        { rootMargin: "300px" }
      );
      observer.observe(frame);
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
      for (const [key, owner] of claimedFrames) {
        if (owner === instanceId) claimedFrames.delete(key);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, fit, cell, maxPixels, accentsKey, priority, resolvedTheme]);

  // Cross-fade duration is neutralised by the global reduced-motion rule.
  const transition = "transition-opacity duration-700 ease-out";

  return (
    <div
      ref={frameRef}
      className={`group/dither relative isolate overflow-hidden bg-muted ${className}`}
      data-dither-image={src}
    >
      {/* Dithered layer (default state) */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        role="presentation"
        className={`pixelated absolute inset-0 h-full w-full ${transition} ${
          revealed || failed ? "opacity-0" : ""
        } ${ready ? "opacity-100" : "opacity-0"} group-hover/dither:opacity-0 group-focus-visible/dither:opacity-0`}
      />

      {/* Full-colour layer (hover / focus / tap) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={withBasePath(src)}
        alt={alt}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        style={{
          objectPosition: "50% 50%",
          transformOrigin: `${crop.x * 100}% ${crop.y * 100}%`,
          transform: crop.zoom === 1 ? undefined : `scale(${1 / crop.zoom})`,
        }}
        className={`absolute inset-0 h-full w-full ${
          fit === "cover" ? "object-cover" : "object-contain"
        } ${transition} ${
          revealed ? "opacity-100" : "opacity-0"
        } group-hover/dither:opacity-100 group-focus-visible/dither:opacity-100`}
      />

      {touchToggle && !failed ? (
        <button
          type="button"
          onClick={(event) => {
            // Keep the card's link from firing while revealing the artwork.
            event.preventDefault();
            event.stopPropagation();
            setRevealed((v) => !v);
          }}
          aria-pressed={revealed}
          className="coarse-only absolute bottom-3 right-3 z-10 items-center gap-2 bg-background px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-foreground [border:var(--hairline-strong)_solid_hsl(var(--foreground))]"
        >
          {revealed ? (
            <>
              <Grid2X2 size={12} aria-hidden="true" /> Dither
            </>
          ) : (
            <>
              <Palette size={12} aria-hidden="true" /> Colour
            </>
          )}
        </button>
      ) : null}
    </div>
  );
}
