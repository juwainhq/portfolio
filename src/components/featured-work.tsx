"use client";

import Link from "next/link";
import { useReveal } from "@/hooks/use-reveal";
import { useSiteConfig } from "@/context/site-config";
import { PortfolioImage } from "@/components/portfolio-image";

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
      className="py-20 md:py-28 lg:py-32 px-6 md:px-10 lg:px-16"
    >
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-12 md:mb-16 lg:mb-20 flex items-end justify-between gap-6">
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

        {/* Featured Projects Grid — uniform card sizing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featured.map((project, index) => (
            <Link
              key={project.slug}
              href={project.href ?? `/work/${project.slug}`}
              className="block group"
            >
              <article
                className="reveal flex flex-col h-full"
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                {/* Fixed-height image container so every card is identical */}
                <div className="relative w-full aspect-[4/5] overflow-hidden bg-muted">
                  <PortfolioImage
                    src={project.image}
                    alt={project.title}
                    fit="cover"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    priority={index < 2}
                    unoptimized={project.image.endsWith(".gif")}
                    noZoom
                  />
                </div>

                {/* Meta — same height per card via min-height */}
                <div className="pt-5 md:pt-6 flex flex-col">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                      {project.number}
                    </span>
                    <span className="h-px w-3 bg-foreground/30 shrink-0" aria-hidden="true" />
                    <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground truncate">
                      {project.category}
                    </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-display tracking-tight transition-transform duration-500 group-hover:translate-x-1">
                    {project.title}
                  </h3>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* View All Works — Large CTA inside the section */}
        <div className="reveal mt-16 md:mt-20 lg:mt-24 pt-10 md:pt-12 border-t border-foreground/10">
          <Link
            href="/work"
            className="group block"
            aria-label="View all works"
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4 md:mb-6">
              Continue Exploring
            </p>
            <h2 className="flex items-center gap-3 md:gap-5 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display tracking-tight uppercase font-medium leading-[0.85] transition-all duration-700 ease-out group-hover:translate-x-3 md:group-hover:translate-x-6">
              <span>View All Works</span>
              <span
                className="inline-block transition-transform duration-700 ease-out group-hover:translate-x-2 group-hover:-translate-y-2"
                aria-hidden="true"
              >
                →
              </span>
            </h2>
            <div className="mt-6 md:mt-8 flex items-center gap-4">
              <span className="block h-px w-10 md:w-16 bg-foreground/40 transition-all duration-700 ease-out group-hover:w-20 md:group-hover:w-32" aria-hidden="true" />
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
