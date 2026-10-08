"use client";

import { useEffect, useRef } from "react";

/**
 * Adds `.active` to an element once it scrolls into view.
 *
 * `ScrollRevealProvider` already watches the whole document for `.reveal`
 * elements; this hook exists for elements that want their own observer (e.g.
 * large below-the-fold blocks) and is generic so it can be attached to any
 * element type.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

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

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return ref;
}
