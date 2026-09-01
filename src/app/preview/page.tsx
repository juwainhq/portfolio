import { Navigation } from "@/components/navigation";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Services } from "@/components/services";
import { PortfolioGrid } from "@/components/portfolio-grid";
import { Highlights } from "@/components/highlights";
import { HowIWork } from "@/components/how-i-work";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { ScrollRevealProvider } from "@/components/scroll-reveal";
import { Toaster } from "@/components/ui/sonner";

export default function PreviewPage() {
  return (
    <ScrollRevealProvider>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main>
          <Hero />
          <About />
          <Services />
          <PortfolioGrid />
          <Highlights />
          <HowIWork />
          <Contact />
        </main>
        <Footer />
        <Toaster />
      </div>
    </ScrollRevealProvider>
  );
}
