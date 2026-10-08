"use client";

import { useEffect, useRef, useState } from "react";
import {
  bayerThreshold,
  parseColor,
  prefersReducedMotion,
  type RGB,
} from "@/lib/dither";

const CELL = 11; // one trail dot every 11 CSS pixels
const DECAY = 0.055; // per-frame life loss (~0.35s tail at 60fps)
const MAX_POINTS = 26;

type Point = { x: number; y: number; life: number; size: number };

/**
 * Desktop-only dithered pointer trail.
 *
 * A coarse grid of coloured dots is sprayed behind the pointer, stamped with
 * an ordered dither so it decays into a blocky halftone. Fine pointers only,
 * never on touch, and completely absent under `prefers-reduced-motion`.
 */
export function DitherCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    setEnabled(fine && !prefersReducedMotion());
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let points: Point[] = [];
    let cols = 0;
    let rows = 0;
    let frame: ImageData | null = null;
    let accumulator: Float32Array = new Float32Array(0);
    let raf = 0;
    let running = false;
    let last = { x: 0, y: 0, t: 0 };

    const colors: RGB[] = [
      parseColor(
        window.getComputedStyle(document.documentElement).getPropertyValue("--vivid-2")
      ) ?? { r: 79, g: 216, b: 255 },
      parseColor(
        window.getComputedStyle(document.documentElement).getPropertyValue("--vivid-3")
      ) ?? { r: 255, g: 92, b: 168 },
    ];

    const resize = () => {
      cols = Math.max(8, Math.ceil(window.innerWidth / CELL));
      rows = Math.max(8, Math.ceil(window.innerHeight / CELL));
      canvas.width = cols;
      canvas.height = rows;
      ctx.imageSmoothingEnabled = false;
      frame = ctx.createImageData(cols, rows);
      accumulator = new Float32Array(cols * rows);
    };
    resize();

    const draw = () => {
      if (!frame) return;
      accumulator.fill(0);

      for (const point of points) {
        const radius = point.size;
        const x0 = Math.max(0, Math.floor(point.x - radius));
        const x1 = Math.min(cols - 1, Math.ceil(point.x + radius));
        const y0 = Math.max(0, Math.floor(point.y - radius));
        const y1 = Math.min(rows - 1, Math.ceil(point.y + radius));
        for (let y = y0; y <= y1; y++) {
          for (let x = x0; x <= x1; x++) {
            const dx = x - point.x;
            const dy = y - point.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance > radius) continue;
            const falloff = 1 - distance / (radius + 0.001);
            const index = y * cols + x;
            const value = point.life * falloff;
            if (value > accumulator[index]) accumulator[index] = value;
          }
        }
      }

      const data = frame.data;
      let p = 0;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const value = Math.min(1, accumulator[y * cols + x] * 1.25);
          // Ramp: transparent -> cyan -> magenta, so the trail really is a
          // halftone of dots rather than a solid shape.
          const scaled = value * (colors.length + 1 - 1);
          const index = Math.floor(scaled);
          const fraction = scaled - index;
          const chosen =
            fraction > bayerThreshold(x, y) ? index + 1 : index;

          if (chosen <= 0 || value <= 0.05) {
            data[p] = 0;
            data[p + 1] = 0;
            data[p + 2] = 0;
            data[p + 3] = 0;
          } else {
            const c = colors[Math.min(chosen - 1, colors.length - 1)];
            data[p] = c.r;
            data[p + 1] = c.g;
            data[p + 2] = c.b;
            data[p + 3] = 255;
          }
          p += 4;
        }
      }

      ctx.putImageData(frame, 0, 0);
    };

    const tick = () => {
      let alive = false;
      for (const point of points) {
        point.life -= DECAY;
        if (point.life > 0.02) alive = true;
      }
      points = points.filter((point) => point.life > 0.02).slice(-MAX_POINTS);
      draw();
      if (alive && points.length) {
        raf = requestAnimationFrame(tick);
      } else {
        running = false;
        ctx.clearRect(0, 0, cols, rows);
      }
    };

    const onMove = (event: PointerEvent) => {
      const gx = event.clientX / CELL;
      const gy = event.clientY / CELL;
      const now = performance.now();
      const dt = Math.max(8, now - last.t);
      const speed = Math.hypot(gx - last.x, gy - last.y) / dt;
      last = { x: gx, y: gy, t: now };

      points.push({
        x: gx,
        y: gy,
        life: 1,
        size: 2.1 + Math.min(4.4, speed * 42),
      });
      if (points.length > MAX_POINTS) points = points.slice(-MAX_POINTS);

      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const onLeave = () => {
      points = [];
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      running = false;
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", resize);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      role="presentation"
      className="pixelated pointer-events-none fixed inset-0 z-[60] h-full w-full"
      data-dither-cursor=""
    />
  );
}
