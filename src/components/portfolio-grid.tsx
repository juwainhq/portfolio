"use client";

import Link from "next/link";
import { useReveal } from "@/hooks/use-reveal";
import { projects, type Project } from "@/data/projects";
import { PortfolioImage } from "@/components/portfolio-image";

type ColPolicy = {
  imageColSpan: number;
  imageColStart: number;
  metaColSpan: number;
  metaColStart: number;
  metaSide: "top" | "bottom" | "side";
  imageMaxWidth?: string;
};

const policies: Record<Project["layout"], ColPolicy> = {
  featured: {
    imageColSpan: 12,
    imageColStart: 1,
    metaColSpan: 10,
    metaColStart: 2,
    metaSide: "bottom",
  },
  portrait: {
    imageColSpan: 5,
    imageColStart: 1,
    metaColSpan: 4,
    metaColStart: 8,
    metaSide: "side",
    imageMaxWidth: "440px",
  },
  wide: {
    imageColSpan: 9,
    imageColStart: 4,
    metaColSpan: 3,
    metaColStart: 1,
    metaSide: "side",
  },
  square: {
    imageColSpan: 6,
    imageColStart: 1,
    metaColSpan: 4,
    metaColStart: 9,
    metaSide: "side",
    imageMaxWidth: "560px",
  },
  "two-col": {
    imageColSpan: 12,
    imageColStart: 1,
    metaColSpan: 12,
    metaColStart: 1,
    metaSide: "bottom",
  },
  gallery: {
    imageColSpan: 12,
    imageColStart: 1,
    metaColSpan: 8,
    metaColStart: 1,
    metaSide: "bottom",
  },
};

function policyFor(layout: Project["layout"], index: number): ColPolicy {
  const p = policies[layout];
  if (layout === "portrait" || layout === "square") {
    const flip = index % 2 === 1;
    if (flip) {
      return {
        ...p,
        imageColStart: 13 - p.imageColSpan - p.metaColSpan,
        metaColStart: 13 - p.metaColSpan,
      };
    }
  }
  return p;
}

const colStyle = (
  colSpan: number,
  colStart: number
): React.CSSProperties => ({
  gridColumn: `${colStart} / span ${colSpan}`,
});

export function PortfolioGrid() {
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

        {/* Editorial Portfolio Grid */}
        <div className="space-y-32 md:space-y-48 lg:space-y-56">
          {projects.map((project, index) => (
            <ProjectRow
              key={project.slug}
              project={project}
              index={index}
              policy={policyFor(project.layout, index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectRow({
  project,
  index,
  policy,
}: {
  project: Project;
  index: number;
  policy: ColPolicy;
}) {
  return (
    <article
      className="reveal"
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <Link
        href={`/work/${project.slug}`}
        className="group block"
        aria-label={`${project.title} — ${project.category}`}
      >
        {/* Meta above image */}
        {policy.metaSide === "top" && (
          <div className="mb-8 md:mb-10">
            <ProjectMeta project={project} />
          </div>
        )}

        {/* Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-x-12 md:gap-y-10 items-start"
          style={
            policy.metaSide === "side"
              ? ({ alignItems: "center" } as React.CSSProperties)
              : undefined
          }
        >
          {/* Image */}
          <div style={colStyle(policy.imageColSpan, policy.imageColStart)}>
            <div
              style={
                policy.imageMaxWidth
                  ? ({ maxWidth: policy.imageMaxWidth } as React.CSSProperties)
                  : undefined
              }
            >
              <PortfolioImage
                src={project.image}
                alt={project.title}
                fit={project.fit}
                sizes={
                  project.layout === "wide"
                    ? "(min-width: 768px) 75vw, 100vw"
                    : project.layout === "two-col"
                    ? "(min-width: 768px) 58vw, 100vw"
                    : project.layout === "featured" || project.layout === "gallery"
                    ? "100vw"
                    : "(min-width: 768px) 40vw, 100vw"
                }
                priority={index < 2}
                unoptimized={project.image.endsWith(".gif")}
              />
            </div>
          </div>

          {/* Side meta */}
          {policy.metaSide === "side" && (
            <div style={colStyle(policy.metaColSpan, policy.metaColStart)}>
              <ProjectMeta project={project} />
            </div>
          )}

          {/* Two-col second images */}
          {project.layout === "two-col" && project.gallery && (
            <div style={colStyle(5, 8)}>
              <div className="flex flex-col gap-8 md:gap-10">
                {project.gallery.slice(0, 2).map((src, i) => (
                  <PortfolioImage
                    key={i}
                    src={src}
                    alt={`${project.title} — ${i + 2}`}
                    fit={project.galleryFit ?? project.fit}
                    sizes="(min-width: 768px) 40vw, 100vw"
                    unoptimized={src.endsWith(".gif")}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Gallery additional images */}
          {project.layout === "gallery" && project.gallery && (
            <div style={colStyle(10, 2)} className="mt-10 md:mt-14">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                {project.gallery.map((src, i) => (
                  <PortfolioImage
                    key={i}
                    src={src}
                    alt={`${project.title} — ${i + 2}`}
                    fit={project.galleryFit ?? project.fit}
                    sizes="(min-width: 768px) 45vw, 100vw"
                    unoptimized={src.endsWith(".gif")}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Meta below image */}
        {policy.metaSide === "bottom" && (
          <div className="mt-8 md:mt-10 max-w-[640px]">
            <ProjectMeta project={project} />
          </div>
        )}
      </Link>
    </article>
  );
}

function ProjectMeta({ project }: { project: Project }) {
  return (
    <div className="group/meta">
      <div className="flex items-baseline gap-3 mb-2.5">
        <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          {project.number}
        </span>
        <span
          className="h-px w-3 bg-foreground/20 shrink-0"
          aria-hidden="true"
        />
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
  );
}
