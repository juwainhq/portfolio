"use client";

import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/dither";

/**
 * Reveal-on-scroll.
 *
 * Progressive enhancement: the `reveal-ready` class (which is what actually
 * hides `.reveal` elements) is only added from JS, so a no-JS visitor — or a
 * reduced-motion visitor — always sees the full page.
 */
export function ScrollRevealProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const root = document.documentElement;
    root.classList.add("reveal-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -8% 0px" }
    );

    let frame = 0;
    const scan = () => {
      document
        .querySelectorAll(".reveal:not(.active), .animate-in:not(.active)")
        .forEach((el) => observer.observe(el));
    };
    const scheduleScan = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(scan);
    };

    scan();

    // Sections/links can appear after hydration (config loads from Supabase),
    // so keep watching for new nodes rather than scanning once.
    const mutations = new MutationObserver(scheduleScan);
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frame);
      mutations.disconnect();
      observer.disconnect();
      root.classList.remove("reveal-ready");
    };
  }, []);

  return <>{children}</>;
}
