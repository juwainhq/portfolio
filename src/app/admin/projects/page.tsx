"use client";

import { useSiteConfig } from "@/context/site-config";
import { Project, SectionConfig, type SiteConfig } from "@/data/site-config";
import {
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  GripVertical,
  ArrowRight,
  ExternalLink,
  X,
  Monitor,
  Smartphone,
  CheckCircle2,
  Star,
  StarOff,
  Trash2,
  Edit,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { PortfolioGrid } from "@/components/portfolio-grid";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Services } from "@/components/services";
import { Highlights } from "@/components/highlights";
import { HowIWork } from "@/components/how-i-work";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { ScrollRevealProvider } from "@/components/scroll-reveal";

// ─── Field helpers ───────────────────────────────────────────────────────────

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

function ProjectCard({
  project,
  onEdit,
  onDelete,
  onToggleFeatured,
  onToggleHighlight,
  onToggleHidden,
}: {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFeatured: () => void;
  onToggleHighlight: () => void;
  onToggleHidden: () => void;
}) {
  return (
    <div className="group flex items-center gap-2 px-3 py-2 border-b border-border cursor-pointer transition-colors duration-150 hover:bg-foreground/[0.02]">
      <div className="w-12 h-12 rounded-sm overflow-hidden bg-foreground/5 shrink-0 flex items-center justify-center">
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
            {project.number}
          </span>
          {project.featured && (
            <Star size={9} className="text-muted-foreground fill-current" />
          )}
        </div>
        <p className="text-sm font-medium truncate">{project.title}</p>
        <p className="text-[10px] text-muted-foreground truncate mt-0.5">
          {project.category} · {project.year}
        </p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onToggleFeatured}
          className="p-1 hover:bg-foreground/5 rounded-sm transition-colors duration-150"
          title={project.featured ? "Remove from featured" : "Mark as featured"}
        >
          {project.featured ? (
            <Star size={13} className="fill-current" />
          ) : (
            <StarOff size={13} className="text-muted-foreground" />
          )}
        </button>
        <button
          onClick={onToggleHighlight}
          className="p-1 hover:bg-foreground/5 rounded-sm transition-colors duration-150"
          title={project.highlight ? "Remove from highlights" : "Add to highlights"}
        >
          <span className="text-[9px] font-medium">HL</span>
        </button>
        <button
          onClick={onToggleHidden}
          className="p-1 hover:bg-foreground/5 rounded-sm transition-colors duration-150"
          title={project.hidden ? "Show project" : "Hide project"}
        >
          {project.hidden ? (
            <EyeOff size={13} className="text-muted-foreground" />
          ) : (
            <Eye size={13} className="text-muted-foreground" />
          )}
        </button>
        <button
          onClick={onEdit}
          className="p-1 hover:bg-foreground/5 rounded-sm transition-colors duration-150"
          title={`Edit "${project.title}"`}
        >
          <Edit size={13} />
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-1 px-2 py-1 text-[10px] uppercase tracking-[0.15em] text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-sm transition-colors duration-150"
          title={`Delete "${project.title}"`}
        >
          <Trash2 size={11} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}

// ─── Project editor ──────────────────────────────────────────────────────────

