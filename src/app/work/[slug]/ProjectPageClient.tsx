"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTheme } from "next-themes";
import { useSiteConfig } from "@/context/site-config";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { useProjectAccent } from "@/hooks/use-project-accent";
import { hslToRgb, type HSL } from "@/lib/color-extraction";
import { withBasePath } from "@/lib/utils";

function hslString({ h, s, l }: HSL): string {
  return `hsl(${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%)`;
}

/**
 * Maps the extracted accent onto the CSS variables consumed by the page.
 * The color stays ambient: a large very-low-opacity radial glow behind the
 * whole page plus small elegant details. The hero section itself stays
 * transparent — the glow shows through from the page root behind it.
 *
 * Extraction is tuned to read well on the black palette, so on the light
 * palette the accent is deepened for contrast and the glows/rules are
 * re-weighted (mirrors the static light-mode defaults in globals.css).
 */
function accentToCssVars(accent: HSL, isLight: boolean): React.CSSProperties {
  const tuned: HSL = isLight
    ? { ...accent, s: Math.min(0.9, accent.s + 0.1), l: Math.min(accent.l, 0.38) }
    : accent;
  const { r, g, b } = hslToRgb(tuned);
  const to255 = (v: number) => Math.round(v * 255);
  const rgb = (alpha: number) =>
    `rgba(${to255(r)}, ${to255(g)}, ${to255(b)}, ${alpha})`;
  const glowA = isLight ? 0.1 : 0.16;
  const glowB = isLight ? 0.06 : 0.1;
  const borderA = isLight ? 0.45 : 0.35;
  const lineA = isLight ? 0.6 : 0.55;
  return {
    "--project-accent": hslString(tuned),
    // Atmospheric glow: cool bloom high on the page, warm counter-glow lower,
    // both blending into the body — the page's only color fields.
    "--project-ambient":
      `radial-gradient(1200px 600px at 18% 0%, ${rgb(glowA)}, rgba(0, 0, 0, 0) 70%), ` +
      `radial-gradient(1000px 700px at 85% 55%, ${rgb(glowB)}, rgba(0, 0, 0, 0) 72%)`,
    // Hairline border for project images/cards, and soft rules/underlines.
    "--project-border": rgb(borderA),
    "--project-line": rgb(lineA),
  } as React.CSSProperties;
}

export function ProjectPageClient({ slug }: { slug: string }) {
  const { config } = useSiteConfig();
  const project = config.projects.find((p) => p.slug === slug && !p.hidden);

  // Dynamic per-project accent, extracted from the hero image in the browser.
  // Null until extraction finishes; CSS defaults keep the page gold/bronze.
  const accent = useProjectAccent(project?.image);
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  if (!project) {
    notFound();
  }

  const hasMeta =
    project.year ||
    project.services.length > 0 ||
    project.client ||
    project.category;

  return (
    <div
      data-project-page=""
      className="min-h-screen bg-background"
      style={{
        // Full-page ambient glow: default (bronze) on first paint, extracted
        // color once the accent resolves. Scrolls with the content.
        backgroundImage: "var(--project-ambient)",
        ...(accent ? accentToCssVars(accent, isLight) : {}),
      }}
    >
      <Navigation />

      {/*
        Hero header — the only themed section. A diagonal gradient from the
        extracted color into deep, faintly tinted black; the body below stays
        solid black. min-h ≈45vh per spec; spacing scales up on desktop.
      */}
      <main>
        <section
          data-project-hero=""
          className="min-h-[45vh] md:min-h-[50vh] flex flex-col justify-between px-6 md:px-10 lg:px-16 pt-24 md:pt-28 pb-10 md:pb-14"
        >
          <div className="max-w-[1600px] mx-auto w-full">
            {/* Back Link */}
            <Link
              href="/#work"
              className="group inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-foreground/60 hover:text-[color:var(--project-accent)] transition-colors duration-300"
            >
              <ArrowLeft
                size={12}
                className="group-hover:-translate-x-1 transition-transform duration-300"
              />
              <span>Back</span>
            </Link>
          </div>

          <div className="max-w-[1600px] mx-auto w-full">
            {/* Project Number */}
            <div className="mb-4">
              <span className="text-[10px] uppercase tracking-[0.25em] text-foreground/70">
                {project.number}
              </span>
            </div>

            {/* Title — crisp white over the gradient */}
            <h1 className="text-[15vw] md:text-[11vw] lg:text-[8vw] xl:text-[6.5vw] font-display leading-[0.85] tracking-[-0.05em] uppercase font-medium mb-6 md:mb-8">
              {project.title}
            </h1>
            {/* Accent underline — small, clean, extracted from the artwork */}
            <div className="h-px w-14 bg-[color:var(--project-accent)]" />
          </div>
        </section>

        {/* Project Meta */}
        <div className="px-6 md:px-10 lg:px-16 mt-12 md:mt-16 mb-10 md:mb-14">
          <div className="max-w-[1600px] mx-auto">
            {hasMeta && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 pt-8 border-t border-[color:var(--project-line)]">
                {project.category && (
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
                      Category
                    </p>
                    <p className="text-sm">{project.category}</p>
                  </div>
                )}
                {project.year && (
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
                      Year
                    </p>
                    <p className="text-sm">{project.year}</p>
                  </div>
                )}
                {project.services.length > 0 && (
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
                      Services
                    </p>
                    <p className="text-sm">{project.services.join(", ")}</p>
                  </div>
                )}
                {project.client && (
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
                      Client
                    </p>
                    <p className="text-sm">{project.client}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Hero Image — natural aspect ratio, no forced crop */}
        <div className="px-6 md:px-10 lg:px-16 mb-16 md:mb-24">
          <div className="max-w-[1600px] mx-auto">
            <div className="border border-[color:var(--project-border)]">
              <img
                src={withBasePath(project.image)}
                alt={project.title}
                className={`w-full h-auto ${
                  project.fit === "cover" ? "object-cover" : "object-contain"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Gallery Images — each at its natural ratio */}
        {project.gallery && project.gallery.length > 0 && (
          <div className="px-6 md:px-10 lg:px-16 mb-24 md:mb-36">
            <div className="max-w-[1600px] mx-auto space-y-8 md:space-y-12">
              {project.gallery.map((src, index) => {
                const fit = project.galleryFit ?? project.fit;
                return (
                  <div key={index} className="border border-[color:var(--project-border)]">
                    <img
                      src={withBasePath(src)}
                      alt={`${project.title} — ${index + 2}`}
                      className={`w-full h-auto ${
                        fit === "cover" ? "object-cover" : "object-contain"
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Back to All Work */}
        <div className="px-6 md:px-10 lg:px-16 py-24 md:py-36 border-t border-[color:var(--project-line)]">
          <div className="max-w-[1400px] mx-auto">
            <Link href="/#work" className="group block">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[color:var(--project-accent)] mb-4">
                View All
              </p>
              <h3 className="text-4xl md:text-6xl lg:text-8xl font-display tracking-tight uppercase group-hover:translate-x-4 group-hover:text-[color:var(--project-accent)] transition-[transform,color] duration-700">
                All Work →
              </h3>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
