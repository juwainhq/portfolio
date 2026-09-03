"use client";

import Link from "next/link";
import { useReveal } from "@/hooks/use-reveal";
import { useSiteConfig } from "@/context/site-config";
import { PortfolioImage } from "@/components/portfolio-image";
import { ArrowUpRight } from "lucide-react";

export function FeaturedWork() {
  const { config } = useSiteConfig();
  const labelRef = useReveal();
  const gridRef = useReveal();

  const featured = config.projects.filter(
    (p) => p.featured && !p.hidden
  );

  if (featured.length === 0) return null;

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
            {String(featured.length).padStart(2, "0")} {config.workFooterNote}
          </span>
        </div>

        {/* Featured Projects Grid */}
        <div className="space-y-16 md:space-y-24 lg:space-y-32">
          {featured.map((project, index) => (
            <Link
              key={project.slug}
              href={project.href ?? `/work/${project.slug}`}
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

        {/* View All Works — Large CTA */}
        <div className="reveal mt-24 md:mt-32 lg:mt-40 pt-16 md:pt-20 lg:pt-24 border-t border-foreground/10">
          <Link
            href="/work"
            className="group block"
            aria-label="View all works"
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-6 md:mb-8">
              Continue Exploring
            </p>
            <h2 className="flex items-center gap-4 md:gap-6 text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-display tracking-tight uppercase font-medium leading-[0.85] transition-all duration-700 ease-out group-hover:translate-x-3 md:group-hover:translate-x-6">
              <span>View All Works</span>
              <span
                className="inline-block transition-transform duration-700 ease-out group-hover:translate-x-2 group-hover:-translate-y-2"
                aria-hidden="true"
              >
                →
              </span>
            </h2>
            <div className="mt-8 md:mt-10 flex items-center gap-4">
              <span className="block h-px w-12 md:w-20 bg-foreground/40 transition-all duration-700 ease-out group-hover:w-24 md:group-hover:w-40" aria-hidden="true" />
              <span className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-muted-foreground transition-colors duration-500 group-hover:text-foreground">
                See the full archive
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}