function ProjectEditor({
  project,
  projects,
  onSave,
  onCancel,
}: {
  project: Partial<Project>;
  projects: Project[];
  onSave: (p: Project) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Partial<Project>>({ ...project });
  const set = (field: keyof Project, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!form.slug || !form.title) {
      toast.error("Project must have a slug and title");
      return;
    }
    
    const completeProject: Project = {
      slug: form.slug,
      number: form.number || "00",
      title: form.title,
      category: form.category || "",
      description: form.description || "",
      year: form.year || "",
      client: form.client || "",
      services: form.services || [],
      layout: form.layout || "portrait",
      fit: form.fit || "contain",
      featured: form.featured || false,
      highlight: form.highlight || false,
      image: form.image || "/work-1.jpg",
      gallery: form.gallery || [],
      galleryFit: form.galleryFit || "contain",
    };
    
    onSave(completeProject);
  };

  const AVAILABLE_IMAGES = ["/work-1.jpg", "/work-3.jpg", "/work-4.jpg", "/work-8.jpg", "/work-8.webp", "/work-9.webp"];

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField
          label="Slug (URL identifier)"
          value={form.slug || ""}
          onChange={(v) => set("slug", v)}
          placeholder="project-01"
        />
        <TextField
          label="Number"
          value={form.number || ""}
          onChange={(v) => set("number", v)}
          placeholder="01"
        />
      </div>
      <TextField
        label="Title"
        value={form.title || ""}
        onChange={(v) => set("title", v)}
        placeholder="Project title"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField
          label="Category"
          value={form.category || ""}
          onChange={(v) => set("category", v)}
          placeholder="Visual Identity"
        />
        <TextField
          label="Year"
          value={form.year || ""}
          onChange={(v) => set("year", v)}
          placeholder="2024"
        />
      </div>
      <TextField
        label="Description"
        value={form.description || ""}
        onChange={(v) => set("description", v)}
        multiline
        placeholder="Project description"
      />
      <TextField
        label="Client"
        value={form.client || ""}
        onChange={(v) => set("client", v)}
        placeholder="Client name"
      />
      <TextField
        label="Services"
        value={form.services?.join(", ") || ""}
        onChange={(v) => set("services", v.split(",").map(s => s.trim()))}
        placeholder="Service 1, Service 2"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1.5">
            Layout
          </label>
          <select
            className="w-full bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-foreground transition-colors duration-200"
            value={form.layout || "portrait"}
            onChange={(e) => set("layout", e.target.value)}
          >
            <option value="featured">Featured (full width)</option>
            <option value="portrait">Portrait</option>
            <option value="wide">Wide</option>
            <option value="square">Square</option>
            <option value="gallery">Gallery</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1.5">
            Fit
          </label>
          <select
            className="w-full bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-foreground transition-colors duration-200"
            value={form.fit || "contain"}
            onChange={(e) => set("fit", e.target.value)}
          >
            <option value="contain">Contain (no crop)</option>
            <option value="cover">Cover (cropped)</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1.5">
          Hero Image *
        </label>
        <select
          className="w-full bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-foreground transition-colors duration-200"
          value={form.image || "/work-1.jpg"}
          onChange={(e) => set("image", e.target.value)}
        >
          {AVAILABLE_IMAGES.map((img) => {
            const usedByOther = projects.find(
              (p) => p.slug !== form.slug && p.image === img
            );
            return (
              <option key={img} value={img}>
                {img} {usedByOther ? " — (also used by another project)" : ""}
              </option>
            );
          })}
        </select>
        <p className="text-[9px] text-muted-foreground mt-1">
          Upload new images by adding files to the <code className="bg-foreground/5 px-1">public/</code> folder.
        </p>
        {projects.find(
          (p) => p.slug !== form.slug && p.image === form.image
        ) && (
          <div className="mt-2 px-2 py-1.5 border border-amber-500/30 bg-amber-500/5 rounded-sm">
            <p className="text-[10px] text-amber-200/80 leading-relaxed">
              <strong className="font-semibold">Heads up:</strong> This image is currently used by another project. 
              Each project should have its own unique hero image.
            </p>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="featured"
          checked={form.featured}
          onChange={(e) => set("featured", e.target.checked)}
          className="w-4 h-4 rounded border-border bg-background text-foreground focus:ring-1 focus:ring-foreground"
        />
        <label htmlFor="featured" className="text-sm">
          Featured project
        </label>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="highlight"
          checked={form.highlight}
          onChange={(e) => set("highlight", e.target.checked)}
          className="w-4 h-4 rounded border-border bg-background text-foreground focus:ring-1 focus:ring-foreground"
        />
        <label htmlFor="highlight" className="text-sm">
          Highlight in showcase
        </label>
      </div>
      <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
        <button
          onClick={onCancel}
          className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-3 py-1.5 bg-foreground text-background text-[10px] uppercase tracking-[0.15em] font-medium rounded-sm hover:bg-foreground/90 transition-colors"
        >
          Save Project
        </button>
      </div>
    </div>
  );
}

// ─── Live preview renderer ──────────────────────────────────────────────────

function ProjectPreview({ config, activeProject }: { config: SiteConfig; activeProject: string | null }) {
  return (
    <div className="h-full bg-background text-foreground overflow-y-auto w-full">
      <Navigation />
      <main className="min-h-[100vh]">
        <div className="py-24">
          <div className="container mx-auto px-4 max-w-7xl">
            <h2 className="text-3xl font-medium mb-12 text-center">Portfolio Preview</h2>
            <PortfolioGrid />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function AdminProjectsPage() {
  const { config, updateConfig } = useSiteConfig();
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(true);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [previewKey, setPreviewKey] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const lastSavedConfig = useRef<SiteConfig>(JSON.parse(JSON.stringify(config)));

  const editingProject = editingSlug
    ? config.projects.find((p) => p.slug === editingSlug)
    : null;

  const saveProject = (project: Project) => {
    const nextProjects = editingSlug
      ? config.projects.map((p) => (p.slug === editingSlug ? project : p))
      : [...config.projects, project];
    
    updateConfig({ projects: nextProjects });
    setEditingSlug(null);
    setIsCreating(false);
    setHasUnsavedChanges(true);
    toast.success(`Project "${project.title}" saved`);
  };

  const deleteProject = (slug: string) => {
    if (confirm(`Delete "${config.projects.find((p) => p.slug === slug)?.title}"?`)) {
      updateConfig({ 
        projects: config.projects.filter((p) => p.slug !== slug) 
      });
      setHasUnsavedChanges(true);
      toast.success("Project deleted");
    }
  };

  const toggleFeatured = (slug: string) => {
    const next = config.projects.map((p) =>
      p.slug === slug ? { ...p, featured: !p.featured } : p
    );
    updateConfig({ projects: next });
    setHasUnsavedChanges(true);
  };

  const toggleHighlight = (slug: string) => {
    const next = config.projects.map((p) =>
      p.slug === slug ? { ...p, highlight: !p.highlight } : p
    );
    updateConfig({ projects: next });
    setHasUnsavedChanges(true);
  };

  const toggleHidden = (slug: string) => {
    const next = config.projects.map((p) =>
      p.slug === slug ? { ...p, hidden: !p.hidden } : p
    );
    updateConfig({ projects: next });
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    toast(
      <div className="flex items-center gap-2">
        <CheckCircle2 size={16} className="text-emerald-500" />
        <span>All changes saved successfully</span>
      </div>,
      { duration: 2000 }
    );
    setHasUnsavedChanges(false);
    lastSavedConfig.current = JSON.parse(JSON.stringify(config));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-background shrink-0">
        <div className="flex items-center gap-2">
          <h1 className="text-[10px] uppercase tracking-[0.25em] font-medium">Projects Editor</h1>
          <span className="text-[9px] text-muted-foreground hidden sm:inline">· live preview updates as you type</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setPreviewOpen((o) => !o)}
            className="flex items-center gap-1 px-2 py-1 text-[9px] uppercase tracking-[0.15em] border border-border hover:bg-foreground/5"
          >
            <Monitor size={10} />
            <span>{previewOpen ? "Hide Preview" : "Show Preview"}</span>
          </button>
          <button
            onClick={handleSave}
            disabled={!hasUnsavedChanges}
            className={`flex items-center gap-1 px-2 py-1 text-[9px] uppercase tracking-[0.15em] border ${
              hasUnsavedChanges ? 'border-emerald-500 text-emerald-500 hover:bg-emerald-500/5' : 'border-border'
            }`}
          >
            <CheckCircle2 size={10} />
            <span>Save Changes</span>
          </button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2 py-1 text-[9px] uppercase tracking-[0.15em] border border-border hover:bg-foreground/5"
          >
            <ExternalLink size={10} />
            <span>Public Site</span>
          </a>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Left panel: project list */}
        <div className="w-72 shrink-0 border-r border-border flex flex-col bg-background">
          <div className="p-3 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] font-medium">Projects</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {config.projects.length} total projects
                </p>
              </div>
              <button
                onClick={() => setIsCreating(true)}
                className="text-[10px] uppercase tracking-[0.15em] px-3 py-1.5 bg-foreground text-background rounded-sm hover:bg-foreground/90 transition-colors"
              >
                New Project
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              {config.projects.map((project) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  onEdit={() => setEditingSlug(project.slug)}
                  onDelete={() => deleteProject(project.slug)}
                  onToggleFeatured={() => toggleFeatured(project.slug)}
                  onToggleHighlight={() => toggleHighlight(project.slug)}
                  onToggleHidden={() => toggleHidden(project.slug)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Middle panel: project editor */}
        <div className="flex flex-col border-r border-border bg-background overflow-hidden flex-1 min-w-0">
          {editingSlug || isCreating ? (
            <div className="flex flex-col h-full">
              <div className="sticky top-0 z-10 bg-background border-b border-border px-3 py-2 flex items-center justify-between shrink-0">
                <p className="text-sm font-medium">
                  {isCreating ? "New Project" : editingProject?.title || "Edit Project"}
                </p>
                <button
                  onClick={() => {
                    setEditingSlug(null);
                    setIsCreating(false);
                  }}
                  className="flex items-center gap-1 text-[9px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground"
                >
                  <X size={10} />
                  <span>Close</span>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-1">
                <ProjectEditor
                  project={isCreating ? {} : editingProject || {}}
                  projects={config.projects}
                  onSave={saveProject}
                  onCancel={() => {
                    setEditingSlug(null);
                    setIsCreating(false);
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
              <ArrowRight size={14} className="text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground mb-3">Select a project to edit or create a new one</p>
              <button
                onClick={() => setIsCreating(true)}
                className="text-[10px] uppercase tracking-[0.15em] px-3 py-1.5 bg-foreground text-background rounded-sm hover:bg-foreground/90 transition-colors"
              >
                New Project
              </button>
            </div>
          )}
        </div>

        {/* Right panel: live preview */}
        {previewOpen && (
          <div className="w-[42%] shrink-0 flex flex-col border-l border-border bg-background overflow-hidden">
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-foreground/[0.02] shrink-0">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground">Live Preview</p>
                <div className="h-3 w-px bg-border mx-1" />
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={`text-[9px] uppercase tracking-[0.15em] px-1 py-0.5 rounded ${
                    previewMode === 'desktop' 
                      ? 'bg-foreground/10 text-foreground' 
                      : 'text-muted-foreground hover:bg-foreground/5'
                  }`}
                >
                  Desktop
                </button>
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={`text-[9px] uppercase tracking-[0.15em] px-1 py-0.5 rounded ${
                    previewMode === 'mobile' 
                      ? 'bg-foreground/10 text-foreground' 
                      : 'text-muted-foreground hover:bg-foreground/5'
                  }`}
                >
                  <Smartphone size={10} className="inline mr-0.5" />
                  Mobile
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewKey((k) => k + 1)}
                  className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground"
                >
                  Refresh
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ScrollRevealProvider key={previewKey}>
                <ProjectPreview 
                  config={config} 
                  activeProject={editingSlug} 
                />
              </ScrollRevealProvider>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}