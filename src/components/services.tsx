"use client";

import { useState } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { useSiteConfig } from "@/context/site-config";

export function Services() {
  const { config } = useSiteConfig();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const labelRef = useReveal();
  const listRef = useReveal();

  return (
    <section id="services" className="py-28 md:py-40 lg:py-48 px-6 md:px-10 lg:px-16">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-16 md:mb-20 lg:mb-24">
          <span
            ref={labelRef}
            className="reveal text-[10px] uppercase tracking-[0.3em] font-medium"
          >
            {config.servicesHeading}
          </span>
        </div>

        {/* Service List */}
        <div ref={listRef} className="reveal">
          {config.services.map((service, index) => (
            <div
              key={service.number}
              className={`group border-t border-foreground/10 py-8 md:py-10 transition-all duration-300 ${
                hoveredIndex === index ? "border-foreground/20" : ""
              }`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="grid grid-cols-12 gap-4 items-baseline">
                {/* Number */}
                <div className="col-span-3 md:col-span-1">
                  <span className="text-[10px] md:text-[11px] tracking-[0.2em] text-muted-foreground font-medium group-hover:text-foreground/50 transition-colors duration-300">
                    {service.number}
                  </span>
                </div>

                {/* Title */}
                <div className="col-span-5 md:col-span-4">
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-display tracking-tight group-hover:translate-x-1 transition-transform duration-500">
                    {service.title}
                  </h3>
                </div>

                {/* Description */}
                <div className="col-span-4 md:col-span-5 md:col-start-7">
                  <p className="text-sm md:text-base text-muted-foreground group-hover:text-foreground/60 transition-colors duration-300">
                    {service.description}
                  </p>
                </div>

                {/* Subtle indicator */}
                <div className="col-span-12 md:col-span-2 md:col-start-11 flex justify-end">
                  <span
                    className="text-[10px] md:text-[11px] tracking-[0.15em] uppercase text-muted-foreground/0 group-hover:text-foreground/40 transition-all duration-300 translate-x-[-4px] group-hover:translate-x-0 opacity-0 group-hover:opacity-100"
                  >
                    View
                  </span>
                </div>
              </div>
            </div>
          ))}
          <div className="border-b border-foreground/10" />
        </div>
      </div>
    </section>
  );
}
