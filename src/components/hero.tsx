"use client";

import { useEffect, useRef } from "react";
import { useSiteConfig } from "@/context/site-config";

export function Hero() {
  const { config } = useSiteConfig();
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

  const heroButtonHref =
    config.heroButtonTarget?.href ??
    (config.heroButtonTarget?.kind === "external"
      ? config.heroButtonTarget.href
      : config.heroButtonTarget?.href ?? "#work");

  const scrollToHeroButton = () => {
    if (config.heroButtonTarget?.kind === "external" || config.heroButtonTarget?.kind === "email") {
      window.open(heroButtonHref, config.heroButtonTarget?.kind === "email" ? "_self" : "_blank");
    } else {
      const target = document.querySelector(heroButtonHref);
      target?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const nameParts = config.name.split(" ");

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
            {config.heroStatusText}
          </span>
        </div>

        <div
          className="animate-in hidden md:flex flex-col items-end gap-1"
          style={{ opacity: 0, transitionDelay: "150ms" }}
        >
          <span className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            {config.heroTopRight[0]}
          </span>
          <span className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            {config.heroTopRight[1]}
          </span>
        </div>
      </div>

      {/* Center — the name */}
      <div className="relative z-10 flex-1 flex flex-col justify-center my-8 md:my-0">
        {nameParts.map((part, i) => (
          <div key={i} className="overflow-hidden">
            <h1
              className="animate-in font-display text-[22vw] sm:text-[20vw] md:text-[16vw] lg:text-[14vw] xl:text-[12.5vw] leading-[0.82] tracking-[-0.055em] uppercase font-medium"
              style={{ opacity: 0, transitionDelay: i === 0 ? "0ms" : "120ms" }}
            >
              {part}
            </h1>
          </div>
        ))}

        {/* Subtitle row directly under the name */}
        <div
          className="animate-in mt-8 md:mt-10 flex items-center gap-4 md:gap-6"
          style={{ opacity: 0, transitionDelay: "320ms" }}
        >
          <span className="h-px w-8 md:w-12 bg-foreground/60" aria-hidden="true" />
          <p className="text-[11px] md:text-[12px] uppercase tracking-[0.3em] font-medium">
            {config.tagline}
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
            {config.heroBottomLeft[0]}
          </span>
          <span className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-muted-foreground hidden md:block">
            {config.heroBottomLeft[1]}
          </span>
        </div>

        <button
          onClick={scrollToHeroButton}
          className="animate-in group flex items-center gap-3 hover:opacity-60 transition-opacity duration-300"
          style={{ opacity: 0, transitionDelay: "550ms" }}
          aria-label={config.heroButtonText}
        >
          <span className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] font-medium">
            {config.heroButtonText}
          </span>
          <span className="block w-8 md:w-12 h-px bg-foreground/60 group-hover:w-16 transition-all duration-500" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
