"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSiteConfig } from "@/context/site-config";
import { type SiteConfig } from "@/data/site-config";
import { toast } from "sonner";
import {
  Save,
  RotateCcw,
  ExternalLink,
  LogOut,
  User,
  Image as ImageIcon,
  Link as LinkIcon,
  Type,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  X,
} from "lucide-react";

function TextField({
  label,
  value,
  onChange,
  multiline = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  const base =
    "w-full bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-foreground transition-colors duration-200 placeholder:text-muted-foreground/40";
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1.5">
        {label}
      </label>
      {multiline ? (
        <textarea
          className={`${base} resize-none`}
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          className={base}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const { config, updateConfig, reset, hasUnsavedChanges, save } = useSiteConfig();
  const [activeTab, setActiveTab] = useState<"content" | "projects" | "links" | "sections">("content");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const authCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("admin_auth="))
      ?.split("=")[1];

    if (authCookie !== "true") {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    document.cookie = "admin_auth=false; path=/; max-age=0";
    toast.success("Logged out successfully");
    router.push("/admin/login");
  };

  const handleSave = () => {
    save();
    toast.success("Changes saved", {
      description: "Your changes have been saved to this browser.",
    });
  };

  const handleReset = () => {
    if (confirm("Reset all content to defaults? This cannot be undone.")) {
      reset();
      toast.success("Reset to defaults");
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User size={20} className="text-muted-foreground" />
            <div>
              <h1 className="text-base font-medium">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">Portfolio Editor</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border rounded-md hover:bg-foreground/5 transition-colors"
            >
              <ExternalLink size={12} />
              View Site
            </a>
            <button
              onClick={handleSave}
              disabled={!hasUnsavedChanges}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-foreground text-background rounded-md hover:bg-foreground/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={12} />
              {hasUnsavedChanges ? "Save" : "Saved"}
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border rounded-md hover:bg-foreground/5 transition-colors"
            >
              <RotateCcw size={12} />
              Reset
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border rounded-md hover:bg-foreground/5 transition-colors"
            >
              <LogOut size={12} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 flex gap-1">
          <button
            onClick={() => setActiveTab("content")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "content"
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Type size={14} className="inline mr-2" />
            Content
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "projects"
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <ImageIcon size={14} className="inline mr-2" />
            Projects
          </button>
          <button
            onClick={() => setActiveTab("links")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "links"
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <LinkIcon size={14} className="inline mr-2" />
            Links
          </button>
          <button
            onClick={() => setActiveTab("sections")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "sections"
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Eye size={14} className="inline mr-2" />
            Sections
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "content" && <ContentEditor config={config} update={updateConfig} />}
        {activeTab === "projects" && <ProjectsEditor config={config} update={updateConfig} />}
        {activeTab === "links" && <LinksEditor config={config} update={updateConfig} />}
        {activeTab === "sections" && <SectionsEditor config={config} update={updateConfig} />}
      </main>
    </div>
  );
}

function ContentEditor({ config, update }: { config: SiteConfig; update: (p: Partial<SiteConfig>) => void }) {
  return (
    <div className="space-y-8">
      {/* Identity */}
      <section>
        <h2 className="text-lg font-medium mb-4">Identity</h2>
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField label="Name" value={config.name} onChange={(v) => update({ name: v })} />
            <TextField label="Role" value={config.role} onChange={(v) => update({ role: v })} />
          </div>
          <TextField label="Tagline" value={config.tagline} onChange={(v) => update({ tagline: v })} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField label="Established" value={config.established} onChange={(v) => update({ established: v })} />
            <TextField label="Location" value={config.location} onChange={(v) => update({ location: v })} />
          </div>
        </div>
      </section>

      {/* Hero */}
      <section>
        <h2 className="text-lg font-medium mb-4">Hero Section</h2>
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField label="Status" value={config.heroStatusText} onChange={(v) => update({ heroStatusText: v })} />
            <TextField label="Button" value={config.heroButtonText} onChange={(v) => update({ heroButtonText: v })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField label="Top Right L1" value={config.heroTopRight[0]} onChange={(v) => update({ heroTopRight: [v, config.heroTopRight[1]] })} />
            <TextField label="Top Right L2" value={config.heroTopRight[1]} onChange={(v) => update({ heroTopRight: [config.heroTopRight[0], v] })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField label="Bottom Left L1" value={config.heroBottomLeft[0]} onChange={(v) => update({ heroBottomLeft: [v, config.heroBottomLeft[1]] })} />
            <TextField label="Bottom Left L2" value={config.heroBottomLeft[1]} onChange={(v) => update({ heroBottomLeft: [config.heroBottomLeft[0], v] })} />
          </div>
        </div>
      </section>

      {/* About */}
      <section>
        <h2 className="text-lg font-medium mb-4">About Section</h2>
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <TextField label="Heading" value={config.aboutHeading} onChange={(v) => update({ aboutHeading: v })} multiline />
          <TextField label="Body" value={config.aboutBody} onChange={(v) => update({ aboutBody: v })} multiline />
          <TextField label="Status" value={config.aboutStatusText} onChange={(v) => update({ aboutStatusText: v })} />
        </div>
      </section>

      {/* Services */}
      <section>
        <h2 className="text-lg font-medium mb-4">Services</h2>
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <TextField label="Section Heading" value={config.servicesHeading} onChange={(v) => update({ servicesHeading: v })} />
          <div className="space-y-3">
            {config.services.map((s, i) => (
              <div key={i} className="border border-border rounded-md p-4 space-y-3">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Service {s.number}</p>
                <TextField label="Title" value={s.title} onChange={(v) => update({ services: config.services.map((x, idx) => idx === i ? { ...x, title: v } : x) })} />
                <TextField label="Description" value={s.description} onChange={(v) => update({ services: config.services.map((x, idx) => idx === i ? { ...x, description: v } : x) })} multiline />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section>
        <h2 className="text-lg font-medium mb-4">Contact</h2>
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <TextField label="Heading" value={config.contactHeading} onChange={(v) => update({ contactHeading: v })} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField label="Title L1" value={config.contactTitleLine1} onChange={(v) => update({ contactTitleLine1: v })} />
            <TextField label="Title L2" value={config.contactTitleLine2} onChange={(v) => update({ contactTitleLine2: v })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField label="Button" value={config.contactSubmitText} onChange={(v) => update({ contactSubmitText: v })} />
            <TextField label="Success" value={config.contactSuccessMessage} onChange={(v) => update({ contactSuccessMessage: v })} />
          </div>
          <TextField label="Email" value={config.contactFormRecipient} onChange={(v) => update({ contactFormRecipient: v })} />
        </div>
      </section>
    </div>
  );
}

function ProjectsEditor({ config, update }: { config: SiteConfig; update: (p: Partial<SiteConfig>) => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Projects ({config.projects.length})</h2>
      {config.projects.map((project, i) => (
        <div key={i} className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Project {project.number}: {project.title}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField label="Title" value={project.title} onChange={(v) => update({ projects: config.projects.map((p, idx) => idx === i ? { ...p, title: v } : p) })} />
            <TextField label="Slug" value={project.slug} onChange={(v) => update({ projects: config.projects.map((p, idx) => idx === i ? { ...p, slug: v } : p) })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TextField label="Category" value={project.category} onChange={(v) => update({ projects: config.projects.map((p, idx) => idx === i ? { ...p, category: v } : p) })} />
            <TextField label="Year" value={project.year} onChange={(v) => update({ projects: config.projects.map((p, idx) => idx === i ? { ...p, year: v } : p) })} />
            <TextField label="Client" value={project.client} onChange={(v) => update({ projects: config.projects.map((p, idx) => idx === i ? { ...p, client: v } : p) })} />
          </div>
          <TextField label="Description" value={project.description} onChange={(v) => update({ projects: config.projects.map((p, idx) => idx === i ? { ...p, description: v } : p) })} multiline />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField label="Image" value={project.image} onChange={(v) => update({ projects: config.projects.map((p, idx) => idx === i ? { ...p, image: v } : p) })} />
            <TextField label="Layout" value={project.layout} onChange={(v) => update({ projects: config.projects.map((p, idx) => idx === i ? { ...p, layout: v as any } : p) })} />
          </div>
        </div>
      ))}
    </div>
  );
}

function LinksEditor({ config, update }: { config: SiteConfig; update: (p: Partial<SiteConfig>) => void }) {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-lg font-medium mb-4">Navigation Links</h2>
        <div className="bg-card border border-border rounded-lg p-6 space-y-3">
          {config.navLinks.map((link, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={link.showInNav || false}
                onChange={(e) => update({ navLinks: config.navLinks.map((l, idx) => idx === i ? { ...l, showInNav: e.target.checked } : l) })}
                className="w-4 h-4"
              />
              <input
                value={link.label}
                onChange={(e) => update({ navLinks: config.navLinks.map((l, idx) => idx === i ? { ...l, label: e.target.value } : l) })}
                placeholder="Label"
                className="flex-1 bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-foreground"
              />
              <input
                value={link.href}
                onChange={(e) => update({ navLinks: config.navLinks.map((l, idx) => idx === i ? { ...l, href: e.target.value } : l) })}
                placeholder="URL"
                className="flex-1 bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-foreground"
              />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-4">Social Links</h2>
        <div className="bg-card border border-border rounded-lg p-6 space-y-3">
          {config.socials.map((social, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-wider text-muted-foreground w-20">{social.platform}</span>
              <input
                value={social.label}
                onChange={(e) => update({ socials: config.socials.map((s, idx) => idx === i ? { ...s, label: e.target.value } : s) })}
                placeholder="Label"
                className="flex-1 bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-foreground"
              />
              <input
                value={social.href}
                onChange={(e) => update({ socials: config.socials.map((s, idx) => idx === i ? { ...s, href: e.target.value } : s) })}
                placeholder="URL"
                className="flex-1 bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-foreground"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionsEditor({ config, update }: { config: SiteConfig; update: (p: Partial<SiteConfig>) => void }) {
  const moveSection = (id: string, direction: "up" | "down") => {
    const idx = config.sections.findIndex((s) => s.id === id);
    if (idx < 0) return;
    const next = [...config.sections];
    if (direction === "up" && idx > 0) [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    else if (direction === "down" && idx < next.length - 1) [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    update({ sections: next });
  };

  const toggleSection = (id: string) => {
    update({ sections: config.sections.map((s) => s.id === id ? { ...s, visible: !s.visible } : s) });
  };

  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Section Order & Visibility</h2>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {config.sections.map((section, idx) => (
          <div key={section.id} className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-b-0">
            <button
              onClick={() => toggleSection(section.id)}
              className="text-muted-foreground hover:text-foreground"
              title={section.visible ? "Hide" : "Show"}
            >
              {section.visible ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
            <span className={`flex-1 text-sm ${section.visible ? "" : "opacity-50"}`}>
              {section.label}
            </span>
            <button
              onClick={() => moveSection(section.id, "up")}
              disabled={idx === 0}
              className="p-1 hover:bg-foreground/5 disabled:opacity-30"
            >
              <ArrowUp size={12} />
            </button>
            <button
              onClick={() => moveSection(section.id, "down")}
              disabled={idx === config.sections.length - 1}
              className="p-1 hover:bg-foreground/5 disabled:opacity-30"
            >
              <ArrowDown size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}