"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
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

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-background/95 backdrop-blur-sm" : "bg-transparent"
        }`}
      >
        <nav className="flex items-center justify-between px-6 md:px-10 lg:px-16 py-5">
          <Link
            href="/"
            className="font-display text-sm tracking-tightest uppercase font-medium hover:opacity-50 transition-opacity duration-300"
          >
            Juwain Haque
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs uppercase tracking-ultra-wide font-medium hover:opacity-50 transition-opacity duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 -mr-2 hover:opacity-50 transition-opacity duration-300"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-background transition-all duration-500 md:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="flex flex-col justify-center h-full px-6 py-20">
          <div className="space-y-2">
            {navLinks.map((link, index) => (
              <div
                key={link.label}
                className="overflow-hidden"
                style={{
                  transitionDelay: isOpen ? `${index * 100}ms` : "0ms",
                }}
              >
                <Link
                  href={link.href}
                  onClick={handleLinkClick}
                  className={`block text-4xl md:text-5xl font-display tracking-tightest uppercase py-3 transform transition-all duration-500 ${
                    isOpen
                      ? "translate-y-0 opacity-100"
                      : "translate-y-full opacity-0"
                  }`}
                >
                  {link.label}
                </Link>
              </div>
            ))}
          </div>

          <div
            className={`mt-16 pt-8 border-t border-border/30 transform transition-all duration-500 delay-300 ${
              isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
            }`}
          >
            <p className="text-xs uppercase tracking-ultra-wide text-muted-foreground mb-4">
              Connect
            </p>
            <div className="space-y-2">
              <a
                href="mailto:hello@juwainhaque.com"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                Email
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                Instagram
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
