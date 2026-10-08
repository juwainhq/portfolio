"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useSiteConfig } from "@/context/site-config";
import { useReveal } from "@/hooks/use-reveal";
import { DitherImage } from "@/components/dither-image";

/**
 * Selected Work.
 *
 * Numbering is positional (01, 02, 03) so it always matches the "03 Projects"
 * counter in the header, and the section holds the page's single link to the
 * full archive.
 */
export function FeaturedWork() {
  const { config } = useSiteConfig();
  const headingRef = useReveal();
  const gridRef = useReveal<HTMLSpanElement>();
  const ctaRef = useReveal();

  const featured = config.projects.filter((project) => project.featured && !project.hidden);
  if (featured.length === 0) return null;

  const count = String(featured.length).padStart(2, "0");

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="px-5 py-24 sm:px-6 md:px-10 md:py-32 lg:px-16 lg:py-40"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 md:mb-16">
          <h2 id="work-heading" ref={headingRef} className="reveal eyebrow">
            {config.workHeading}
          </h2>
          <span
            ref={gridRef}
            className="reveal eyebrow text-muted-foreground"
          >
            {count} {config.workFooterNote}
          </span>
        </div>

        <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {featured.map((project, index) => (
            <li key={project.slug} className="reveal" style={{ "--reveal-delay": `${index * 90}ms` } as React.CSSProperties}>
              <Link
                href={project.href ?? `/work/${project.slug}`}
                className="card-stamp group flex h-full flex-col hover:-translate-y-1"
              >
                <DitherImage
                  src={project.image}
                  alt={`${project.title} — ${project.category} project by Juwain Haque`}
                  fit="cover"
                  cell={5}
                  maxPixels={240}
                  className="aspect-[4/5] w-full"
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                />

                <div className="flex flex-1 flex-col gap-3 p-5 md:p-6">
                  <div className="flex items-baseline gap-3">
                    <span className="text-[11px] font-medium tracking-[0.25em] text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span aria-hidden="true" className="h-px w-4 shrink-0 bg-foreground/30" />
                    <span className="truncate text-[11px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
                      {project.category}
                    </span>
                  </div>

                  <h3 className="display text-[clamp(1.15rem,2.2vw,1.6rem)] transition-transform duration-500 group-hover:translate-x-1">
                    {project.title}
                  </h3>

                  {project.description ? (
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {project.description}
                    </p>
                  ) : null}

                  <span className="mt-auto inline-flex items-center gap-2 pt-2 text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground transition-colors duration-300 group-hover:text-ink-2">
                    View project
                    <ArrowRight
                      size={13}
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* The one and only link to the full archive. */}
        <div
          ref={ctaRef}
          className="reveal mt-16 border-t-2 border-border pt-10 md:mt-20 md:pt-12"
        >
          <Link href="/work" className="group inline-flex flex-col gap-4">
            <span className="eyebrow text-muted-foreground">
              The full archive
            </span>
            <span className="display flex flex-wrap items-center gap-4 text-[clamp(2rem,7vw,4.5rem)] transition-transform duration-500 ease-out group-hover:translate-x-2">
              View all work
              <ArrowRight
                size={40}
                aria-hidden="true"
                className="h-[0.7em] w-[0.7em] transition-transform duration-500 ease-out group-hover:translate-x-2"
              />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
