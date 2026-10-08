"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useSiteConfig } from "@/context/site-config";
import { useReveal } from "@/hooks/use-reveal";

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
      className="px-5 py-24 sm:px-6 md:px-10 md:py-32 lg:px-16 lg:py-40"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="rule mb-10 flex items-baseline justify-between gap-6 pt-5 md:mb-14">
          <h2 id="highlights-heading" ref={headingRef} className="reveal eyebrow">
            {config.highlightsHeading}
          </h2>
          <span className="eyebrow text-muted-foreground">Archive index</span>
        </div>

        <ul ref={listRef} className="reveal [border-top:var(--hairline)_solid_hsl(var(--border))]">
          {highlights.map((project) => (
            <li key={project.slug}>
              <Link
                href={project.href ?? `/work/${project.slug}`}
                className="group grid grid-cols-12 items-center gap-x-4 gap-y-2 py-5 transition-colors duration-500 hover:bg-card md:py-6 [border-bottom:var(--hairline)_solid_hsl(var(--border))]"
              >
                <span className="col-span-2 text-[11px] tabular-nums tracking-[0.2em] text-muted-foreground md:col-span-1">
                  {project.number}
                </span>

                <h3 className="col-span-10 text-lg font-display uppercase tracking-[-0.02em] transition-transform duration-500 group-hover:translate-x-2 md:col-span-5 md:text-2xl">
                  {project.title}
                </h3>

                <span className="col-span-6 text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground md:col-span-3">
                  {project.category}
                </span>

                <span className="col-span-4 text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground md:col-span-2 md:text-right">
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
