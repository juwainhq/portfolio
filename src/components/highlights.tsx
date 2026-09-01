"use client";

import { useState } from "react";
import Link from "next/link";
import { useReveal } from "@/hooks/use-reveal";
import { highlights } from "@/data/projects";

export function Highlights() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const labelRef = useReveal();
  const listRef = useReveal();

  if (highlights.length === 0) return null;

  return (
    <section className="py-24 md:py-32 lg:py-40 px-6 md:px-10 lg:px-16 bg-secondary/30">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-16 md:mb-24">
          <h2
            ref={labelRef}
            className="reveal text-xs uppercase tracking-ultra-wide font-medium"
          >
            Selected Highlights
          </h2>
        </div>

        {/* Highlights List - Editorial */}
        <div
          ref={listRef}
          className="reveal space-y-0 border-t border-border/50"
        >
          {highlights.map((project, index) => (
            <Link
              key={project.slug}
              href={`/work/${project.slug}`}
              className="group block"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="grid grid-cols-12 gap-4 py-6 md:py-8 border-b border-border/50 transition-all duration-500">
                {/* Number */}
                <div className="col-span-2 md:col-span-1">
                  <span className="text-xs uppercase tracking-ultra-wide text-muted-foreground group-hover:text-foreground transition-colors duration-300">
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
                  <p className="text-xs uppercase tracking-ultra-wide text-muted-foreground">
                    {project.category}
                  </p>
                </div>

                {/* Year */}
                <div className="col-span-4 md:col-span-2 hidden md:block">
                  <p className="text-xs uppercase tracking-ultra-wide text-muted-foreground text-right">
                    {project.year}
                  </p>
                </div>

                {/* Arrow */}
                <div className="col-span-12 md:col-span-1 flex justify-end">
                  <span
                    className="text-sm opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300"
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
