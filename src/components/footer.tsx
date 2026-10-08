"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useSiteConfig } from "@/context/site-config";

/**
 * Footer.
 *
 * Closes the page like a print colophon: the practice name big, the socials
 * listed on a hairline column, a back-to-top item, and the copyright line
 * (year filled in on the client so it never goes stale).
 */
export function Footer() {
  const { config } = useSiteConfig();
  const [year, setYear] = useState("");

  // Rendered empty on the server (no build-time year to go stale) and filled
  // in on the client, so the notice always shows the current year.
  useEffect(() => {
    setYear(String(new Date().getFullYear()));
  }, []);

  const rest = config.footerCopyright.replace(/©\s*\d{4}\s*/g, "").trim();

  return (
    <footer className="relative [border-top:var(--hairline)_solid_hsl(var(--border))]">
      <div className="mx-auto max-w-[1400px] px-5 pb-10 pt-[calc(var(--section-y)*0.7)] sm:px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-6">
            <h2 className="display text-[clamp(2rem,5.5vw,3.5rem)]">
              {config.footerBusinessName}
            </h2>
            <p className="eyebrow mt-4 text-muted-foreground">
              {config.footerTagline}
            </p>
          </div>

          <nav
            aria-label="Social"
            className="flex flex-col gap-3 md:col-span-3 md:col-start-8"
          >
            <p className="meta">Elsewhere</p>
            {config.socials.map((social) => (
              <a
                key={social.platform}
                href={social.href}
                target={social.platform === "email" ? undefined : "_blank"}
                rel={social.platform === "email" ? undefined : "noopener noreferrer"}
                className="link-underline self-start text-sm uppercase tracking-[0.18em]"
              >
                {social.platform}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-3 md:col-span-2 md:col-start-11 md:items-end">
            <p className="meta">Back to top</p>
            <a
              href="#hero"
              className="group inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em]"
            >
              Top
              <ArrowUp
                size={14}
                aria-hidden="true"
                className="transition-transform duration-500 ease-out-expo group-hover:-translate-y-1"
              />
            </a>
          </div>
        </div>

        <div className="rule mt-12 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 pt-5 md:mt-16">
          <p className="meta">
            © {year} {rest || "All rights reserved"}
          </p>
          <p className="meta hidden sm:block">{config.footerBusinessLink.replace(/^https?:\/\//, "")}</p>
        </div>
      </div>
    </footer>
  );
}
