"use client";

import { useEffect } from "react";

export function ScrollRevealProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Check if we are in a browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const handleScroll = () => {
      // Check if document exists (though we already checked window, document should be available if window is)
      if (typeof document === 'undefined') return;

      const reveals = document.querySelectorAll(".reveal, .stagger-children");
      reveals.forEach((reveal) => {
        if (!(reveal instanceof HTMLElement)) return;
        const rect = reveal.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const revealTop = rect.top;
        const revealPoint = 100;

        if (revealTop < windowHeight - revealPoint) {
          reveal.classList.add("active");
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return <>{children}</>;
}