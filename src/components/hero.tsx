"use client";

import { useEffect, useRef } from "react";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elements = containerRef.current?.querySelectorAll(".animate-in");
    if (!elements) return;

    elements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add("active");
      }, 200 + index * 180);
    });
  }, []);

  const scrollToWork = () => {
    const workSection = document.getElementById("work");
    if (workSection) {
      workSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] flex flex-col justify-between px-6 md:px-10 lg:px-16 pt-28 md:pt-32 pb-8 md:pb-10 overflow-hidden"
    >
      {/* Top meta row */}
      <div className="relative z-10 flex items-start justify-between gap-6">
        <div
          className="animate-in flex items-center gap-3"
          style={{ opacity: 0, transitionDelay: "100ms" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] font-medium">
            Available for Projects
          </span>
        </div>

        <div
          className="animate-in hidden md:flex flex-col items-end gap-1"
          style={{ opacity: 0, transitionDelay: "150ms" }}
        >
          <span className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            Independent Practice
          </span>
          <span className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            Est. 2019
          </span>
        </div>
      </div>

      {/* Center — the name */}
      <div className="relative z-10 flex-1 flex flex-col justify-center my-8 md:my-0">
        <div className="overflow-hidden">
          <h1
            className="animate-in font-display text-[22vw] sm:text-[20vw] md:text-[16vw] lg:text-[14vw] xl:text-[12.5vw] leading-[0.82] tracking-[-0.055em] uppercase font-medium"
            style={{ opacity: 0 }}
          >
            Juwain
          </h1>
        </div>
        <div className="overflow-hidden">
          <h1
            className="animate-in font-display text-[22vw] sm:text-[20vw] md:text-[16vw] lg:text-[14vw] xl:text-[12.5vw] leading-[0.82] tracking-[-0.055em] uppercase font-medium"
            style={{ opacity: 0, transitionDelay: "120ms" }}
          >
            Haque
          </h1>
        </div>

        {/* Subtitle row directly under the name */}
        <div
          className="animate-in mt-8 md:mt-10 flex items-center gap-4 md:gap-6"
          style={{ opacity: 0, transitionDelay: "320ms" }}
        >
          <span className="h-px w-8 md:w-12 bg-foreground/60" aria-hidden="true" />
          <p className="text-[11px] md:text-[12px] uppercase tracking-[0.3em] font-medium">
            Graphic Designer <span className="text-muted-foreground mx-1">/</span> Business Consultant
          </p>
        </div>
      </div>

      {/* Bottom row — meta + scroll cue */}
      <div className="relative z-10 flex items-end justify-between gap-6">
        <div
          className="animate-in flex flex-col gap-1"
          style={{ opacity: 0, transitionDelay: "500ms" }}
        >
          <span className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            Selected Work 2019 — 2025
          </span>
          <span className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-muted-foreground hidden md:block">
            Based in Dhaka · Working Worldwide
          </span>
        </div>

        <button
          onClick={scrollToWork}
          className="animate-in group flex items-center gap-3 hover:opacity-60 transition-opacity duration-300"
          style={{ opacity: 0, transitionDelay: "550ms" }}
          aria-label="Scroll to selected work"
        >
          <span className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] font-medium">
            View Work
          </span>
          <span className="block w-8 md:w-12 h-px bg-foreground/60 group-hover:w-16 transition-all duration-500" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
