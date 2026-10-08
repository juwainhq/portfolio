"use client";

import { useEffect, useState } from "react";
import { useSiteConfig } from "@/context/site-config";

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
      <div className="mx-auto max-w-[1400px] px-5 py-12 sm:px-6 md:px-10 md:py-16 lg:px-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="md:col-span-5">
            <h2 className="display text-[clamp(1.5rem,4vw,2.25rem)]">
              {config.footerBusinessName}
            </h2>
            <p className="eyebrow mt-3 text-muted-foreground">
              {config.footerTagline}
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow text-muted-foreground">
              © {year} {rest || "All rights reserved"}
            </p>
          </div>

          <nav
            aria-label="Social"
            className="flex flex-wrap gap-x-6 gap-y-3 md:col-span-4 md:justify-end"
          >
            {config.socials.map((social) => (
              <a
                key={social.platform}
                href={social.href}
                target={social.platform === "email" ? undefined : "_blank"}
                rel={social.platform === "email" ? undefined : "noopener noreferrer"}
                className="link-underline text-xs uppercase tracking-[0.2em] text-foreground"
              >
                {social.platform}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
