import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { projects } from "@/data/projects";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { PortfolioImage } from "@/components/portfolio-image";

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
    project.year ||
    project.services.length > 0 ||
    project.client ||
    project.category;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 md:pt-32">
        {/* Project Header */}
        <div className="px-6 md:px-10 lg:px-16 mb-10 md:mb-14">
          <div className="max-w-[1600px] mx-auto">
            {/* Back Link */}
            <Link
              href="/#work"
              className="group inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] hover:opacity-50 transition-opacity duration-300 mb-14 md:mb-16"
            >
              <ArrowLeft
                size={12}
                className="group-hover:-translate-x-1 transition-transform duration-300"
              />
              <span>Back</span>
            </Link>

            {/* Project Number */}
            <div className="mb-4">
              <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                {project.number}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-[15vw] md:text-[11vw] lg:text-[8vw] xl:text-[6.5vw] font-display leading-[0.85] tracking-[-0.05em] uppercase font-medium mb-10 md:mb-12">
              {project.title}
            </h1>

            {/* Project Meta */}
            {hasMeta && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 pt-8 border-t border-foreground/10">
                {project.category && (
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
                      Category
                    </p>
                    <p className="text-sm">{project.category}</p>
                  </div>
                )}
                {project.year && (
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
                      Year
                    </p>
                    <p className="text-sm">{project.year}</p>
                  </div>
                )}
                {project.services.length > 0 && (
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
                      Services
                    </p>
                    <p className="text-sm">{project.services.join(", ")}</p>
                  </div>
                )}
                {project.client && (
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
                      Client
                    </p>
                    <p className="text-sm">{project.client}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Hero Image — natural aspect ratio, no forced crop */}
        <div className="px-6 md:px-10 lg:px-16 mb-16 md:mb-24">
          <div className="max-w-[1600px] mx-auto">
            <PortfolioImage
              src={project.image}
              alt={project.title}
              fit={project.fit}
              sizes="100vw"
              priority
              unoptimized={project.image.endsWith(".gif")}
              containerClassName="bg-secondary"
            />
          </div>
        </div>

        {/* Gallery Images — each at its natural ratio, no fixed aspect boxes */}
        {project.gallery && project.gallery.length > 0 && (
          <div className="px-6 md:px-10 lg:px-16 mb-24 md:mb-36">
            <div className="max-w-[1600px] mx-auto space-y-8 md:space-y-12">
              {project.gallery.map((src, index) => (
                <div key={index}>
                  <PortfolioImage
                    src={src}
                    alt={`${project.title} — ${index + 2}`}
                    fit={project.galleryFit ?? project.fit}
                    sizes="100vw"
                    unoptimized={src.endsWith(".gif")}
                    containerClassName="bg-secondary"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back to All Work */}
        <div className="px-6 md:px-10 lg:px-16 py-24 md:py-36 border-t border-foreground/10">
          <div className="max-w-[1400px] mx-auto">
            <Link href="/#work" className="group block">
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-4">
                View All
              </p>
              <h3 className="text-4xl md:text-6xl lg:text-8xl font-display tracking-tight uppercase group-hover:translate-x-4 transition-transform duration-700">
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
