"use client";

import { useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const scrollY = window.scrollY;
      const elements = containerRef.current.querySelectorAll(".parallax");
      
      elements.forEach((el, index) => {
        const speed = 0.1 + index * 0.05;
        const yPos = scrollY * speed;
        (el as HTMLElement).style.transform = `translateY(${yPos}px)`;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const elements = containerRef.current?.querySelectorAll(".animate-in");
    if (!elements) return;

    elements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add("active");
      }, 200 + index * 150);
    });
  }, []);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-center px-6 md:px-10 lg:px-16 pt-20 overflow-hidden"
    >
      {/* Background Grid Pattern - subtle */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }} />
      </div>

      <div className="relative z-10">
        {/* Main Title - Oversized */}
        <div className="overflow-hidden mb-4 md:mb-6">
          <h1
            className="animate-in font-display text-[12vw] md:text-[10vw] lg:text-[8vw] xl:text-[7vw] leading-[0.85] tracking-tightest uppercase font-medium"
            style={{ opacity: 0 }}
          >
            Juwain
          </h1>
        </div>

        <div className="overflow-hidden mb-8 md:mb-12">
          <h1
            className="animate-in font-display text-[12vw] md:text-[10vw] lg:text-[8vw] xl:text-[7vw] leading-[0.85] tracking-tightest uppercase font-medium"
            style={{ opacity: 0, transitionDelay: "100ms" }}
          >
            Haque
          </h1>
        </div>

        {/* Subtitle Row */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-0 mb-12 md:mb-16">
          <div
            className="animate-in overflow-hidden"
            style={{ transitionDelay: "300ms", opacity: 0 }}
          >
            <p className="text-sm md:text-base uppercase tracking-ultra-wide font-medium">
              Graphic Designer
            </p>
            <p className="text-sm md:text-base uppercase tracking-ultra-wide font-medium">
              Business Consultant
            </p>
          </div>

          {/* Availability Badge */}
          <div
            className="animate-in flex items-center gap-3"
            style={{ transitionDelay: "400ms", opacity: 0 }}
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs uppercase tracking-ultra-wide">
              Available for Projects
            </span>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          className="animate-in hidden md:block"
          style={{ transitionDelay: "600ms", opacity: 0 }}
        >
          <button
            onClick={scrollToAbout}
            className="group flex items-center gap-4 cursor-pointer hover:opacity-50 transition-opacity duration-300"
            aria-label="Scroll to content"
          >
            <span className="text-xs uppercase tracking-ultra-wide">
              Scroll
            </span>
            <ArrowDown
              size={16}
              className="group-hover:translate-y-1 transition-transform duration-300"
            />
          </button>
        </div>
      </div>

      {/* Decorative Element - Bottom Right */}
      <div className="absolute bottom-8 right-6 md:right-10 lg:right-16 hidden md:block">
        <div className="parallax opacity-20">
          <div className="w-[1px] h-24 bg-foreground" />
        </div>
      </div>

      {/* Year Marker */}
      <div className="absolute bottom-8 left-6 md:left-10 lg:left-16">
        <span className="text-xs uppercase tracking-ultra-wide text-muted-foreground">
          2025
        </span>
      </div>
    </section>
  );
}
