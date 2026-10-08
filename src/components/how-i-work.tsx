"use client";

import { useSiteConfig } from "@/context/site-config";
import { useReveal } from "@/hooks/use-reveal";

export function HowIWork() {
  const { config } = useSiteConfig();
  const headingRef = useReveal();
  const listRef = useReveal();

  return (
    <section
      id="how-i-work"
      aria-labelledby="how-i-work-heading"
      className="px-5 py-24 sm:px-6 md:px-10 md:py-32 lg:px-16 lg:py-40"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="rule mb-10 flex items-baseline justify-between gap-6 pt-5 md:mb-14">
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
          className="reveal grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8 lg:gap-14"
        >
          {config.howIWorkSteps.map((step, index) => (
            <div
              key={`${step.number}-${step.title}`}
              className="group flex flex-col gap-5 p-6 transition-colors duration-500 hover:bg-card md:p-7 [border:var(--hairline)_solid_hsl(var(--border))]"
            >
              <div className="flex items-center justify-between">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 bg-[hsl(var(--vivid-5))]"
                />
                <span className="text-[11px] font-medium tabular-nums tracking-[0.25em] text-muted-foreground">
                  {step.number}
                </span>
              </div>

              <h3 className="display mt-2 text-[clamp(1.6rem,3.6vw,2.5rem)]">
                {step.title}
              </h3>

              <p className="max-w-[34ch] text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
