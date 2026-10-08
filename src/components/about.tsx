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
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <div ref={labelRef} className="reveal lg:col-span-2">
            <span className="eyebrow flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 bg-[hsl(var(--vivid-4))]"
              />
              About
            </span>
          </div>

          <div ref={contentRef} className="reveal lg:col-span-9 lg:col-start-4">
            <h2
              id="about-heading"
              className="display mb-8 text-[clamp(1.6rem,4.4vw,3.1rem)] leading-[1.06] md:mb-10"
            >
              {config.aboutHeading}
            </h2>

            <p className="max-w-[62ch] text-base leading-relaxed text-muted-foreground md:text-lg">
              {config.aboutBody}
            </p>

            <div className="mt-12 flex items-center gap-3 md:mt-14">
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 bg-[hsl(var(--vivid-1))]"
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
