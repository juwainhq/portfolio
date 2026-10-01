"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Slim hairline at the very top of the viewport during internal navigations.
 *
 * - Starts when the visitor clicks an internal link (covers slow/dev compile).
 * - Also starts on pathname change (covers back/forward).
 * - Completes + fades out once the new path has committed.
 *
 * Static pages resolve in milliseconds, so this mostly reads as a subtle
 * "something is happening" flourish rather than a full loading screen.
 */
export function RouteProgress() {
  const pathname = usePathname();
  const [state, setState] = useState<"idle" | "running" | "done">("idle");
  const firstPath = useRef<string | null>(null);
  const finishTimer = useRef<number | null>(null);
  const idleTimer = useRef<number | null>(null);

  const clearTimers = () => {
    if (finishTimer.current) window.clearTimeout(finishTimer.current);
    if (idleTimer.current) window.clearTimeout(idleTimer.current);
    finishTimer.current = null;
    idleTimer.current = null;
  };

  // Internal-link clicks kick the bar off immediately.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;
      const anchor = (e.target as HTMLElement | null)?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("/") || anchor.target === "_blank") return;
      if (href === pathname) return; // same-page anchor, nothing loading
      clearTimers();
      setState("running");
      // Fallback: complete even if pathname never changes (e.g. /path#hash).
      finishTimer.current = window.setTimeout(() => setState("done"), 1100);
      idleTimer.current = window.setTimeout(() => setState("idle"), 1500);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Path committed → complete the bar. Skip the very first render.
  useEffect(() => {
    if (firstPath.current === null) {
      firstPath.current = pathname;
      return;
    }
    if (firstPath.current === pathname) return;
    firstPath.current = pathname;

    clearTimers();
    setState((s) => (s === "running" ? s : "running"));
    finishTimer.current = window.setTimeout(() => setState("done"), 650);
    idleTimer.current = window.setTimeout(() => setState("idle"), 1050);
  }, [pathname]);

  useEffect(() => clearTimers, []);

  if (state === "idle") return null;

  return (
    <div
      key={state === "running" ? "run" : "done"}
      className={`route-progress ${state === "done" ? "is-done" : ""}`}
      aria-hidden
    />
  );
}
