"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Grid2X2, Palette } from "lucide-react";
import { ditherImageRamp, gridFor, parseColor, type RGB } from "@/lib/dither";
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
// Dark → light. The ramp deliberately ends on the brightest accent so the
// dithered state reads as a vivid tri-tone print rather than a dark texture.
const DEFAULT_ACCENTS = [3, 2, 1];

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
  cell = 5,
  maxPixels = 260,
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
    const ramp: RGB[] = [
      INK,
      ...accentsKey
        .split(",")
        .map(Number)
        .map((id) => parseColor(styles.getPropertyValue(`--vivid-${id}`)))
        .filter((c): c is RGB => c !== null),
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

      // Cover/contain crop of the source into the (low-res) dither grid.
      const sourceAspect = image.naturalWidth / image.naturalHeight;
      const targetAspect = grid.cols / grid.rows;
      let sx = 0;
      let sy = 0;
      let sw = image.naturalWidth;
      let sh = image.naturalHeight;
      if (fit === "cover" ? sourceAspect > targetAspect : sourceAspect < targetAspect) {
        sw = image.naturalHeight * targetAspect;
        sx = (image.naturalWidth - sw) / 2;
      } else {
        sh = image.naturalWidth / targetAspect;
        sy = (image.naturalHeight - sh) / 2;
      }

      ctx.drawImage(image, sx, sy, sw, sh, 0, 0, grid.cols, grid.rows);
      const source = ctx.getImageData(0, 0, grid.cols, grid.rows);
      ctx.putImageData(ditherImageRamp(source, ramp), 0, 0);
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
          className="coarse-only absolute bottom-3 right-3 z-10 items-center gap-2 border-2 border-foreground bg-background px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-foreground"
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
