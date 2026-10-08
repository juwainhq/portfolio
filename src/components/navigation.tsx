"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useSiteConfig } from "@/context/site-config";
import { ThemeToggle } from "@/components/theme-toggle";
import type { NavLink } from "@/data/site-config";

const SECTION_OFFSET = 130; // px below the top where a section counts as "current"

function hrefFor(link: NavLink, isHome: boolean): string {
  if (link.kind === "section" && !isHome) return `/${link.href}`; // "#about" -> "/#about"
  return link.href;
}

export function Navigation() {
  const { config } = useSiteConfig();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState("");

  const navLinks = config.navLinks.filter((link) => link.showInNav);
  const emailLink = config.socials.find((social) => social.platform === "email");

  /* --- sticky state + current-section highlighting --------------------- */
  useEffect(() => {
    const sectionIds = navLinks
      .filter((link) => link.kind === "section")
      .map((link) => link.href.replace(/^.*#/, ""));

    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 24);

      if (!isHome) return;
      // Pick the section whose top is closest to (but above) the offset line.
      // Iterating nav order would let a section further up the page win.
      let current = "";
      let bestTop = -Infinity;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= SECTION_OFFSET && top > bestTop) {
          bestTop = top;
          current = id;
        }
      }
      // At the very bottom of the page the last section stays highlighted even
      // if its top never crosses the offset line.
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4
      ) {
        current = sectionIds[sectionIds.length - 1] ?? current;
      }
      setActiveId(current);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHome, config.navLinks]);

  /* --- mobile menu ------------------------------------------------------ */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  const close = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:[border:var(--hairline-strong)_solid_hsl(var(--foreground))] focus:bg-background focus:px-4 focus:py-2 focus:text-xs focus:uppercase focus:tracking-[0.2em]"
      >
        Skip to content
      </a>

      <header
        className="site-nav nav-glass fixed inset-x-0 top-0 z-50"
        data-scrolled={scrolled}
        data-open={isOpen}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-[var(--nav-h)] max-w-[1600px] items-center justify-between gap-4 px-5 sm:px-6 md:px-10 lg:px-16"
        >
          <Link
            href="/"
            className="display shrink-0 text-[15px] tracking-[-0.02em] text-foreground transition-colors duration-200 hover:text-ink-2 md:text-[17px]"
            onClick={close}
          >
            {config.name}
          </Link>

          <div className="hidden items-center gap-8 md:flex lg:gap-10">
            {navLinks.map((link) => {
              const href = hrefFor(link, isHome);
              const id = link.href.replace(/^.*#/, "");
              const isCurrent = link.kind === "section" && activeId === id;
              const external = /^https?:/.test(href);
              return (
                <Link
                  key={`${link.label}-${link.href}`}
                  href={href}
                  aria-current={isCurrent ? "location" : undefined}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="nav-link text-[11px] font-medium uppercase tracking-[0.2em]"
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle data-theme-toggle="desktop" />
            <button
              type="button"
              onClick={() => setIsOpen((open) => !open)}
              className="-mr-1 inline-flex h-9 w-9 items-center justify-center text-foreground [border:var(--hairline)_solid_hsl(var(--border))] transition-colors duration-200 hover:border-ink-2 hover:text-ink-2 md:hidden"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? (
                <X size={16} aria-hidden="true" />
              ) : (
                <Menu size={16} aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu — only mounted while open so nothing inside is focusable
          when it is closed. */}
      {isOpen ? (
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className="fixed inset-0 z-40 bg-background md:hidden"
      >
        <div className="flex h-full flex-col justify-between overflow-y-auto px-6 pb-10 pt-[calc(var(--nav-h)+2rem)]">
          <nav aria-label="Sections" className="flex flex-col">
            {navLinks.map((link, index) => {
              const href = hrefFor(link, isHome);
              const id = link.href.replace(/^.*#/, "");
              const isCurrent = link.kind === "section" && activeId === id;
              return (
                <Link
                  key={`m-${link.label}-${link.href}`}
                  href={href}
                  onClick={close}
                  aria-current={isCurrent ? "location" : undefined}
                  style={{ "--reveal-delay": `${index * 60}ms` } as React.CSSProperties}
                  className={`display animate-in flex items-baseline justify-between py-4 [border-bottom:var(--hairline)_solid_hsl(var(--border))] text-[13vw] leading-[0.95] text-foreground transition-colors duration-200 active:text-ink-2 ${
                    isCurrent ? "text-ink-2" : ""
                  }`}
                >
                  {link.label}
                  <ArrowUpRight
                    size={20}
                    aria-hidden="true"
                    className="shrink-0 opacity-40"
                  />
                </Link>
              );
            })}
          </nav>

          <div className="mt-12 space-y-3">
            <p className="eyebrow text-muted-foreground">Connect</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {emailLink ? (
                <a
                  href={emailLink.href}
                  className="link-underline text-sm text-foreground"
                >
                  {emailLink.label}
                </a>
              ) : null}
              {config.socials
                .filter((social) => social.platform !== "email")
                .map((social) => (
                  <a
                    key={social.platform}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-sm text-foreground"
                  >
                    {social.label}
                  </a>
                ))}
            </div>
          </div>
        </div>
      </div>
      ) : null}
    </>
  );
}
