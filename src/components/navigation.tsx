"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useSiteConfig } from "@/context/site-config";

export function Navigation() {
  const { config } = useSiteConfig();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const navLinks = config.navLinks.filter((l) => l.showInNav);
  const emailLink = config.socials.find((s) => s.platform === "email");

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? "bg-background/95 backdrop-blur-sm border-b border-foreground/5"
            : "bg-transparent"
        }`}
      >
        <nav className="flex items-center justify-between px-6 md:px-10 lg:px-16 py-4">
          {/* Logo */}
          <Link
            href="/"
            className="text-[12px] md:text-[13px] tracking-[0.15em] uppercase font-medium hover:opacity-40 transition-opacity duration-300"
          >
            {config.name}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[11px] tracking-[0.2em] uppercase font-medium hover:opacity-40 transition-opacity duration-300"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/admin"
              className="text-[10px] tracking-[0.2em] uppercase font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 border-l border-foreground/10 pl-6 ml-2"
            >
              Edit
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-1.5 -mr-1.5 hover:opacity-50 transition-opacity duration-300"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
          </button>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-background transition-all duration-500 md:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <div className="flex flex-col justify-center h-full px-8 py-24">
          <nav className="space-y-0.5">
            {navLinks.map((link, index) => (
              <div
                key={link.href}
                className="overflow-hidden"
                style={{
                  transitionDelay: isOpen ? `${index * 80}ms` : "0ms",
                }}
              >
                <a
                  href={link.href}
                  onClick={handleLinkClick}
                  className={`block text-5xl md:text-6xl font-display tracking-tight uppercase py-2.5 transform transition-all duration-500 ease-out ${
                    isOpen
                      ? "translate-y-0 opacity-100"
                      : "translate-y-full opacity-0"
                  }`}
                  style={{ transitionDelay: isOpen ? `${index * 80 + 150}ms` : "0ms" }}
                >
                  {link.label}
                </a>
              </div>
            ))}
          </nav>

          {/* Mobile Footer Links */}
          <div
            className={`mt-20 pt-8 border-t border-foreground/10 transform transition-all duration-500 ease-out ${
              isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
            }`}
            style={{ transitionDelay: isOpen ? "500ms" : "0ms" }}
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">
              Connect
            </p>
            <div className="space-y-2">
              {emailLink && (
                <a
                  href={emailLink.href}
                  className="block text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors duration-300"
                >
                  Email
                </a>
              )}
              {config.socials
                .filter((s) => s.platform !== "email")
                .map((social) => (
                  <a
                    key={social.platform}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors duration-300"
                  >
                    {social.label}
                  </a>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
