"use client";

import { useSiteConfig } from "@/context/site-config";
import { type Project } from "@/data/site-config";
import { Plus, Edit3, Star, StarOff, Trash2, GripVertical, ImageIcon, ChevronUp, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const LAYOUTS: Project["layout"][] = [
  "featured",
  "portrait",
  "wide",
  "square",
  "gallery",
  "two-col",
];

const AVAILABLE_IMAGES = [
  "/work-1.jpg",
  "/work-3.jpg",
  "/work-4.jpg",
  "/work-8.jpg",
  "/work-8.webp",
  "/work-9.webp",
];

function ProjectCard({
  project,
  onEdit,
  onDelete,
  onToggleFeatured,
  onToggleHighlight,
}: {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFeatured: () => void;
  onToggleHighlight: () => void;
}) {
  return (
    <div className="flex items-start gap-4 px-5 py-4 border-b border-border hover:bg-foreground/[0.02] transition-colors duration-150 group">
      {/* Thumbnail */}
      <div className="w-12 h-12 rounded-sm overflow-hidden bg-foreground/5 shrink-0 flex items-center justify-center">
        <ImageIcon size={16} className="text-muted-foreground" />
      </div>

      {/* Info */}
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

      {/* Delete button with explicit label — always visible */}
      <button
        onClick={onDelete}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] uppercase tracking-[0.15em] text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-sm transition-colors duration-150 shrink-0"
        title={`Delete "${project.title}"`}
      >
        <Trash2 size={11} />
        <span>Delete</span>
      </button>

      {/* Badges */}
      <div className="flex items-center gap-1 shrink-0">
        <span
          className={`text-[9px] uppercase tracking-[0.1em] px-1.5 py-0.5 rounded-sm ${
            project.featured
              ? "bg-foreground/10 text-foreground/70"
              : "bg-transparent text-transparent"
          }`}
        >
          Featured
        </span>
        <span
          className={`text-[9px] uppercase tracking-[0.1em] px-1.5 py-0.5 rounded-sm ${
            project.highlight
              ? "bg-foreground/10 text-foreground/70"
              : "bg-transparent text-transparent"
          }`}
        >
          Highlight
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onToggleFeatured}
          className="p-1.5 hover:bg-foreground/5 rounded-sm transition-colors duration-150"
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
          className="p-1.5 hover:bg-foreground/5 rounded-sm transition-colors duration-150"
          title={project.highlight ? "Remove from highlights" : "Add to highlights"}
        >
          <span className="text-[9px] font-medium">HL</span>
        </button>
        <button
          onClick={onEdit}
          className="p-1.5 hover:bg-foreground/5 rounded-sm transition-colors duration-150"
          title={`Edit "${project.title}"`}
        >
          <Edit3 size={13} />
        </button>
      </div>
    </div>
  );
}

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
  const [form, setForm] = useState<Project>({
    slug: project.slug ?? "",
    number: project.number ?? "",
    title: project.title ?? "",
    category: project.category ?? "",
    description: project.description ?? "",
    year: project.year ?? new Date().getFullYear().toString(),
    client: project.client ?? "",
    services: project.services ?? [],
    layout: project.layout ?? "featured",
    fit: project.fit ?? "contain",
    featured: project.featured ?? false,
    highlight: project.highlight ?? false,
    image: project.image ?? "/work-1.jpg",
    gallery: project.gallery ?? [],
    galleryFit: project.galleryFit,
    challenge: project.challenge ?? "",
    approach: project.approach ?? "",
    solution: project.solution ?? "",
    result: project.result ?? "",
  });

  const set = <K extends keyof Project>(key: K, value: Project[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSave = () => {
    if (!form.slug || !form.title) {
      toast.error("Slug and title are required.");
      return;
    }
    // Normalize slug
    const slug = form.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
    onSave({ ...form, slug });
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            {project.slug ? "Editing" : "New"} Project
          </p>
          <p className="text-sm font-medium">{form.title || "Untitled Project"}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors duration-150"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-foreground text-background text-[11px] uppercase tracking-[0.15em] font-medium hover:opacity-80 transition-opacity duration-150"
          >
            Save Project
          </button>
        </div>
      </div>

      <div className="p-6 space-y-8 max-w-2xl">
        {/* Basics */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-4">
            Basic Info
          </p>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
                  Number *
                </label>
                <input
                  className="w-full bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-foreground transition-colors duration-200"
                  value={form.number}
                  onChange={(e) => set("number", e.target.value)}
                  placeholder="01"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
                  Year
                </label>
                <input
                  className="w-full bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-foreground transition-colors duration-200"
                  value={form.year}
                  onChange={(e) => set("year", e.target.value)}
                  placeholder="2024"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
                Title *
              </label>
              <input
                className="w-full bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-foreground transition-colors duration-200"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Project name"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
                Slug
              </label>
              <input
                className="w-full bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-foreground transition-colors duration-200 font-mono text-[12px]"
                value={form.slug}
                onChange={(e) => set("slug", e.target.value)}
                placeholder="project-slug"
              />
              <p className="text-[9px] text-muted-foreground mt-1">
                URL: /work/{form.slug || "..."}
              </p>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
                Category
              </label>
              <input
                className="w-full bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-foreground transition-colors duration-200"
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                placeholder="Visual Identity"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
                Description
              </label>
              <textarea
                className="w-full bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-foreground transition-colors duration-200 resize-none"
                rows={2}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Brief project description..."
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
                Client
              </label>
              <input
                className="w-full bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-foreground transition-colors duration-200"
                value={form.client}
                onChange={(e) => set("client", e.target.value)}
                placeholder="Client name (optional)"
              />
            </div>
          </div>
        </div>

        {/* Layout */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-4">
            Layout &amp; Display
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
                Grid Layout
              </label>
              <select
                className="w-full bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-foreground transition-colors duration-200 appearance-none cursor-pointer"
                value={form.layout}
                onChange={(e) => set("layout", e.target.value as Project["layout"])}
              >
                {LAYOUTS.map((l) => (
                  <option key={l} value={l}>
                    {l.charAt(0).toUpperCase() + l.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
                Image Fit
              </label>
              <select
                className="w-full bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-foreground transition-colors duration-200 appearance-none cursor-pointer"
                value={form.fit}
                onChange={(e) => set("fit", e.target.value as "contain" | "cover")}
              >
                <option value="contain">Contain (full artwork)</option>
                <option value="cover">Cover (fill container)</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-6 mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set("featured", e.target.checked)}
                className="sr-only"
              />
              <span
                className={`w-4 h-4 rounded-sm border transition-colors duration-150 flex items-center justify-center ${
                  form.featured
                    ? "bg-foreground border-foreground"
                    : "border-border"
                }`}
              >
                {form.featured && <Star size={9} className="text-background fill-current" />}
              </span>
              <span className="text-[11px]">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.highlight}
                onChange={(e) => set("highlight", e.target.checked)}
                className="sr-only"
              />
              <span
                className={`w-4 h-4 rounded-sm border transition-colors duration-150 flex items-center justify-center ${
                  form.highlight
                    ? "bg-foreground border-foreground"
                    : "border-border"
                }`}
              >
                {form.highlight && <span className="text-[8px] text-background font-bold">H</span>}
              </span>
              <span className="text-[11px]">Highlight</span>
            </label>
          </div>
        </div>

        {/* Images */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-4">
            Images
          </p>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
              Hero Image *
            </label>
            <select
              className="w-full bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-foreground transition-colors duration-200 appearance-none cursor-pointer mb-2"
              value={form.image}
              onChange={(e) => set("image", e.target.value)}
            >
              {AVAILABLE_IMAGES.map((img) => {
                // Warn if this image is already used by another project as a hero.
                const usedByOther =
                  form.slug &&
                  projects.find(
                    (p) => p.slug !== form.slug && p.image === img
                  );
                return (
                  <option key={img} value={img}>
                    {img}
                    {usedByOther ? "  —  (also used by another project)" : ""}
                  </option>
                );
              })}
            </select>
            <p className="text-[9px] text-muted-foreground">
              Upload new images by adding files to the <code className="bg-foreground/5 px-1">public/</code> folder.
            </p>
            {(() => {
              const conflict = projects.find(
                (p) => p.slug !== form.slug && p.image === form.image
              );
              if (!conflict) return null;
              return (
                <div className="mt-3 px-3 py-2 border border-amber-500/30 bg-amber-500/5 rounded-sm">
                  <p className="text-[10px] text-amber-200/80 leading-relaxed">
                    <strong className="font-semibold">Heads up:</strong> This
                    image is currently used as the hero of{" "}
                    <em>{conflict.title}</em>. Each project should have its own
                    unique hero image so the same artwork doesn't appear in
                    multiple places.
                  </p>
                </div>
              );
            })()}
          </div>
          <div className="mt-4">
            <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
              Gallery Images (optional)
            </label>
            <div className="space-y-2">
              {(form.gallery ?? []).map((img, i) => (
                <div key={i} className="flex items-center gap-2">
                  <select
                    className="flex-1 bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-foreground transition-colors duration-200 appearance-none"
                    value={img}
                    onChange={(e) => {
                      const next = [...(form.gallery ?? [])];
                      next[i] = e.target.value;
                      set("gallery", next);
                    }}
                  >
                    {AVAILABLE_IMAGES.map((imgOpt) => (
                      <option key={imgOpt} value={imgOpt}>
                        {imgOpt}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() =>
                      set("gallery", (form.gallery ?? []).filter((_, j) => j !== i))
                    }
                    className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => set("gallery", [...(form.gallery ?? []), "/work-1.jpg"])}
                className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors duration-150 mt-1"
              >
                <Plus size={12} />
                Add gallery image
              </button>
            </div>
          </div>
        </div>

        {/* Services */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-4">
            Services
          </p>
          <div className="space-y-2">
            {(form.services ?? []).map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  className="flex-1 bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-foreground transition-colors duration-200"
                  value={s}
                  onChange={(e) => {
                    const next = [...(form.services ?? [])];
                    next[i] = e.target.value;
                    set("services", next);
                  }}
                  placeholder="Service name"
                />
                <button
                  onClick={() => set("services", (form.services ?? []).filter((_, j) => j !== i))}
                  className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
            <button
              onClick={() => set("services", [...(form.services ?? []), ""])}
              className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors duration-150 mt-1"
            >
              <Plus size={12} />
              Add service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AdminProjectsPage() {
  const { config, updateConfig } = useSiteConfig();
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{
    slug: string;
    title: string;
    image: string;
  } | null>(null);

  const editingProject = editingSlug
    ? config.projects.find((p) => p.slug === editingSlug)
    : null;

  const saveProject = (updated: Project) => {
    const existing = config.projects.findIndex((p) => p.slug === updated.slug);
    const next =
      existing >= 0
        ? config.projects.map((p, i) => (i === existing ? updated : p))
        : [...config.projects, updated];
    updateConfig({ projects: next });
    setEditingSlug(null);
    setIsCreating(false);
    toast.success(
      existing >= 0 ? "Project updated" : "Project created"
    );
  };

  const requestDelete = (slug: string) => {
    const project = config.projects.find((p) => p.slug === slug);
    if (!project) return;
    setConfirmDelete({
      slug: project.slug,
      title: project.title,
      image: project.image,
    });
  };

  const performDelete = () => {
    if (!confirmDelete) return;
    updateConfig({
      projects: config.projects.filter((p) => p.slug !== confirmDelete.slug),
    });
    toast.success(`Deleted "${confirmDelete.title}"`);
    setConfirmDelete(null);
  };

  const toggleFeatured = (slug: string) => {
    updateConfig({
      projects: config.projects.map((p) =>
        p.slug === slug ? { ...p, featured: !p.featured } : p
      ),
    });
  };

  const toggleHighlight = (slug: string) => {
    updateConfig({
      projects: config.projects.map((p) =>
        p.slug === slug ? { ...p, highlight: !p.highlight } : p
      ),
    });
  };

  const moveProject = (slug: string, direction: "up" | "down") => {
    const idx = config.projects.findIndex((p) => p.slug === slug);
    if (idx < 0) return;
    const next = [...config.projects];
    if (direction === "up" && idx > 0) {
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    } else if (direction === "down" && idx < next.length - 1) {
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    }
    updateConfig({ projects: next });
  };

  if (editingSlug && editingProject) {
    return (
      <ProjectEditor
        project={editingProject}
        projects={config.projects}
        onSave={saveProject}
        onCancel={() => setEditingSlug(null)}
      />
    );
  }

  if (isCreating) {
    return (
      <ProjectEditor
        project={{}}
        projects={config.projects}
        onSave={saveProject}
        onCancel={() => setIsCreating(false)}
      />
    );
  }

  return (
    <>
      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setConfirmDelete(null)}
          />

          {/* Dialog */}
          <div className="relative z-10 w-full max-w-md bg-background border border-border p-8">
            <p className="text-[10px] uppercase tracking-[0.25em] text-red-400 mb-3">
              Delete Project
            </p>
            <h2 className="text-xl font-medium mb-2">
              "{confirmDelete.title}"
            </h2>
            <p className="text-sm text-muted-foreground mb-1">
              Number: {config.projects.find((p) => p.slug === confirmDelete.slug)?.number}
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Image: {confirmDelete.image}
            </p>
            <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
              This will permanently remove this project and cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-4">
              <button
                onClick={() => setConfirmDelete(null)}
                className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors duration-150"
              >
                Cancel
              </button>
              <button
                onClick={performDelete}
                className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white text-[11px] uppercase tracking-[0.15em] font-medium transition-colors duration-150"
              >
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex h-full">
      {/* Project list */}
      <div className="w-80 shrink-0 border-r border-border flex flex-col">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-[10px] uppercase tracking-[0.3em] font-medium">
              Projects
            </h2>
            <p className="text-[10px] text-muted-foreground mt-1">
              {config.projects.length} project{config.projects.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.15em] hover:opacity-60 transition-opacity duration-150"
          >
            <Plus size={13} />
            New
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {config.projects.map((project, idx) => (
            <div
              key={project.slug}
              className="flex items-center"
            >
              {/* Reorder */}
              <div className="px-2 py-4 flex flex-col gap-0.5 shrink-0 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => moveProject(project.slug, "up")}
                  disabled={idx === 0}
                  className="p-0.5 hover:bg-foreground/5 disabled:opacity-20"
                >
                  <ChevronUp size={11} />
                </button>
                <button
                  onClick={() => moveProject(project.slug, "down")}
                  disabled={idx === config.projects.length - 1}
                  className="p-0.5 hover:bg-foreground/5 disabled:opacity-20"
                >
                  <ChevronDown size={11} />
                </button>
              </div>
              <div className="flex-1 group">
                <ProjectCard
                  project={project}
                  onEdit={() => setEditingSlug(project.slug)}
                  onDelete={() => requestDelete(project.slug)}
                  onToggleFeatured={() => toggleFeatured(project.slug)}
                  onToggleHighlight={() => toggleHighlight(project.slug)}
                />
              </div>
            </div>
          ))}

          {config.projects.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <p className="text-sm mb-2">No projects yet</p>
              <p className="text-xs text-muted-foreground mb-4">
                Add your first project to get started.
              </p>
              <button
                onClick={() => setIsCreating(true)}
                className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.15em] hover:opacity-60 transition-opacity duration-150"
              >
                <Plus size={13} />
                New Project
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Help panel */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center text-center px-8">
        <div className="max-w-sm">
          <p className="text-sm font-medium mb-3">Image Upload</p>
          <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
            To add or replace portfolio images, place image files in the{" "}
            <code className="bg-foreground/5 px-1 py-0.5 rounded text-[10px]">public/</code>{" "}
            folder of your project. Use JPG, PNG, WebP, or GIF formats.
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Then return here and select the image from the dropdown when editing
            a project. Each project displays at its natural aspect ratio.
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
