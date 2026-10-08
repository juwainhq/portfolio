"use client";

import { ArrowUpRight } from "lucide-react";
import { useSiteConfig } from "@/context/site-config";
import { useReveal } from "@/hooks/use-reveal";

const ACCENTS = [1, 2, 3, 4, 5];

export function Services() {
  const { config } = useSiteConfig();
  const labelRef = useReveal();
  const listRef = useReveal<HTMLDivElement>();

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="px-5 py-24 sm:px-6 md:px-10 md:py-32 lg:px-16 lg:py-40"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="rule mb-10 flex items-baseline justify-between gap-6 pt-5 md:mb-14">
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
                className="group grid grid-cols-12 items-baseline gap-x-4 gap-y-3 py-7 transition-colors duration-500 [border-top:var(--hairline)_solid_hsl(var(--border))] hover:[border-top-color:hsl(var(--foreground)/0.4)] md:py-9"
              >
                <span className="col-span-3 flex items-center gap-2.5 text-[11px] font-medium tabular-nums tracking-[0.2em] text-muted-foreground md:col-span-1">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 transition-transform duration-500 ease-out-expo group-hover:scale-[1.8]"
                    style={{ background: `hsl(var(--vivid-${accent}))` }}
                  />
                  {service.number}
                </span>

                <h3 className="col-span-9 text-[clamp(1.35rem,3vw,2.15rem)] leading-tight md:col-span-4 font-display uppercase tracking-[-0.03em] transition-transform duration-500 group-hover:translate-x-1.5">
                  {service.title}
                </h3>

                <p className="col-span-12 max-w-[46ch] text-sm leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-foreground md:col-span-5 md:col-start-7 md:text-base">
                  {service.description}
                </p>

                <span className="col-span-12 flex justify-start md:col-span-1 md:col-start-12 md:justify-end">
                  <ArrowUpRight
                    size={18}
                    aria-hidden="true"
                    className="text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                  />
                </span>
              </div>
            );
          })}
          <div className="[border-bottom:var(--hairline)_solid_hsl(var(--border))]" />
        </div>
      </div>
    </section>
  );
}
