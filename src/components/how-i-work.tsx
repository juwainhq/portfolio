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
        <div className="mb-12 md:mb-16">
          <h2
            id="how-i-work-heading"
            ref={headingRef}
            className="reveal eyebrow"
          >
            {config.howIWorkHeading}
          </h2>
        </div>

        <div
          ref={listRef}
          className="reveal grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8 lg:gap-14"
        >
          {config.howIWorkSteps.map((step, index) => (
            <div
              key={`${step.number}-${step.title}`}
              className="flex flex-col gap-5 border-t-2 border-border pt-6"
            >
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 bg-[hsl(var(--vivid-5))]"
              />

              <span className="text-[11px] font-medium tracking-[0.25em] text-muted-foreground">
                {step.number}
              </span>

              <h3 className="display text-[clamp(1.7rem,4vw,2.75rem)]">
                {step.title}
              </h3>

              <p className="max-w-[38ch] text-sm leading-relaxed text-muted-foreground md:text-base">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
