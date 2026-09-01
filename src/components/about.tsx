"use client";

import { useReveal } from "@/hooks/use-reveal";
import { useSiteConfig } from "@/context/site-config";

export function About() {
  const { config } = useSiteConfig();
  const sectionRef = useReveal();
  const contentRef = useReveal();

  return (
    <section
      id="about"
      className="py-28 md:py-40 lg:py-48 px-6 md:px-10 lg:px-16"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Label column */}
          <div ref={sectionRef} className="reveal lg:col-span-2">
            <span className="text-[10px] uppercase tracking-[0.3em] font-medium">
              About
            </span>
          </div>

          {/* Content */}
          <div
            ref={contentRef}
            className="reveal lg:col-span-8 lg:col-start-4"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-[3.25rem] font-display leading-[1.15] tracking-tight mb-8 md:mb-10">
              {config.aboutHeading}
            </h2>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-[640px]">
              {config.aboutBody}
            </p>

            {/* Availability indicator */}
            <div className="flex items-center gap-3 mt-12 md:mt-14">
              <span className="w-1 h-1 rounded-full bg-emerald-500" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                {config.aboutStatusText}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
