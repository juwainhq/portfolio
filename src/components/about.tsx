"use client";

import { useReveal } from "@/hooks/use-reveal";

export function About() {
  const sectionRef = useReveal();
  const contentRef = useReveal();

  return (
    <section
      id="about"
      className="py-24 md:py-32 lg:py-40 px-6 md:px-10 lg:px-16 border-t border-border/30"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Label */}
          <div
            ref={sectionRef}
            className="reveal lg:col-span-2"
          >
            <h2 className="text-xs uppercase tracking-ultra-wide font-medium">
              About
            </h2>
          </div>

          {/* Content */}
          <div
            ref={contentRef}
            className="reveal lg:col-span-7 lg:col-start-4"
          >
            <p className="text-xl md:text-2xl lg:text-3xl font-display leading-relaxed tracking-tight mb-8">
              I'm Juwain Haque, a graphic designer and business consultant focused
              on creating strong visual identities and practical strategies that
              help businesses communicate, position themselves, and grow.
            </p>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-12">
              I combine creative thinking with business strategy to turn ideas
              into clear brands, compelling visuals, and useful solutions.
            </p>

            <div className="flex items-center gap-4 pt-8 border-t border-border/30">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs uppercase tracking-ultra-wide">
                Currently available for select projects
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
