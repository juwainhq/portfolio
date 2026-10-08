"use client";

import { useSiteConfig } from "@/context/site-config";
import { useReveal } from "@/hooks/use-reveal";

/**
 * About.
 *
 * Typographic band: the statement runs wide on the left, the supporting copy
 * and availability note sit in a narrow right column closed by a hairline.
 */
export function About() {
  const { config } = useSiteConfig();
  const labelRef = useReveal();
  const contentRef = useReveal();

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="px-5 py-[var(--section-y)] sm:px-6 md:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-[1400px]">
        <div
          ref={labelRef}
          className="reveal rule flex items-baseline justify-between gap-6 pt-5"
        >
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
          className="reveal mt-10 grid grid-cols-1 gap-10 md:mt-14 lg:grid-cols-12 lg:gap-16"
        >
          <h2
            id="about-heading"
            className="display text-[clamp(1.7rem,4.1vw,3.2rem)] leading-[1.06] lg:col-span-7"
          >
            {config.aboutHeading}
          </h2>

          <div className="flex flex-col gap-7 lg:col-span-4 lg:col-start-9 lg:pt-1.5">
            <p className="max-w-[44ch] text-base leading-relaxed text-muted-foreground">
              {config.aboutBody}
            </p>

            <div className="row-rule flex items-center gap-3 pt-5">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 bg-[hsl(var(--vivid-1))]"
              />
              <span className="meta">{config.aboutStatusText}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
