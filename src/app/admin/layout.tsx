"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Layers, Link2, ChevronLeft, Save } from "lucide-react";
import { useSiteConfig } from "@/context/site-config";
import { toast } from "sonner";

const navItems = [
  {
    label: "Sections",
    href: "/admin",
    icon: LayoutDashboard,
    description: "Edit page content & section order",
  },
  {
    label: "Projects",
    href: "/admin/projects",
    icon: Layers,
    description: "Add, edit, reorder & manage projects",
  },
  {
    label: "Links",
    href: "/admin/links",
    icon: Link2,
    description: "Navigation, socials & button destinations",
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { save, hasUnsavedChanges, config, reset } = useSiteConfig();

  const handleSave = () => {
    save();
    toast.success("Changes saved", {
      description: "Your edits have been saved to this browser.",
    });
  };

  const handleReset = () => {
    if (confirm("Reset all content to defaults? This cannot be undone.")) {
      reset();
      toast.success("Reset to defaults");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-border flex flex-col">
        {/* Logo / back to site */}
        <div className="p-5 border-b border-border">
          <Link
            href="/"
            className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] hover:opacity-60 transition-opacity duration-200 mb-4"
          >
            <ChevronLeft size={12} />
            Back to Site
          </Link>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Portfolio Editor
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-start gap-3 px-3 py-3 rounded-sm transition-colors duration-150 group ${
                  isActive
                    ? "bg-foreground text-background"
                    : "hover:bg-foreground/5"
                }`}
              >
                <item.icon
                  size={14}
                  className="mt-0.5 shrink-0"
                  strokeWidth={isActive ? 0 : 1.5}
                />
                <div>
                  <p
                    className={`text-[11px] font-medium leading-snug ${
                      isActive ? "" : "text-foreground/70 group-hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </p>
                  <p
                    className={`text-[10px] leading-tight mt-0.5 ${
                      isActive
                        ? "text-background/60"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="p-4 border-t border-border space-y-2">
          <button
            onClick={handleSave}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 text-[11px] uppercase tracking-[0.2em] font-medium transition-all duration-150 ${
              hasUnsavedChanges
                ? "bg-foreground text-background hover:bg-foreground/80"
                : "bg-foreground/10 text-foreground/50 cursor-not-allowed"
            }`}
          >
            <Save size={12} />
            {hasUnsavedChanges ? "Save Changes" : "Saved"}
          </button>
          <button
            onClick={handleReset}
            className="w-full text-center text-[10px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground/60 transition-colors duration-150 py-1"
          >
            Reset to Defaults
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
