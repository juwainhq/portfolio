export function Footer() {
  return (
    <footer className="py-12 md:py-14 px-6 md:px-10 lg:px-16 border-t border-foreground/10">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-baseline">
          {/* Name */}
          <div className="md:col-span-4">
            <h3 className="text-base md:text-lg font-display tracking-tight uppercase">
              Juwain Haque
            </h3>
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-2">
              Graphic Designer · Business Consultant
            </p>
          </div>

          {/* Spacer */}
          <div className="hidden md:block md:col-span-3" />

          {/* Copyright */}
          <div className="md:col-span-2">
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              © 2025 All Rights Reserved
            </p>
          </div>

          {/* Social Links */}
          <div className="md:col-span-3 flex flex-row md:justify-end gap-6">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] uppercase tracking-[0.25em] hover:opacity-50 transition-opacity duration-300"
            >
              Instagram
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] uppercase tracking-[0.25em] hover:opacity-50 transition-opacity duration-300"
            >
              LinkedIn
            </a>
            <a
              href="https://behance.net"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] uppercase tracking-[0.25em] hover:opacity-50 transition-opacity duration-300"
            >
              Behance
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
