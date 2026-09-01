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
    <section className="py-28 md:py-40 lg:py-48 px-6 md:px-10 lg:px-16">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-16 md:mb-20 lg:mb-24">
          <h2
            ref={labelRef}
            className="reveal text-[10px] uppercase tracking-[0.3em] font-medium"
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
              className="group border-t border-foreground/10 pt-6 md:pt-8"
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground block mb-8 md:mb-10">
                {step.number}
              </span>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-display tracking-tight mb-4 md:mb-5">
                {step.title}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-[320px]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
