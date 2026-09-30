"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Ambient cursor: a small dot pinned to the pointer plus a ring that
 * trails behind it and expands over links/buttons. Uses mix-blend-difference
 * so it reads on both dark and light palettes.
 *
 * Progressive enhancement only:
 *  - fine pointer devices (skips touch),
 *  - no prefers-reduced-motion,
 *  - hidden on /admin where the editor needs a precise cursor,
 *  - the native cursor stays visible (usability over aesthetics).
 */
export function CursorEffects() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Should we run at all? (checked once per route in case the visitor
  // resizes from touch to desktop, etc. — cheap matchMedia queries)
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onAdmin = (pathname ?? "").startsWith("/admin");
    setEnabled(fine.matches && !reduced.matches && !onAdmin);
  }, [pathname]);

  useEffect(() => {
    if (!enabled) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let raf = 0;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let visible = false;

    const show = () => {
      if (visible) return;
      visible = true;
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      show();

      const target = e.target as HTMLElement | null;
      const interactive = Boolean(
        target?.closest("a, button, [role='button'], input, textarea, select, summary")
      );
      ring.classList.toggle("is-hover", interactive);
      dot.classList.toggle("is-hover", interactive);
    };

    const onDown = () => ring.classList.add("is-down");
    const onUp = () => ring.classList.remove("is-down");
    const onLeave = () => {
      visible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    // Smooth trailing via requestAnimationFrame lerp.
    const tick = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-fx cursor-fx-dot" style={{ opacity: 0 }} aria-hidden />
      <div ref={ringRef} className="cursor-fx cursor-fx-ring" style={{ opacity: 0 }} aria-hidden />
    </>
  );
}
