"use client";

import { useState } from "react";
import Link from "next/link";
import { useReveal } from "@/hooks/use-reveal";
import { projects } from "@/data/projects";

export function PortfolioGrid() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const labelRef = useReveal();

  return (
    <section
      id="work"
      className="py-24 md:py-32 lg:py-40 px-6 md:px-10 lg:px-16"
    >
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-16 md:mb-24 flex items-end justify-between">
          <h2
            ref={labelRef}
            className="reveal text-xs uppercase tracking-ultra-wide font-medium"
          >
            Selected Work
          </h2>
          <span className="text-xs uppercase tracking-ultra-wide text-muted-foreground hidden md:block">
            {projects.length} Projects
          </span>
        </div>

        {/* Editorial Portfolio Grid */}
        <div className="space-y-20 md:space-y-32 lg:space-y-40">
          {projects.map((project, index) => {
            // Editorial Layout System
            // Mix of: full-width, large feature, two-col, smaller pieces
            const layoutType = project.layout;

            // Layout 1: Large feature - 8 cols offset
            if (layoutType === "large") {
              return (
                <div
                  key={project.slug}
                  className="reveal"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <Link
                    href={`/work/${project.slug}`}
                    className="group block"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12">
                      {/* Image - Offset */}
                      <div className="lg:col-span-10 lg:col-start-2">
                        <div className="relative aspect-[4/3] md:aspect-[16/10] overflow-hidden bg-secondary">
                          <div
                            className={`absolute inset-0 transition-transform duration-700 ease-out ${
                              hoveredIndex === index
                                ? "scale-[1.02]"
                                : "scale-100"
                            }`}
                            style={{ background: project.image }}
                          />
                          <div className="absolute top-4 left-4 md:top-6 md:left-6">
                            <span className="text-xs uppercase tracking-ultra-wide text-white/70">
                              {project.number}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="lg:col-span-8 lg:col-start-2 flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mt-4">
                        <div>
                          <h3 className="text-2xl md:text-3xl lg:text-4xl font-display tracking-tight group-hover:translate-x-2 transition-transform duration-500">
                            {project.title}
                          </h3>
                          <p className="text-xs md:text-sm text-muted-foreground mt-2">
                            {project.category} · {project.year}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground max-w-[400px] hidden lg:block">
                          {project.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            }

            // Layout 2: Full width
            if (layoutType === "full") {
              return (
                <div
                  key={project.slug}
                  className="reveal"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <Link
                    href={`/work/${project.slug}`}
                    className="group block"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-secondary">
                      <div
                        className={`absolute inset-0 transition-transform duration-700 ease-out ${
                          hoveredIndex === index
                            ? "scale-[1.02]"
                            : "scale-100"
                        }`}
                        style={{ background: project.image }}
                      />
                      <div className="absolute top-4 left-4 md:top-6 md:left-6 lg:top-8 lg:left-8">
                        <span className="text-xs uppercase tracking-ultra-wide text-white/70">
                          {project.number}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-6">
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-display tracking-tight group-hover:translate-x-2 transition-transform duration-500">
                          {project.title}
                        </h3>
                        <p className="text-xs md:text-sm text-muted-foreground mt-2">
                          {project.category} · {project.year}
                        </p>
                      </div>
                      <div className="md:col-span-5 md:col-start-8 hidden md:block">
                        <p className="text-sm text-muted-foreground max-w-[400px]">
                          {project.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            }

            // Layout 3: Two column - two projects side by side
            if (layoutType === "two-col") {
              return (
                <div
                  key={project.slug}
                  className="reveal"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <Link
                    href={`/work/${project.slug}`}
                    className="group block"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                      <div className="relative aspect-[4/3] md:aspect-[5/6] overflow-hidden bg-secondary">
                        <div
                          className={`absolute inset-0 transition-transform duration-700 ease-out ${
                            hoveredIndex === index
                              ? "scale-[1.02]"
                              : "scale-100"
                          }`}
                          style={{ background: project.image }}
                        />
                        <div className="absolute top-4 left-4 md:top-6 md:left-6">
                          <span className="text-xs uppercase tracking-ultra-wide text-white/70">
                            {project.number}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col justify-end">
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-display tracking-tight group-hover:translate-x-2 transition-transform duration-500">
                          {project.title}
                        </h3>
                        <p className="text-xs md:text-sm text-muted-foreground mt-2 mb-4">
                          {project.category} · {project.year}
                        </p>
                        <p className="text-sm text-muted-foreground max-w-[400px]">
                          {project.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            }

            // Layout 4: Small - offset/smaller piece
            return (
              <div
                key={project.slug}
                className="reveal"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <Link
                  href={`/work/${project.slug}`}
                  className="group block"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div
                    className={`grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 ${
                      index % 2 === 0 ? "" : "md:flex-row-reverse"
                    }`}
                  >
                    <div
                      className={`relative aspect-[4/3] md:aspect-[5/4] overflow-hidden bg-secondary ${
                        index % 2 === 0
                          ? "md:col-span-7"
                          : "md:col-span-7 md:col-start-6"
                      }`}
                    >
                      <div
                        className={`absolute inset-0 transition-transform duration-700 ease-out ${
                          hoveredIndex === index
                            ? "scale-[1.02]"
                            : "scale-100"
                        }`}
                        style={{ background: project.image }}
                      />
                      <div className="absolute top-4 left-4 md:top-6 md:left-6">
                        <span className="text-xs uppercase tracking-ultra-wide text-white/70">
                          {project.number}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`flex flex-col justify-center ${
                        index % 2 === 0
                          ? "md:col-span-4 md:col-start-9"
                          : "md:col-span-4 md:col-start-1"
                      }`}
                    >
                      <h3 className="text-xl md:text-2xl lg:text-3xl font-display tracking-tight group-hover:translate-x-2 transition-transform duration-500">
                        {project.title}
                      </h3>
                      <p className="text-xs md:text-sm text-muted-foreground mt-2 mb-3">
                        {project.category} · {project.year}
                      </p>
                      <p className="text-sm text-muted-foreground max-w-[400px]">
                        {project.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
