"use client";

import { useState } from "react";
import { useReveal } from "@/hooks/use-reveal";

const services = [
  {
    number: "01",
    title: "Graphic Design",
    description:
      "Brand identity, visual systems, marketing materials and creative direction.",
  },
  {
    number: "02",
    title: "Brand Strategy",
    description:
      "Positioning, messaging, visual direction and brand development.",
  },
  {
    number: "03",
    title: "Business Consulting",
    description:
      "Business strategy, customer experience, growth ideas and practical solutions.",
  },
  {
    number: "04",
    title: "Creative Direction",
    description:
      "Building cohesive visual concepts and creative campaigns.",
  },
];

export function Services() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const labelRef = useReveal();
  const listRef = useReveal();

  return (
    <section
      id="services"
      className="py-24 md:py-32 lg:py-40 px-6 md:px-10 lg:px-16 bg-secondary/30"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-16 md:mb-24">
          <h2
            ref={labelRef}
            className="reveal text-xs uppercase tracking-ultra-wide font-medium"
          >
            Services
          </h2>
        </div>

        {/* Service List */}
        <div
          ref={listRef}
          className="reveal"
        >
          {services.map((service, index) => (
            <div
              key={service.number}
              className={`group border-t border-border/50 transition-all duration-500 ${
                hoveredIndex === index ? "bg-foreground/5" : ""
              }`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="grid grid-cols-12 gap-4 py-8 md:py-10 lg:py-12 items-baseline">
                {/* Number */}
                <div className="col-span-2 md:col-span-1">
                  <span className="text-xs uppercase tracking-ultra-wide text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    {service.number}
                  </span>
                </div>

                {/* Title */}
                <div className="col-span-7 md:col-span-4">
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-display tracking-tight group-hover:translate-x-2 transition-transform duration-500">
                    {service.title}
                  </h3>
                </div>

                {/* Description */}
                <div className="col-span-10 md:col-span-6 md:col-start-6 lg:col-span-5 lg:col-start-6">
                  <p className="text-sm md:text-base text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                    {service.description}
                  </p>
                </div>

                {/* Arrow */}
                <div className="col-span-2 md:col-span-1 flex justify-end">
                  <span
                    className="text-lg opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300"
                  >
                    →
                  </span>
                </div>
              </div>
            </div>
          ))}
          <div className="border-b border-border/50" />
        </div>
      </div>
    </section>
  );
}
