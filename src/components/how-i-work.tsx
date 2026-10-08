"use client";

import { useSiteConfig } from "@/context/site-config";
import { useReveal } from "@/hooks/use-reveal";

/**
 * How I Work.
 *
 * Three equal plates: ordinal and accent dot on the top rule, the step title
 * big, the note pinned to the bottom so all three cards line up.
 */
export function HowIWork() {
  const { config } = useSiteConfig();
  const headingRef = useReveal();
  const listRef = useReveal();

  return (
    <section
      id="how-i-work"
      aria-labelledby="how-i-work-heading"
      className="px-5 py-[var(--section-y)] sm:px-6 md:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="rule mb-8 flex items-baseline justify-between gap-6 pt-5 md:mb-12">
          <h2
            id="how-i-work-heading"
            ref={headingRef}
            className="reveal eyebrow"
          >
            {config.howIWorkHeading}
          </h2>
          <span className="eyebrow hidden text-muted-foreground sm:block">
            Three steps
          </span>
        </div>

        <div
          ref={listRef}
          className="reveal grid grid-cols-1 items-stretch gap-6 md:grid-cols-3 md:gap-8 lg:gap-10"
        >
          {config.howIWorkSteps.map((step) => (
            <div
              key={`${step.number}-${step.title}`}
              className="group flex h-full flex-col p-6 transition-colors duration-500 hover:bg-card md:p-7 lg:p-8 [border:var(--hairline)_solid_hsl(var(--border))]"
            >
              <div className="flex items-center justify-between">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 bg-[hsl(var(--vivid-5))] transition-transform duration-500 ease-out-expo group-hover:scale-[1.9]"
                />
                <span className="meta tabular-nums">{step.number}</span>
              </div>

              <h3 className="display mt-8 text-[clamp(1.5rem,3.2vw,2.35rem)] leading-[1.02]">
                {step.title}
              </h3>

              <p className="mt-4 max-w-[34ch] text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
