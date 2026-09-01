"use client";

import { useState } from "react";
import Link from "next/link";
import { useReveal } from "@/hooks/use-reveal";
import { useSiteConfig } from "@/context/site-config";

export function Highlights() {
  const { config } = useSiteConfig();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const labelRef = useReveal();
  const listRef = useReveal();

  const highlights = config.projects.filter((p) => p.highlight && !p.hidden);
  if (highlights.length === 0) return null;

  return (
    <section className="py-28 md:py-40 lg:py-48 px-6 md:px-10 lg:px-16">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-16 md:mb-20 lg:mb-24">
          <h2
            ref={labelRef}
            className="reveal text-[10px] uppercase tracking-[0.3em] font-medium"
          >
            {config.highlightsHeading}
          </h2>
        </div>

        {/* Highlights List */}
        <div
          ref={listRef}
          className="reveal border-t border-foreground/10"
        >
          {highlights.map((project, index) => (
            <Link
              key={project.slug}
              href={project.href ?? `/work/${project.slug}`}
              className="group block"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="grid grid-cols-12 gap-4 py-5 md:py-6 border-b border-foreground/10 transition-all duration-300">
                {/* Number */}
                <div className="col-span-2 md:col-span-1">
                  <span className="text-[10px] tracking-[0.2em] text-muted-foreground group-hover:text-foreground/50 transition-colors duration-300">
                    {project.number}
                  </span>
                </div>

                {/* Title */}
                <div className="col-span-10 md:col-span-5">
                  <h3 className="text-lg md:text-xl lg:text-2xl font-display tracking-tight group-hover:translate-x-2 transition-transform duration-500">
                    {project.title}
                  </h3>
                </div>

                {/* Category */}
                <div className="col-span-8 md:col-span-3 hidden md:block">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    {project.category}
                  </p>
                </div>

                {/* Year */}
                <div className="col-span-4 md:col-span-2 hidden md:block">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground text-right">
                    {project.year || ""}
                  </p>
                </div>

                {/* Arrow */}
                <div className="col-span-12 md:col-span-1 flex justify-end">
                  <span
                    className="text-xs opacity-0 group-hover:opacity-100 translate-x-[-8px] group-hover:translate-x-0 transition-all duration-300"
                  >
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
