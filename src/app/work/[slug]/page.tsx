import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { projects } from "@/data/projects";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const hasMeta =
    project.year || project.services.length > 0 || project.client || project.category;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 md:pt-32">
        {/* Project Header */}
        <div className="px-6 md:px-10 lg:px-16 mb-12 md:mb-16">
          <div className="max-w-[1600px] mx-auto">
            {/* Back Link */}
            <Link
              href="/#work"
              className="group inline-flex items-center gap-3 text-xs uppercase tracking-ultra-wide hover:opacity-50 transition-opacity duration-300 mb-12 md:mb-16"
            >
              <ArrowLeft
                size={14}
                className="group-hover:-translate-x-1 transition-transform duration-300"
              />
              <span>Back to Work</span>
            </Link>

            {/* Project Number */}
            <div className="mb-6">
              <span className="text-xs uppercase tracking-ultra-wide text-muted-foreground">
                {project.number}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-[15vw] md:text-[12vw] lg:text-[9vw] xl:text-[7.5vw] font-display leading-[0.85] tracking-tightest uppercase font-medium mb-8 md:mb-12">
              {project.title}
            </h1>

            {/* Project Meta - only render if data exists */}
            {hasMeta && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 pt-8 border-t border-border/30">
                {project.year && (
                  <div>
                    <p className="text-xs uppercase tracking-ultra-wide text-muted-foreground mb-2">
                      Year
                    </p>
                    <p className="text-sm">{project.year}</p>
                  </div>
                )}
                {project.services.length > 0 && (
                  <div>
                    <p className="text-xs uppercase tracking-ultra-wide text-muted-foreground mb-2">
                      Services
                    </p>
                    <p className="text-sm">{project.services.join(", ")}</p>
                  </div>
                )}
                {project.client && (
                  <div>
                    <p className="text-xs uppercase tracking-ultra-wide text-muted-foreground mb-2">
                      Client
                    </p>
                    <p className="text-sm">{project.client}</p>
                  </div>
                )}
                {project.category && (
                  <div>
                    <p className="text-xs uppercase tracking-ultra-wide text-muted-foreground mb-2">
                      Category
                    </p>
                    <p className="text-sm">{project.category}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Hero Image */}
        <div className="px-6 md:px-10 lg:px-16 mb-16 md:mb-24">
          <div className="max-w-[1600px] mx-auto">
            <div className="relative aspect-[4/3] md:aspect-[16/9] overflow-hidden bg-secondary">
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="100vw"
                className="object-cover"
                priority
                unoptimized={project.image.endsWith(".gif")}
              />
            </div>
          </div>
        </div>

        {/* Gallery Images */}
        {project.gallery && project.gallery.length > 0 && (
          <div className="px-6 md:px-10 lg:px-16 mb-20 md:mb-32 space-y-6 md:space-y-8">
            <div className="max-w-[1600px] mx-auto">
              {project.gallery.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-[4/3] md:aspect-[16/10] overflow-hidden bg-secondary"
                >
                  <Image
                    src={image}
                    alt={`${project.title} - Image ${index + 2}`}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    unoptimized={image.endsWith(".gif")}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back to All Work */}
        <div className="px-6 md:px-10 lg:px-16 py-20 md:py-32 border-t border-border/30">
          <div className="max-w-[1400px] mx-auto">
            <Link href="/#work" className="group block">
              <p className="text-xs uppercase tracking-ultra-wide text-muted-foreground mb-4">
                View All
              </p>
              <h3 className="text-4xl md:text-6xl lg:text-8xl font-display tracking-tightest uppercase group-hover:translate-x-2 transition-transform duration-500">
                All Work →
              </h3>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
