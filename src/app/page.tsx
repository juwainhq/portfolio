"use client";

import { Toaster } from "@/components/ui/sonner";
import { Navigation } from "@/components/navigation";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Services } from "@/components/services";
import { FeaturedWork } from "@/components/featured-work";
import { Highlights } from "@/components/highlights";
import { HowIWork } from "@/components/how-i-work";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { ScrollRevealProvider } from "@/components/scroll-reveal";
import { useSiteConfig } from "@/context/site-config";
import Link from "next/link";

function PageContent() {
  const { config } = useSiteConfig();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        {config.sections
          .filter((s) => s.visible)
          .map((section) => {
            switch (section.id) {
              case "hero":
                return <Hero key={section.id} />;
              case "about":
                return <About key={section.id} />;
              case "services":
                return <Services key={section.id} />;
              case "work":
                return <FeaturedWork key={section.id} />;
              case "highlights":
                return <Highlights key={section.id} />;
              case "how-i-work":
                return <HowIWork key={section.id} />;
              case "contact":
                return <Contact key={section.id} />;
              default:
                return null;
            }
          })}

        {/* Home Page View All Works Button — Large CTA */}
        <div className="reveal px-6 md:px-10 lg:px-16 py-16 md:py-24 lg:py-32">
          <div className="max-w-[1600px] mx-auto">
            <Link
              href="/work"
              className="group block text-center"
              aria-label="View all works"
            >
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-6 md:mb-8">
                Continue Exploring
              </p>
              <h2 className="flex items-center justify-center gap-4 md:gap-6 text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-display tracking-tight uppercase font-medium leading-[0.85] transition-all duration-700 ease-out group-hover:translate-x-3 md:group-hover:translate-x-6">
                <span>View All Works</span>
                <span
                  className="inline-block transition-transform duration-700 ease-out group-hover:translate-x-2 group-hover:-translate-y-2"
                  aria-hidden="true"
                >
                  →
                </span>
              </h2>
              <div className="mt-8 md:mt-10 flex items-center justify-center gap-4">
                <span className="block h-px w-12 md:w-20 bg-foreground/40 transition-all duration-700 ease-out group-hover:w-24 md:group-hover:w-40" aria-hidden="true" />
                <span className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-muted-foreground transition-colors duration-500 group-hover:text-foreground">
                  See the full archive
                </span>
              </div>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default function Home() {
  return (
    <ScrollRevealProvider>
      <PageContent />
    </ScrollRevealProvider>
  );
}
