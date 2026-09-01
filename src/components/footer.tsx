"use client";

import Link from "next/link";
import { useSiteConfig } from "@/context/site-config";

export function Footer() {
  const { config } = useSiteConfig();

  return (
    <footer className="py-12 md:py-14 px-6 md:px-10 lg:px-16 border-t border-foreground/10">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-baseline">
          {/* Name */}
          <div className="md:col-span-4">
            <h3 className="text-base md:text-lg font-display tracking-tight uppercase">
              {config.name}
            </h3>
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-2">
              {config.footerTagline}
            </p>
          </div>

          {/* Spacer */}
          <div className="hidden md:block md:col-span-3" />

          {/* Copyright + editor link */}
          <div className="md:col-span-2">
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              {config.footerCopyright}
            </p>
            <Link
              href="/admin"
              className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60 hover:text-foreground transition-colors duration-200 mt-1 inline-block"
              title="Edit site content"
            >
              Edit
            </Link>
          </div>

          {/* Social Links */}
          <div className="md:col-span-3 flex flex-row md:justify-end gap-6">
            {config.socials
              .filter((s) => s.platform !== "email")
              .map((social) => (
                <a
                  key={social.platform}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] uppercase tracking-[0.25em] hover:opacity-50 transition-opacity duration-300"
                >
                  {social.platform.charAt(0).toUpperCase() + social.platform.slice(1)}
                </a>
              ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
