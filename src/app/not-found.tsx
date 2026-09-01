import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 md:px-10 lg:px-16">
      <div className="text-center">
        <h1 className="text-[20vw] md:text-[15vw] font-display tracking-tight uppercase leading-[0.85] mb-6 md:mb-8">
          404
        </h1>
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-12">
          Page not found
        </p>
        <Link
          href="/"
          className="group inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] hover:opacity-50 transition-opacity duration-300"
        >
          <ArrowLeft
            size={12}
            className="group-hover:-translate-x-1 transition-transform duration-300"
          />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
