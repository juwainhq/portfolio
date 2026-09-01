"use client";

import { useReveal } from "@/hooks/use-reveal";

const steps = [
  {
    number: "01",
    title: "Understand",
    description: "Understand the business, audience and problem.",
  },
  {
    number: "02",
    title: "Define",
    description:
      "Turn the problem into a clear strategy and visual direction.",
  },
  {
    number: "03",
    title: "Create",
    description:
      "Build a visual solution that looks strong and works for the business.",
  },
];

export function HowIWork() {
  const labelRef = useReveal();
  const listRef = useReveal();

  return (
    <section className="py-24 md:py-32 lg:py-40 px-6 md:px-10 lg:px-16">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-16 md:mb-24">
          <h2
            ref={labelRef}
            className="reveal text-xs uppercase tracking-ultra-wide font-medium"
          >
            How I Work
          </h2>
        </div>

        {/* Steps */}
        <div
          ref={listRef}
          className="reveal grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-16"
        >
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="group"
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="border-t border-border/50 pt-6 md:pt-8 h-full">
                <span className="text-xs uppercase tracking-ultra-wide text-muted-foreground block mb-6">
                  {step.number}
                </span>
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-display tracking-tight mb-4">
                  {step.title}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-[320px]">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
