"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useSiteConfig } from "@/context/site-config";
import { useReveal } from "@/hooks/use-reveal";
import { DitherImage } from "@/components/dither-image";

/**
 * Selected Highlights.
 *
 * The archive index as a contact sheet: every row leads with a small dithered
 * plate (the same treatment as the work cards) and opens the project.
 */
export function Highlights() {
  const { config } = useSiteConfig();
  const headingRef = useReveal();
  const listRef = useReveal<HTMLUListElement>();

  const highlights = config.projects.filter((project) => project.highlight && !project.hidden);
  if (highlights.length === 0) return null;


  return (
    <section
      id="highlights"
      aria-labelledby="highlights-heading"
      className="px-5 py-[var(--section-y)] sm:px-6 md:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="rule mb-8 flex items-baseline justify-between gap-6 pt-5 md:mb-12">
          <h2 id="highlights-heading" ref={headingRef} className="reveal eyebrow">
            {config.highlightsHeading}
          </h2>
          <span className="eyebrow text-muted-foreground">Archive index</span>
        </div>

        <ul
          ref={listRef}
          className="reveal [border-top:var(--hairline)_solid_hsl(var(--border))]"
        >
          {highlights.map((project, index) => (
            <li key={project.slug}>
              <Link
                href={project.href ?? `/work/${project.slug}`}
                className="group grid grid-cols-12 items-center gap-x-4 gap-y-3 py-5 transition-colors duration-500 hover:bg-card/60 md:gap-x-6 md:py-6 [border-bottom:var(--hairline)_solid_hsl(var(--border))]"
              >
                <span className="col-span-3 flex items-center md:col-span-1">
                  <DitherImage
                    src={project.image}
                    alt={`${project.title} artwork`}
                    fit="cover"
                    cell={3}
                    maxPixels={120}
                    touchToggle={false}
                    className="h-14 w-14 md:h-16 md:w-16"
                    sizes="80px"
                  />
                </span>

                <span className="meta col-span-2 tabular-nums md:col-span-1">
                  {project.number}
                </span>

                <h3 className="col-span-7 text-lg uppercase tracking-[-0.02em] transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5 md:col-span-5 md:text-2xl font-display">
                  {project.title}
                </h3>

                <span className="meta col-span-6 md:col-span-3">
                  {project.category}
                </span>

                <span className="meta col-span-4 tabular-nums md:col-span-1">
                  {project.year}
                </span>

                <span className="col-span-2 flex justify-end md:col-span-1">
                  <ArrowUpRight
                    size={16}
                    aria-hidden="true"
                    className="text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
