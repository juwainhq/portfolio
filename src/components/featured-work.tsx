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
 * counter in the header, and this section holds the page's only link to the
 * full archive.
 */
export function FeaturedWork() {
  const { config } = useSiteConfig();
  const headingRef = useReveal();
  const gridRef = useReveal();
  const ctaRef = useReveal();

  const featured = config.projects.filter(
    (project) => project.featured && !project.hidden
  );
  if (featured.length === 0) return null;

  const count = String(featured.length).padStart(2, "0");

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="px-5 py-24 sm:px-6 md:px-10 md:py-32 lg:px-16 lg:py-40"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="rule flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3 pt-5">
          <h2 id="work-heading" ref={headingRef} className="reveal eyebrow">
            {config.workHeading}
          </h2>
          <span ref={gridRef} className="reveal eyebrow text-muted-foreground">
            {count} {config.workFooterNote}
          </span>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-10">
          {featured.map((project, index) => (
            <li
              key={project.slug}
              className="reveal"
              style={{ "--reveal-delay": `${index * 90}ms` } as React.CSSProperties}
            >
              <Link
                href={project.href ?? `/work/${project.slug}`}
                className="card-stamp group flex h-full flex-col"
              >
                <div className="overflow-hidden">
                  <DitherImage
                    src={project.image}
                    alt={`${project.title} — ${project.category} project by Juwain Haque`}
                    fit="cover"
                    cell={3}
                    maxPixels={400}
                    className="aspect-[4/5] w-full transition-transform duration-700 ease-out-expo group-hover:scale-[1.02]"
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                  />
                </div>

                <div className="flex flex-1 flex-col gap-3 p-5 md:p-6">
                  <div className="flex items-baseline gap-3">
                    <span className="text-[11px] font-medium tabular-nums tracking-[0.24em] text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      aria-hidden="true"
                      className="h-px w-4 shrink-0 bg-border"
                    />
                    <span className="truncate text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                      {project.category}
                    </span>
                  </div>

                  <h3 className="display text-[clamp(1.2rem,2.2vw,1.65rem)] transition-transform duration-500 ease-out-expo group-hover:translate-x-1">
                    {project.title}
                  </h3>

                  {project.description ? (
                    <p className="max-w-[38ch] text-sm leading-relaxed text-muted-foreground">
                      {project.description}
                    </p>
                  ) : null}

                  <span className="mt-auto inline-flex items-center gap-2 pt-3 text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                    View project
                    <ArrowRight
                      size={13}
                      aria-hidden="true"
                      className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5"
                    />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* The one and only link to the full archive. */}
        <div ref={ctaRef} className="reveal rule mt-16 pt-10 md:mt-24 md:pt-12">
          <Link href="/work" className="group inline-flex flex-col gap-5">
            <span className="eyebrow text-muted-foreground">
              The full archive
            </span>
            <span className="display flex flex-wrap items-baseline gap-x-5 gap-y-2 text-[clamp(2rem,6.5vw,4.25rem)]">
              <span className="relative">
                View all work
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-foreground transition-transform duration-700 ease-out-expo group-hover:scale-x-100"
                />
              </span>
              <ArrowRight
                size={40}
                aria-hidden="true"
                className="h-[0.6em] w-[0.6em] shrink-0 transition-transform duration-500 ease-out-expo group-hover:translate-x-3"
              />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
