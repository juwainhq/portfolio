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
