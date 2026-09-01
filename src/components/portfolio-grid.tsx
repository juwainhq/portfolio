"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useReveal } from "@/hooks/use-reveal";
import { projects } from "@/data/projects";

export function PortfolioGrid() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const labelRef = useReveal();
  const indexRef = useReveal();

  return (
    <section
      id="work"
      className="py-28 md:py-40 lg:py-48 px-6 md:px-10 lg:px-16"
    >
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-20 md:mb-28 lg:mb-32 flex items-end justify-between gap-6">
          <h2
            ref={labelRef}
            className="reveal text-[10px] md:text-[11px] uppercase tracking-[0.3em] font-medium"
          >
            Selected Work
          </h2>
          <span
            ref={indexRef}
            className="reveal text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-muted-foreground"
          >
            {String(projects.length).padStart(2, "0")} Projects / 2019 — 2025
          </span>
        </div>

        {/* Editorial Portfolio Grid - composition-driven layout */}
        <div className="space-y-28 md:space-y-40 lg:space-y-56">
          {projects.map((project, index) => {
            const layoutType = project.layout;

            // Large Featured - centered with offset, generous aspect
            if (layoutType === "large") {
              return (
                <div
                  key={project.slug}
                  className="reveal"
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <Link
                    href={`/work/${project.slug}`}
                    className="group block"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12">
                      <div className="lg:col-span-10 lg:col-start-2">
                        <div className="relative aspect-[5/4] md:aspect-[16/10] overflow-hidden bg-secondary">
                          <div
                            className={`absolute inset-0 transition-transform duration-[1200ms] ease-out will-change-transform ${
                              hoveredIndex === index
                                ? "scale-[1.04]"
                                : "scale-100"
                            }`}
                          >
                            <Image
                              src={project.image}
                              alt={project.title}
                              fill
                              sizes="(min-width: 1024px) 83vw, 100vw"
                              className="object-cover"
                              priority={index < 2}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="lg:col-span-8 lg:col-start-2 flex flex-col md:flex-row md:items-baseline md:justify-between gap-3 md:gap-6 mt-5">
                        <div>
                          <div className="flex items-baseline gap-3 mb-1.5">
                            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                              {project.number}
                            </span>
                            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                              {project.category}
                            </span>
                          </div>
                          <h3 className="text-2xl md:text-3xl lg:text-4xl font-display tracking-tight group-hover:translate-x-2 transition-transform duration-500">
                            {project.title}
                          </h3>
                        </div>
                        {project.description && (
                          <p className="text-sm text-muted-foreground max-w-[380px] hidden lg:block">
                            {project.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              );
            }

            // Full width - cinematic
            if (layoutType === "full") {
              return (
                <div
                  key={project.slug}
                  className="reveal"
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <Link
                    href={`/work/${project.slug}`}
                    className="group block"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div className="relative aspect-[16/9] md:aspect-[2.4/1] overflow-hidden bg-secondary">
                      <div
                        className={`absolute inset-0 transition-transform duration-[1200ms] ease-out will-change-transform ${
                          hoveredIndex === index
                            ? "scale-[1.04]"
                            : "scale-100"
                        }`}
                      >
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          sizes="100vw"
                          className="object-cover"
                          priority={index < 2}
                        />
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-5">
                        <div className="flex items-baseline gap-3 mb-1.5">
                          <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                            {project.number}
                          </span>
                          <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                            {project.category}
                          </span>
                        </div>
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-display tracking-tight group-hover:translate-x-2 transition-transform duration-500">
                          {project.title}
                        </h3>
                      </div>
                      {project.description && (
                        <div className="md:col-span-5 md:col-start-8 hidden md:block">
                          <p className="text-sm text-muted-foreground max-w-[400px]">
                            {project.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
              );
            }

            // Two column - editorial side by side
            if (layoutType === "two-col") {
              return (
                <div
                  key={project.slug}
                  className="reveal"
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <Link
                    href={`/work/${project.slug}`}
                    className="group block"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                      <div className="relative aspect-[4/5] md:aspect-[5/6] overflow-hidden bg-secondary">
                        <div
                          className={`absolute inset-0 transition-transform duration-[1200ms] ease-out will-change-transform ${
                            hoveredIndex === index
                              ? "scale-[1.04]"
                              : "scale-100"
                          }`}
                        >
                          <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            sizes="(min-width: 768px) 50vw, 100vw"
                            className="object-cover"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col justify-end pb-2">
                        <div className="flex items-baseline gap-3 mb-1.5">
                          <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                            {project.number}
                          </span>
                          <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                            {project.category}
                          </span>
                        </div>
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-display tracking-tight mb-3 group-hover:translate-x-2 transition-transform duration-500">
                          {project.title}
                        </h3>
                        {project.description && (
                          <p className="text-sm text-muted-foreground max-w-[400px]">
                            {project.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              );
            }

            // Portrait - alternating left/right composition
            if (layoutType === "portrait") {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={project.slug}
                  className="reveal"
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <Link
                    href={`/work/${project.slug}`}
                    className="group block"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
                      {/* Image */}
                      <div
                        className={`relative overflow-hidden bg-secondary aspect-[3/4] md:aspect-[4/5] ${
                          isEven
                            ? "md:col-span-5 md:col-start-2"
                            : "md:col-span-5 md:col-start-7"
                        }`}
                      >
                        <div
                          className={`absolute inset-0 transition-transform duration-[1200ms] ease-out will-change-transform ${
                            hoveredIndex === index
                              ? "scale-[1.04]"
                              : "scale-100"
                          }`}
                        >
                          <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            sizes="(min-width: 768px) 40vw, 100vw"
                            className="object-cover"
                          />
                        </div>
                      </div>

                      {/* Meta */}
                      <div
                        className={`${
                          isEven
                            ? "md:col-span-4 md:col-start-8"
                            : "md:col-span-4 md:col-start-2 md:order-first"
                        }`}
                      >
                        <div className="flex items-baseline gap-3 mb-2">
                          <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                            {project.number}
                          </span>
                          <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                            {project.category}
                          </span>
                        </div>
                        <h3 className="text-xl md:text-2xl lg:text-3xl font-display tracking-tight mb-3 group-hover:translate-x-2 transition-transform duration-500">
                          {project.title}
                        </h3>
                        {project.description && (
                          <p className="text-sm text-muted-foreground max-w-[400px]">
                            {project.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              );
            }

            // Wide - landscape cinematic with metadata aside
            return (
              <div
                key={project.slug}
                className="reveal"
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <Link
                  href={`/work/${project.slug}`}
                  className="group block"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12">
                    <div className="md:col-span-9">
                      <div className="relative aspect-[16/9] md:aspect-[16/8] overflow-hidden bg-secondary">
                        <div
                          className={`absolute inset-0 transition-transform duration-[1200ms] ease-out will-change-transform ${
                            hoveredIndex === index
                              ? "scale-[1.04]"
                              : "scale-100"
                          }`}
                        >
                          <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            sizes="(min-width: 768px) 75vw, 100vw"
                            className="object-cover"
                            priority={index < 2}
                            unoptimized={project.image.endsWith(".gif")}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-3 flex flex-col justify-end">
                      <div className="flex items-baseline gap-3 mb-1.5">
                        <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                          {project.number}
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                          {project.category}
                        </span>
                      </div>
                      <h3 className="text-lg md:text-xl lg:text-2xl font-display tracking-tight mb-2 group-hover:translate-x-2 transition-transform duration-500">
                        {project.title}
                      </h3>
                      {project.description && (
                        <p className="text-sm text-muted-foreground max-w-[280px]">
                          {project.description}
                        </p>
                      )}
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
