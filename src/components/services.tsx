"use client";

import { useSiteConfig } from "@/context/site-config";
import { useReveal } from "@/hooks/use-reveal";

const ACCENTS = [1, 2, 3, 4, 5];

/**
 * Services.
 *
 * An editorial index: each discipline is a hairline row with its ordinal on
 * the left and the title + summary stacked on the right, so the entries fill
 * the measure instead of leaving a lonely right column.
 */
export function Services() {
  const { config } = useSiteConfig();
  const labelRef = useReveal();
  const listRef = useReveal<HTMLDivElement>();

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="px-5 py-[var(--section-y)] sm:px-6 md:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="rule mb-8 flex items-baseline justify-between gap-6 pt-5 md:mb-12">
          <h2 id="services-heading" ref={labelRef} className="reveal eyebrow">
            {config.servicesHeading}
          </h2>
          <span className="eyebrow text-muted-foreground">
            {String(config.services.length).padStart(2, "0")} disciplines
          </span>
        </div>

        <div ref={listRef} className="reveal">
          {config.services.map((service, index) => {
            const accent = ACCENTS[index % ACCENTS.length];
            return (
              <div
                key={`${service.number}-${service.title}`}
                className="group row-rule grid grid-cols-12 gap-x-4 py-7 hover:bg-card/60 md:gap-x-6 md:py-9"
              >
                <span className="meta col-span-2 flex items-start gap-2.5 pt-1 tabular-nums md:col-span-1 md:pt-1.5">
                  <span
                    aria-hidden="true"
                    className="mt-1 h-1.5 w-1.5 shrink-0 transition-transform duration-500 ease-out-expo group-hover:scale-[1.9]"
                    style={{ background: `hsl(var(--vivid-${accent}))` }}
                  />
                  {service.number}
                </span>

                <div className="col-span-10 md:col-span-11">
                  <h3 className="display text-[clamp(1.5rem,3.2vw,2.4rem)] leading-[1.02] transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5">
                    {service.title}
                  </h3>
                  <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-foreground/85 md:mt-4 md:text-base">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
          <div className="[border-bottom:var(--hairline)_solid_hsl(var(--border))]" />
        </div>
      </div>
    </section>
  );
}
