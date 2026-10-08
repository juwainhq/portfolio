"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import {
  FRAME_MS,
  bayerThreshold,
  ditherValue,
  gridFor,
  parseColor,
  prefersReducedMotion,
  type RGB,
} from "@/lib/dither";

type Props = {
  className?: string;
  /** Which vivid accents feed the dither ramp (1-5). */
  accents?: number[];
  /** One dither dot every `cell` CSS pixels. */
  cell?: number;
  /** Upper bound on the canvas grid width — the main cost knob. */
  maxCols?: number;
  /** Drift speed of the field. */
  speed?: number;
  /**
   * Exponent applied to the raw field value. 1 = even colour coverage,
   * 2+ = mostly page-background dots with colour pooling in the bright
   * blobs (the riso-print look).
   */
  shaping?: number;
  /** Floor of the ramp: how much colour is present even in dark areas. */
  bias?: number;
  /** Pushes values away from the middle so the colour bands stay graphic. */
  contrast?: number;
};

/** Stable default so the effect below doesn't restart on every render. */
const DEFAULT_ACCENTS = [1, 2, 3];

/**
 * The hero's live ordered-dither field.
 *
 * The canvas is rendered at ~1 dot per `cell` CSS pixels (a few thousand
 * pixels in total, not a few million) and blown back up with
 * `image-rendering: pixelated`, so a full frame is a cheap per-pixel table
 * lookup. It runs at 30fps, stops when scrolled out of view or the tab is
 * hidden, and draws a single static frame when the visitor prefers reduced
 * motion.
 */
export function DitherField({
  className = "",
  accents = DEFAULT_ACCENTS,
  cell = 7,
  maxCols = 180,
  speed = 1,
  shaping = 1.0,
  bias = 0.12,
  contrast = 1.8,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const accentsKey = accents.join(",");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduced = prefersReducedMotion();
    const styles = window.getComputedStyle(document.documentElement);
    const ramp: RGB[] = accentsKey.split(",").map(Number).map(
      (id, index) =>
        parseColor(styles.getPropertyValue(`--vivid-${id}`)) ?? {
          r: 205,
          g: 255,
          b: 74 + index * 40,
        }
    );
    // Darkest step of the ramp: the page background, so the field melts into
    // the section instead of sitting on top of it.
    const base: RGB =
      parseColor(styles.getPropertyValue("--background")) ?? {
        r: 8,
        g: 8,
        b: 13,
      };
    const palette: RGB[] = [base, ...ramp];

    let cols = 0;
    let rows = 0;
    let frameData: ImageData | null = null;
    let columns: Float32Array = new Float32Array(0);
    let lines: Float32Array = new Float32Array(0);
    let diagonals: Float32Array = new Float32Array(0);

    const allocate = (width: number, height: number) => {
      const grid = gridFor(width, height, cell, maxCols);
      cols = grid.cols;
      rows = grid.rows;
      canvas.width = cols;
      canvas.height = rows;
      ctx.imageSmoothingEnabled = false;
      frameData = ctx.createImageData(cols, rows);
      columns = new Float32Array(cols);
      lines = new Float32Array(rows);
      diagonals = new Float32Array(cols + rows);
    };

    const draw = (time: number) => {
      if (!frameData) return;
      const t = time * 0.001 * speed;
      const span = 1 - bias;

      for (let i = 0; i < cols; i++) columns[i] = Math.sin(i * 0.075 + t);
      for (let j = 0; j < rows; j++) {
        lines[j] = Math.sin(j * 0.055 - t * 1.2);
      }
      for (let i = 0; i < cols + rows; i++) {
        diagonals[i] = Math.sin((i - cols) * 0.042 + t * 0.55);
      }

      const data = frameData.data;
      let p = 0;
      for (let y = 0; y < rows; y++) {
        const row = lines[y];
        for (let x = 0; x < cols; x++) {
          const raw = (columns[x] + row + diagonals[x + y]) * (0.5 / 3) + 0.5;
          const pushed = Math.min(1, Math.max(0, (raw - 0.5) * contrast + 0.5));
          const value = bias + span * Math.pow(pushed, shaping);
          const c = ditherValue(value, bayerThreshold(x, y), palette);
          data[p] = c.r;
          data[p + 1] = c.g;
          data[p + 2] = c.b;
          data[p + 3] = 255;
          p += 4;
        }
      }

      ctx.putImageData(frameData, 0, 0);
    };

    const measure = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      allocate(rect.width, rect.height);
      draw(reduced ? 1200 : performance.now());
    };

    measure();

    if (reduced) {
      // Static dither: one frame, no loop, no observers.
      return () => undefined;
    }

    let visible = true;
    let running = false;
    let raf = 0;
    let last = 0;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - last < FRAME_MS - 1) return;
      last = now;
      draw(now);
    };

    const start = () => {
      if (running || !visible || document.hidden) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(tick);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const resize = new ResizeObserver(() => {
      measure();
    });
    resize.observe(canvas);

    return () => {
      stop();
      observer.disconnect();
      resize.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accentsKey, cell, maxCols, speed, shaping, bias, contrast, resolvedTheme]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      role="presentation"
      data-dither-field={accents.join("-")}
      className={`pixelated h-full w-full ${className}`}
    />
  );
}
