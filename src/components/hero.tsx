"use client";

import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useSiteConfig } from "@/context/site-config";
import { DitherField } from "@/components/dither-field";

/**
 * Hero.
 *
 * A live ordered-dither colour field fills the section; the name sits on a
 * fixed "print plate" (paper + ink, identical in both themes) so the type
 * keeps 16:1 contrast while the moving dither stays the loudest thing on
 * screen. The plate carries two print details — a colour bar of the five
 * accents and a registration cross.
 */
export function Hero() {
  const { config } = useSiteConfig();
  const secondary = config.heroSecondaryButtonTarget;
  const words = config.name.split(" ").filter(Boolean);

  const primaryHref = config.heroButtonTarget?.href || "#work";
  const primaryLabel = config.heroButtonText || "View Work";
  const [bottomA, bottomB] = config.heroBottomLeft;

  return (
    <section
      id="hero"
      aria-labelledby="hero-name"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden px-4 pb-6 pt-20 sm:px-6 md:px-10 md:pb-8 md:pt-24 lg:px-16"
    >
      <div className="absolute inset-0" aria-hidden="true" data-hero-dither="">
        <DitherField
          accents={[5, 3, 2]}
          cell={7}
          maxCols={200}
          speed={0.75}
          shaping={1.2}
          contrast={1.5}
          bias={0.12}
        />
      </div>

      {/* Top label row — solid print chips, legible over any dot. */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
        <span
          className="chip-print animate-in"
          style={{ "--reveal-delay": "60ms" } as React.CSSProperties}
        >
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 bg-[hsl(var(--vivid-3))]"
          />
          {config.heroStatusText}
        </span>

        <span
          className="chip-print animate-in hidden sm:inline-flex"
          style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
        >
          {config.heroTopRight[0]}
          <span aria-hidden="true" className="opacity-40">
            /
          </span>
          {config.heroTopRight[1]}
        </span>
      </div>

      {/* The plate */}
      <div className="relative z-10 flex flex-1 items-center py-7 md:py-10">
        {/* The plate is never animated in: it holds the LCP element, so it
            paints with the first frame and the reveals happen around it. */}
        <div className="plate-print w-full p-5 sm:p-8 md:p-11 lg:p-14">
          {/* colour bar + registration cross */}
          <div className="flex items-start justify-between">
            <span aria-hidden="true" className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((accent) => (
                <span
                  key={accent}
                  className="h-2 w-2"
                  style={{ background: `hsl(var(--vivid-${accent}))` }}
                />
              ))}
            </span>
            <span
              aria-hidden="true"
              className="h-3.5 w-3.5 opacity-45"
              style={{
                backgroundImage:
                  "linear-gradient(hsl(var(--print-ink)) 0 0), linear-gradient(hsl(var(--print-ink)) 0 0)",
                backgroundSize: "100% 1px, 1px 100%",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
          </div>

          <h1 id="hero-name" className="display mt-6 md:mt-9">
            {words.map((word, index) => (
              <span key={`${word}-${index}`} className="block">
                {/* No reveal gate: the name is the LCP element, so it must
                    paint with the first frame instead of after hydration. */}
                <span className="block text-[clamp(2.9rem,15.5vw,9.5rem)]">
                  {word}
                </span>
              </span>
            ))}
          </h1>

          <div
            className="animate-in mt-6 flex items-center gap-3.5 md:mt-8"
            style={{ "--reveal-delay": "240ms" } as React.CSSProperties}
          >
            <span
              aria-hidden="true"
              className="h-2 w-2 shrink-0 bg-[hsl(var(--vivid-3))]"
            />
            <p className="eyebrow opacity-70">{config.tagline}</p>
          </div>

          <div className="rule-print mt-7 flex flex-wrap items-end justify-between gap-x-8 gap-y-5 pt-5 md:mt-10 md:pt-6">
            <div
              className="animate-in flex flex-col gap-1.5"
              style={{ "--reveal-delay": "320ms" } as React.CSSProperties}
            >
              <span className="eyebrow opacity-65">{bottomA}</span>
              <span className="eyebrow hidden opacity-65 sm:block">
                {bottomB}
              </span>
            </div>

            <div
              className="animate-in flex flex-wrap items-center gap-3"
              style={{ "--reveal-delay": "380ms" } as React.CSSProperties}
            >
              <Link href={primaryHref} className="btn-print">
                <ArrowDown size={13} aria-hidden="true" />
                {primaryLabel}
              </Link>

              {secondary?.href ? (
                <a
                  href={secondary.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-print-ghost"
                >
                  {config.heroSecondaryButtonText}
                  <ArrowUpRight size={13} aria-hidden="true" />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
