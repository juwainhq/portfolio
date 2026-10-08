"use client";

import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useSiteConfig } from "@/context/site-config";
import { DitherField } from "@/components/dither-field";

/**
 * Hero: a live ordered-dither field fills the section; the name sits on a
 * solid "type plate" so the headline keeps full contrast while the colour
 * field stays vividly visible above, below and beside it.
 *
 * On phones (and for reduced-motion visitors) the canvas just runs: 30fps,
 * ~178 columns wide, paused whenever it is off-screen or the tab is hidden.
 */
export function Hero() {
  const { config } = useSiteConfig();
  const secondary = config.heroSecondaryButtonTarget;
  const words = config.name.split(" ").filter(Boolean);

  const primaryHref = config.heroButtonTarget?.href || "#work";
  const primaryLabel = config.heroButtonText || "View Work";

  return (
    <section
      id="hero"
      aria-labelledby="hero-name"
      className="relative isolate flex min-h-[100svh] flex-col justify-between overflow-hidden px-5 pb-8 pt-24 sm:px-6 md:px-10 md:pb-10 md:pt-28 lg:px-16"
    >
      {/* Live dither field — the colour moment of the page. Kept inside the
          section's own stacking context (`isolate`) so the page wrapper's
          background can't paint over it. */}
      <div className="absolute inset-0" aria-hidden="true" data-hero-dither="">
        <DitherField accents={[5, 3, 2]} cell={11} maxCols={130} speed={0.9} />
      </div>

      {/* Top label row */}
      <div className="relative z-10 flex flex-wrap items-start justify-between gap-3">
        <span
          className="chip-outline animate-in"
          style={{ "--reveal-delay": "60ms" } as React.CSSProperties}
        >
          <span
            aria-hidden="true"
            className="h-2 w-2 bg-[hsl(var(--vivid-1))]"
          />
          {config.heroStatusText}
        </span>

        <span
          className="chip-outline animate-in hidden text-right sm:inline-flex"
          style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
        >
          {config.heroTopRight[0]} · {config.heroTopRight[1]}
        </span>
      </div>

      {/* Type plate */}
      <div className="relative z-10 flex flex-1 items-center py-8 md:py-12">
        <div className="w-full border-2 border-border bg-background">
          <div className="px-5 py-7 sm:px-7 md:px-10 md:py-10">
            {/* The name paints immediately (no fade): it is the LCP element,
                and holding it at opacity 0 would delay the largest paint. */}
            <h1 id="hero-name" className="display">
              {words.map((word, index) => (
                <span key={`${word}-${index}`} className="block">
                  <span className="block text-[clamp(3rem,17vw,11rem)]">
                    {word}
                  </span>
                </span>
              ))}
            </h1>

            <div
              className="animate-in mt-6 flex items-center gap-4 md:mt-8 md:gap-6"
              style={{ "--reveal-delay": "340ms" } as React.CSSProperties}
            >
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 shrink-0 bg-[hsl(var(--vivid-3))]"
              />
              <p className="eyebrow">{config.tagline}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row: meta + CTAs */}
      <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div
          className="animate-in flex flex-wrap items-center gap-2"
          style={{ "--reveal-delay": "420ms" } as React.CSSProperties}
        >
          <span className="chip-outline">{config.heroBottomLeft[0]}</span>
          <span className="chip-outline hidden md:inline-flex">
            {config.heroBottomLeft[1]}
          </span>
        </div>

        <div
          className="animate-in flex flex-wrap items-center gap-3"
          style={{ "--reveal-delay": "500ms" } as React.CSSProperties}
        >
          <Link href={primaryHref} className="btn-stamp">
            <ArrowDown size={14} aria-hidden="true" />
            {primaryLabel}
          </Link>

          {secondary?.href ? (
            <a
              href={secondary.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost bg-background"
            >
              {config.heroSecondaryButtonText}
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
