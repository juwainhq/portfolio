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
        <div className="mb-12 md:mb-16">
          <h2 id="services-heading" ref={labelRef} className="reveal eyebrow">
            {config.servicesHeading}
          </h2>
        </div>

        <div ref={listRef} className="reveal">
          {config.services.map((service, index) => {
            const accent = ACCENTS[index % ACCENTS.length];
            return (
              <div
                key={`${service.number}-${service.title}`}
                className="group grid grid-cols-12 items-baseline gap-x-4 gap-y-3 border-t-2 border-border py-7 transition-colors duration-300 hover:border-[hsl(var(--accent-2))] md:py-9"
              >
                <span className="col-span-3 flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] text-muted-foreground md:col-span-1">
                  <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 transition-transform duration-300 group-hover:scale-150"
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
          <div className="border-b-2 border-border" />
        </div>
      </div>
    </section>
  );
}
