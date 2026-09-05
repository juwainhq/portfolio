"use client";

import { useEffect } from "react";

export function ScrollRevealProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Check if window and document are available
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    const handleScroll = () => {
      const reveals = document.querySelectorAll(".reveal, .stagger-children");
      reveals.forEach((reveal) => {
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