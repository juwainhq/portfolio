export function Footer() {
  return (
    <footer className="py-12 md:py-16 px-6 md:px-10 lg:px-16 border-t border-border/30">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {/* Name */}
          <div className="md:col-span-4">
            <h3 className="text-xl md:text-2xl font-display tracking-tight uppercase">
              Juwain Haque
            </h3>
            <p className="text-xs uppercase tracking-ultra-wide text-muted-foreground mt-2">
              Graphic Designer · Business Consultant
            </p>
          </div>

          {/* Empty Spacer */}
          <div className="hidden md:block md:col-span-3" />

          {/* Copyright */}
          <div className="md:col-span-2">
            <p className="text-xs uppercase tracking-ultra-wide text-muted-foreground">
              © 2026 Juwain Haque
            </p>
          </div>

          {/* Social Links */}
          <div className="md:col-span-3 flex flex-col md:items-end gap-2">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-ultra-wide hover:opacity-50 transition-opacity duration-300"
            >
              Instagram
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-ultra-wide hover:opacity-50 transition-opacity duration-300"
            >
              LinkedIn
            </a>
            <a
              href="https://behance.net"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-ultra-wide hover:opacity-50 transition-opacity duration-300"
            >
              Behance
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
