"use client";

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
import { DitherCursor } from "@/components/dither-cursor";
import { useSiteConfig } from "@/context/site-config";

function PageContent() {
  const { config } = useSiteConfig();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main id="main">
        {config.sections
          .filter((section) => section.visible)
          .map((section) => {
            const content = (() => {
              switch (section.id) {
                case "hero":
                  return <Hero />;
                case "about":
                  return <About />;
                case "services":
                  return <Services />;
                case "work":
                  return <FeaturedWork />;
                case "highlights":
                  return <Highlights />;
                case "how-i-work":
                  return <HowIWork />;
                case "contact":
                  return <Contact />;
                default:
                  return null;
              }
            })();

            if (!content) return null;

            return <div key={section.id}>{content}</div>;
          })}
      </main>
      <Footer />
      <DitherCursor />
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
