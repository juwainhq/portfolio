"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSiteConfig } from "@/context/site-config";
import { useReveal } from "@/hooks/use-reveal";
import { PortfolioImage } from "@/components/portfolio-image";

export default function WorksPage() {
  const { config } = useSiteConfig();
  const labelRef = useReveal();
  const gridRef = useReveal();

  const allProjects = config.projects.filter((p) => !p.hidden);

  useEffect(() => {
    // Check if document is available
    if (typeof document === "undefined") {
      return;
    }
    // Force re-reveal on page load
    const elements = document.querySelectorAll(
      ".reveal:not(.active)"
    );
    elements.forEach((el) => el.classList.add("active"));
  }, []);

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
            {config.workHeading}
          </h2>
          <span
            ref={gridRef}
            className="reveal text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-muted-foreground"
          >
            {String(allProjects.length).padStart(2, "0")} {config.workFooterNote}
          </span>
        </div>

        {/* Editorial Portfolio Grid */}
        <div className="space-y-16 md:space-y-24 lg:space-y-32">
          {allProjects.map((project, index) => (
            <Link
              key={project.slug}
              href={`/work/${project.slug}`}
              className="block"
            >
              <article
                className="reveal"
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-x-12 md:gap-y-10 items-start">
                  {/* Image block */}
                  <div className="md:col-span-7">
                    <div
                      style={{
                        gridColumn: "1 / span 7",
                      }}
                    >
                      <PortfolioImage
                        src={project.image}
                        alt={project.title}
                        fit={project.fit}
                        sizes="(min-width: 768px) 70vw, 100vw"
                        priority={index < 2}
                        unoptimized={project.image.endsWith(".gif")}
                      />
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="md:col-span-5">
                    <div className="flex items-baseline gap-3 mb-2.5">
                      <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                        {project.number}
                      </span>
                      <span className="h-px w-3 bg-foreground/30 shrink-0" aria-hidden="true" />
                      <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                        {project.category}
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-display tracking-tight transition-transform duration-500 group-hover:translate-x-2">
                      {project.title}
                    </h3>
                    {project.description && (
                      <p className="text-sm text-muted-foreground mt-3 max-w-[400px] leading-relaxed">
                        {project.description}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}