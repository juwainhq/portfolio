"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { useSiteConfig } from "@/context/site-config";
import { useReveal } from "@/hooks/use-reveal";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { DitherImage } from "@/components/dither-image";

/** Aspect ratio per editorial layout, so the dithered cards stay uniform. */
const ASPECT: Record<string, string> = {
  featured: "aspect-[4/3]",
  portrait: "aspect-[3/4]",
  wide: "aspect-[16/9]",
  square: "aspect-square",
  "two-col": "aspect-[16/9]",
  gallery: "aspect-[4/3]",
};

export default function WorksPage() {
  const { config } = useSiteConfig();
  const headingRef = useReveal();
  const listRef = useReveal<HTMLUListElement>();

  const allProjects = config.projects.filter((project) => !project.hidden);

  useEffect(() => {
    document.querySelectorAll(".reveal:not(.active)").forEach((el) => {
      el.classList.add("active");
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main id="main">
        <section
          id="work"
          aria-labelledby="archive-heading"
          className="px-5 pb-24 pt-28 sm:px-6 md:px-10 md:pb-32 md:pt-36 lg:px-16"
        >
          <div className="mx-auto max-w-[1600px]">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 md:mb-16">
              <h1
                id="archive-heading"
                ref={headingRef}
                className="reveal eyebrow"
              >
                {config.workHeading}
              </h1>
              <span className="reveal eyebrow text-muted-foreground">
                {String(allProjects.length).padStart(2, "0")}{" "}
                {config.workFooterNote}
              </span>
            </div>

            <ul ref={listRef} className="reveal flex flex-col gap-16 md:gap-24">
              {allProjects.map((project, index) => (
                <li key={project.slug}>
                  <Link
                    href={`/work/${project.slug}`}
                    className="card-stamp group grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-x-10 md:p-6"
                  >
                    <div
                      className={
                        index % 2 === 1
                          ? "md:col-span-7 md:order-2"
                          : "md:col-span-7"
                      }
                    >
                      <DitherImage
                        src={project.image}
                        alt={`${project.title} — ${project.category} by Juwain Haque`}
                        fit="cover"
                        cell={3}
                        maxPixels={380}
                        className={`w-full [border:var(--hairline)_solid_hsl(var(--border))] ${
                          ASPECT[project.layout] ?? "aspect-[4/3]"
                        }`}
                        sizes="(min-width: 768px) 58vw, 90vw"
                      />
                    </div>

                    <div
                      className={`flex flex-col justify-center gap-4 px-5 pb-6 md:col-span-5 md:px-0 md:pb-0 ${
                        index % 2 === 1 ? "md:order-1" : ""
                      }`}
                    >
                      <div className="flex items-baseline gap-3">
                        <span className="text-[11px] font-medium tracking-[0.25em] text-muted-foreground">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span
                          aria-hidden="true"
                          className="h-px w-4 shrink-0 bg-foreground/30"
                        />
                        <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
                          {project.category}
                        </span>
                      </div>

                      <h2 className="display text-[clamp(1.5rem,3.6vw,2.75rem)] transition-transform duration-500 group-hover:translate-x-1.5">
                        {project.title}
                      </h2>

                      {project.description ? (
                        <p className="max-w-[46ch] text-sm leading-relaxed text-muted-foreground md:text-base">
                          {project.description}
                        </p>
                      ) : null}

                      <span className="mt-1 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground transition-colors duration-300 group-hover:text-ink-2">
                        View project
                        <ArrowUpRight
                          size={14}
                          aria-hidden="true"
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="rule mt-16 pt-10 md:mt-20">
              <Link
                href="/#work"
                className="link-underline inline-flex items-center gap-3 text-sm uppercase tracking-[0.2em]"
              >
                Back to selected work
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
