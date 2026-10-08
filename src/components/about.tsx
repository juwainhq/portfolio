"use client";

import { useSiteConfig } from "@/context/site-config";
import { useReveal } from "@/hooks/use-reveal";

export function About() {
  const { config } = useSiteConfig();
  const labelRef = useReveal();
  const contentRef = useReveal();

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="px-5 py-24 sm:px-6 md:px-10 md:py-32 lg:px-16 lg:py-40"
    >
      <div className="mx-auto max-w-[1400px]">
        <div ref={labelRef} className="reveal rule flex items-baseline justify-between gap-6 pt-5">
          <span className="eyebrow flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 bg-[hsl(var(--vivid-4))]"
            />
            About
          </span>
          <span className="eyebrow hidden text-muted-foreground sm:block">
            Est. 2019
          </span>
        </div>

        <div
          ref={contentRef}
          className="reveal mt-10 grid grid-cols-1 gap-8 md:mt-14 lg:grid-cols-12 lg:gap-16"
        >
          <h2
            id="about-heading"
            className="display text-[clamp(1.55rem,3.9vw,2.85rem)] leading-[1.08] lg:col-span-8"
          >
            {config.aboutHeading}
          </h2>

          <div className="flex flex-col gap-8 lg:col-span-4 lg:pt-1">
            <p className="max-w-[46ch] text-base leading-relaxed text-muted-foreground">
              {config.aboutBody}
            </p>

            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 bg-[hsl(var(--vivid-1))]"
              />
              <span className="eyebrow text-muted-foreground">
                {config.aboutStatusText}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
