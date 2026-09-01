"use client";

import { useSiteConfig } from "@/context/site-config";
import { SectionConfig, type SiteConfig } from "@/data/site-config";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Check,
  ExternalLink,
  X,
  Plus,
  Trash2,
  Sparkles,
  ChevronRight,
  Save,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Services } from "@/components/services";
import { PortfolioGrid } from "@/components/portfolio-grid";
import { Highlights } from "@/components/highlights";
import { HowIWork } from "@/components/how-i-work";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { ScrollRevealProvider } from "@/components/scroll-reveal";
import Link from "next/link";

// ─── Field components ────────────────────────────────────────────────────────

function TextField({
  label,
  value,
  onChange,
  multiline = false,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-foreground/70 font-medium">
        <span>{label}</span>
        {value && (
          <span className="text-[9px] text-muted-foreground font-normal normal-case tracking-normal">
            {value.length} chars
          </span>
        )}
      </label>
      {multiline ? (
        <textarea
          className="w-full bg-foreground/[0.03] border border-border rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-foreground focus:bg-foreground/[0.05] transition-all duration-200 placeholder:text-muted-foreground/40 resize-none"
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          className="w-full bg-foreground/[0.03] border border-border rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-foreground focus:bg-foreground/[0.05] transition-all duration-200 placeholder:text-muted-foreground/40"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
      {hint && <p className="text-[10px] text-muted-foreground leading-relaxed">{hint}</p>}
    </div>
  );
}

function SectionTab({
  section,
  isActive,
  onSelect,
  onToggle,
}: {
  section: SectionConfig;
  isActive: boolean;
  onSelect: () => void;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`group relative flex items-center gap-2.5 px-4 py-2.5 border-b-2 transition-all duration-150 whitespace-nowrap shrink-0 ${
        isActive
          ? "border-foreground text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground hover:border-foreground/20"
      }`}
    >
      <span
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className="opacity-50 hover:opacity-100 transition-opacity"
        title={section.visible ? "Hide section" : "Show section"}
      >
        {section.visible ? <Eye size={12} /> : <EyeOff size={12} />}
      </span>
      <span className="text-xs font-medium tracking-wide">{section.label}</span>
      {!section.visible && (
        <span className="text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-foreground/10 text-muted-foreground">
          Hidden
        </span>
      )}
    </button>
  );
}

// ─── Section editors ──────────────────────────────────────────────────────────

function HeroSectionEditor({ config, update }: { config: SiteConfig; update: (p: Partial<SiteConfig>) => void }) {
  return (
    <div className="space-y-8">
      <EditorSection
        title="Identity"
        description="Your name and the main tagline shown in the hero."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <TextField
            label="Your name"
            value={config.name}
            onChange={(v) => update({ name: v })}
            placeholder="Juwain Haque"
            hint="Shown in large type on the homepage"
          />
          <TextField
            label="Role / Tagline"
            value={config.tagline}
            onChange={(v) => update({ tagline: v })}
            placeholder="Graphic Designer / Business Consultant"
            hint="The small subtitle below your name"
          />
        </div>
      </EditorSection>

      <EditorSection
        title="Status badge"
        description="The small indicator at the top of the hero."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <TextField
            label="Status text"
            value={config.heroStatusText}
            onChange={(v) => update({ heroStatusText: v })}
            placeholder="Available for Projects"
            hint="e.g. 'Available for Projects' or 'Currently booking Q3'"
          />
          <TextField
            label="CTA button"
            value={config.heroButtonText}
            onChange={(v) => update({ heroButtonText: v })}
            placeholder="View Work"
            hint="The text on the bottom-right scroll button"
          />
        </div>
      </EditorSection>

      <EditorSection
        title="Meta labels"
        description="Small text in the corners of the hero section."
      >
        <div className="space-y-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Top right
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <TextField
                label="Line 1"
                value={config.heroTopRight[0]}
                onChange={(v) => update({ heroTopRight: [v, config.heroTopRight[1]] })}
                placeholder="Independent Practice"
              />
              <TextField
                label="Line 2"
                value={config.heroTopRight[1]}
                onChange={(v) => update({ heroTopRight: [config.heroTopRight[0], v] })}
                placeholder="Est. 2019"
              />
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Bottom left
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <TextField
                label="Line 1"
                value={config.heroBottomLeft[0]}
                onChange={(v) => update({ heroBottomLeft: [v, config.heroBottomLeft[1]] })}
                placeholder="Selected Work 2019 — 2025"
              />
              <TextField
                label="Line 2"
                value={config.heroBottomLeft[1]}
                onChange={(v) => update({ heroBottomLeft: [config.heroBottomLeft[0], v] })}
                placeholder="Based in Dhaka · Working Worldwide"
              />
            </div>
          </div>
        </div>
      </EditorSection>
    </div>
  );
}

function AboutSectionEditor({ config, update }: { config: SiteConfig; update: (p: Partial<SiteConfig>) => void }) {
  return (
    <div className="space-y-8">
      <EditorSection
        title="About copy"
        description="The main text in the About section."
      >
        <TextField
          label="Heading"
          value={config.aboutHeading}
          onChange={(v) => update({ aboutHeading: v })}
          multiline
          placeholder="Graphic designer and business consultant focused on building brands..."
        />
        <TextField
          label="Body"
          value={config.aboutBody}
          onChange={(v) => update({ aboutBody: v })}
          multiline
          placeholder="I combine creative thinking with business strategy..."
        />
      </EditorSection>

      <EditorSection
        title="Availability"
        description="Small status text at the bottom of the About section."
      >
        <TextField
          label="Status text"
          value={config.aboutStatusText}
          onChange={(v) => update({ aboutStatusText: v })}
          placeholder="Available for select projects in 2025"
        />
      </EditorSection>
    </div>
  );
}

function ServicesSectionEditor({ config, update }: { config: SiteConfig; update: (p: Partial<SiteConfig>) => void }) {
  const { services } = config;

  const updateService = (index: number, patch: Partial<typeof services[number]>) => {
    update({ services: services.map((s, i) => (i === index ? { ...s, ...patch } : s)) });
  };

  const addService = () => {
    const next = [
      ...services,
      {
        number: String(services.length + 1).padStart(2, "0"),
        title: "New service",
        description: "Describe what this service includes...",
      },
    ];
    update({ services: next });
  };

  const removeService = (index: number) => {
    if (!confirm(`Remove "${services[index].title}"?`)) return;
    const next = services
      .filter((_, i) => i !== index)
      .map((s, i) => ({ ...s, number: String(i + 1).padStart(2, "0") }));
    update({ services: next });
  };

  return (
    <div className="space-y-8">
      <EditorSection
        title="Section heading"
        description="The title at the top of the services list."
      >
        <TextField
          label="Heading"
          value={config.servicesHeading}
          onChange={(v) => update({ servicesHeading: v })}
          placeholder="Services"
        />
      </EditorSection>

      <EditorSection
        title="Services list"
        description="Add, edit, or remove the services you offer."
        action={
          <button
            onClick={addService}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] border border-border hover:bg-foreground hover:text-background transition-colors"
          >
            <Plus size={11} /> Add service
          </button>
        }
      >
        <div className="space-y-3">
          {services.map((s, i) => (
            <div
              key={i}
              className="group border border-border rounded-sm p-4 space-y-3 bg-foreground/[0.01] hover:bg-foreground/[0.02] transition-colors"
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Service {s.number}
                </p>
                <button
                  onClick={() => removeService(i)}
                  className="opacity-0 group-hover:opacity-100 flex items-center gap-1 px-2 py-1 text-[10px] uppercase tracking-[0.15em] text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-sm transition-all"
                >
                  <Trash2 size={10} /> Remove
                </button>
              </div>
              <TextField
                label="Title"
                value={s.title}
                onChange={(v) => updateService(i, { title: v })}
                placeholder="Service name"
              />
              <TextField
                label="Description"
                value={s.description}
                onChange={(v) => updateService(i, { description: v })}
                multiline
                placeholder="What this service includes..."
              />
            </div>
          ))}
        </div>
      </EditorSection>
    </div>
  );
}

function WorkSectionEditor({ config, update }: { config: SiteConfig; update: (p: Partial<SiteConfig>) => void }) {
  return (
    <div className="space-y-8">
      <EditorSection
        title="Section copy"
        description="The text at the top of the Selected Work section."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <TextField
            label="Heading"
            value={config.workHeading}
            onChange={(v) => update({ workHeading: v })}
            placeholder="Selected Work"
          />
          <TextField
            label="Footer note"
            value={config.workFooterNote}
            onChange={(v) => update({ workFooterNote: v })}
            placeholder="Projects / 2019 — 2025"
          />
        </div>
      </EditorSection>

      <EditorSection
        title="Projects & images"
        description="Manage the projects and their hero/gallery images."
        action={
          <Link
            href="/admin/projects"
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] border border-border hover:bg-foreground hover:text-background transition-colors"
          >
            Open projects editor <ChevronRight size={11} />
          </Link>
        }
      >
        <div className="text-sm text-muted-foreground leading-relaxed">
          Use the Projects editor to add, remove, reorder, and reassign images
          for your portfolio pieces.
        </div>
      </EditorSection>
    </div>
  );
}

function HighlightsSectionEditor({ config, update }: { config: SiteConfig; update: (p: Partial<SiteConfig>) => void }) {
  return (
    <div className="space-y-8">
      <EditorSection
        title="Section heading"
        description="The title above your highlights list."
      >
        <TextField
          label="Heading"
          value={config.highlightsHeading}
          onChange={(v) => update({ highlightsHeading: v })}
          placeholder="Selected Highlights"
        />
      </EditorSection>

      <EditorSection
        title="How highlights work"
        description="The list is auto-generated from featured projects."
      >
        <div className="border border-border rounded-sm p-4 bg-foreground/[0.02] text-sm text-muted-foreground leading-relaxed">
          Projects marked as <strong className="text-foreground">Featured</strong> in
          the Projects editor will appear here automatically.
        </div>
      </EditorSection>
    </div>
  );
}

function HowIWorkSectionEditor({ config, update }: { config: SiteConfig; update: (p: Partial<SiteConfig>) => void }) {
  const { howIWorkSteps } = config;

  const updateStep = (index: number, patch: Partial<typeof howIWorkSteps[number]>) => {
    update({
      howIWorkSteps: howIWorkSteps.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    });
  };

  const addStep = () => {
    const next = [
      ...howIWorkSteps,
      {
        number: String(howIWorkSteps.length + 1).padStart(2, "0"),
        title: "New step",
        description: "Describe this step...",
      },
    ];
    update({ howIWorkSteps: next });
  };

  const removeStep = (index: number) => {
    if (!confirm(`Remove step "${howIWorkSteps[index].title}"?`)) return;
    const next = howIWorkSteps
      .filter((_, i) => i !== index)
      .map((s, i) => ({ ...s, number: String(i + 1).padStart(2, "0") }));
    update({ howIWorkSteps: next });
  };

  return (
    <div className="space-y-8">
      <EditorSection
        title="Section heading"
        description="The title above your process steps."
      >
        <TextField
          label="Heading"
          value={config.howIWorkHeading}
          onChange={(v) => update({ howIWorkHeading: v })}
          placeholder="How I Work"
        />
      </EditorSection>

      <EditorSection
        title="Process steps"
        description="The numbered steps showing your workflow."
        action={
          <button
            onClick={addStep}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] border border-border hover:bg-foreground hover:text-background transition-colors"
          >
            <Plus size={11} /> Add step
          </button>
        }
      >
        <div className="space-y-3">
          {howIWorkSteps.map((s, i) => (
            <div
              key={i}
              className="group border border-border rounded-sm p-4 space-y-3 bg-foreground/[0.01] hover:bg-foreground/[0.02] transition-colors"
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Step {s.number}
                </p>
                <button
                  onClick={() => removeStep(i)}
                  className="opacity-0 group-hover:opacity-100 flex items-center gap-1 px-2 py-1 text-[10px] uppercase tracking-[0.15em] text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-sm transition-all"
                >
                  <Trash2 size={10} /> Remove
                </button>
              </div>
              <TextField
                label="Title"
                value={s.title}
                onChange={(v) => updateStep(i, { title: v })}
                placeholder="Step title"
              />
              <TextField
                label="Description"
                value={s.description}
                onChange={(v) => updateStep(i, { description: v })}
                multiline
                placeholder="Step description..."
              />
            </div>
          ))}
        </div>
      </EditorSection>
    </div>
  );
}

function ContactSectionEditor({ config, update }: { config: SiteConfig; update: (p: Partial<SiteConfig>) => void }) {
  return (
    <div className="space-y-8">
      <EditorSection
        title="Title"
        description="The big headline at the top of the contact section."
      >
        <TextField
          label="Section label"
          value={config.contactHeading}
          onChange={(v) => update({ contactHeading: v })}
          placeholder="Get in Touch"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
          <TextField
            label="Title line 1"
            value={config.contactTitleLine1}
            onChange={(v) => update({ contactTitleLine1: v })}
            placeholder="Let's Work"
          />
          <TextField
            label="Title line 2"
            value={config.contactTitleLine2}
            onChange={(v) => update({ contactTitleLine2: v })}
            placeholder="Together."
          />
        </div>
      </EditorSection>

      <EditorSection
        title="Form"
        description="Button text and success message shown after submission."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <TextField
            label="Submit button"
            value={config.contactSubmitText}
            onChange={(v) => update({ contactSubmitText: v })}
            placeholder="Send Message"
          />
          <TextField
            label="Success message"
            value={config.contactSuccessMessage}
            onChange={(v) => update({ contactSuccessMessage: v })}
            placeholder="Message sent. I'll be in touch soon."
          />
        </div>
        <div className="mt-5">
          <TextField
            label="Recipient email"
            value={config.contactFormRecipient}
            onChange={(v) => update({ contactFormRecipient: v })}
            placeholder="hello@yourdomain.com"
            hint="Where contact form submissions will be sent"
          />
        </div>
      </EditorSection>
    </div>
  );
}

function FooterSectionEditor({ config, update }: { config: SiteConfig; update: (p: Partial<SiteConfig>) => void }) {
  return (
    <div className="space-y-8">
      <EditorSection
        title="Footer text"
        description="The small text at the very bottom of every page."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <TextField
            label="Tagline"
            value={config.footerTagline}
            onChange={(v) => update({ footerTagline: v })}
            placeholder="Graphic Designer · Business Consultant"
          />
          <TextField
            label="Copyright"
            value={config.footerCopyright}
            onChange={(v) => update({ footerCopyright: v })}
            placeholder="© 2025 All Rights Reserved"
          />
        </div>
      </EditorSection>
    </div>
  );
}

// ─── Editor section wrapper ──────────────────────────────────────────────────

function EditorSection({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between gap-4 pb-3 border-b border-border">
        <div>
          <h3 className="text-sm font-medium">{title}</h3>
          {description && (
            <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {action}
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

// ─── Live preview renderer ──────────────────────────────────────────────────

function LivePreview({ config, scrollKey }: { config: SiteConfig; scrollKey: number }) {
  return (
    <div key={scrollKey} className="w-full bg-background text-foreground">
      <Navigation />
      <main>
        {config.sections.map((s) => {
          if (!s.visible) return null;
          switch (s.id) {
            case "hero": return <Hero key={s.id} />;
            case "about": return <About key={s.id} />;
            case "services": return <Services key={s.id} />;
            case "work": return <PortfolioGrid key={s.id} />;
            case "highlights": return <Highlights key={s.id} />;
            case "how-i-work": return <HowIWork key={s.id} />;
            case "contact": return <Contact key={s.id} />;
            default: return null;
          }
        })}
      </main>
      <Footer />
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function AdminSectionsPage() {
  const { config, updateConfig, hasUnsavedChanges, save } = useSiteConfig();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(true);
  const [previewWidth, setPreviewWidth] = useState(45);
  const [previewKey, setPreviewKey] = useState(0);

  // Force preview re-render on any config change.
  const handleUpdate = (patch: Partial<SiteConfig>) => {
    updateConfig(patch);
    setPreviewKey((k) => k + 1);
  };

  const moveSection = (id: string, direction: "up" | "down") => {
    const idx = config.sections.findIndex((s) => s.id === id);
    if (idx < 0) return;
    const next = [...config.sections];
    if (direction === "up" && idx > 0) {
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    } else if (direction === "down" && idx < next.length - 1) {
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    }
    handleUpdate({ sections: next });
  };

  const toggleSection = (id: string) => {
    const wasVisible = config.sections.find((s) => s.id === id)?.visible;
    const next = config.sections.map((s) =>
      s.id === id ? { ...s, visible: !s.visible } : s
    );
    handleUpdate({ sections: next });
    toast.success(wasVisible ? "Section hidden" : "Section shown", {
      description: "Live preview updated",
    });
  };

  const renderEditor = (id: string) => {
    const editors: Record<string, React.ReactNode> = {
      hero: <HeroSectionEditor config={config} update={handleUpdate} />,
      about: <AboutSectionEditor config={config} update={handleUpdate} />,
      services: <ServicesSectionEditor config={config} update={handleUpdate} />,
      work: <WorkSectionEditor config={config} update={handleUpdate} />,
      highlights: <HighlightsSectionEditor config={config} update={handleUpdate} />,
      "how-i-work": <HowIWorkSectionEditor config={config} update={handleUpdate} />,
      contact: <ContactSectionEditor config={config} update={handleUpdate} />,
    };
    return editors[id] ?? null;
  };

  const activeSectionData = config.sections.find((s) => s.id === activeSection);
  const visibleCount = config.sections.filter((s) => s.visible).length;

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-background">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-medium">Edit your portfolio</h1>
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            · {visibleCount} sections
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={save}
            disabled={!hasUnsavedChanges}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] font-medium transition-all ${
              hasUnsavedChanges
                ? "bg-foreground text-background hover:opacity-80"
                : "bg-foreground/10 text-foreground/40 cursor-not-allowed"
            }`}
          >
            <Save size={11} />
            {hasUnsavedChanges ? "Save now" : "Saved"}
          </button>
          <button
            onClick={() => setPreviewOpen((o) => !o)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] border border-border hover:bg-foreground/5 transition-colors"
          >
            {previewOpen ? "Hide preview" : "Show preview"}
          </button>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] border border-border hover:bg-foreground/5 transition-colors"
          >
            <ExternalLink size={11} />
            View site
          </Link>
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex items-center border-b border-border bg-background overflow-x-auto">
        {config.sections.map((section) => (
          <SectionTab
            key={section.id}
            section={section}
            isActive={activeSection === section.id}
            onSelect={() => setActiveSection(section.id)}
            onToggle={() => toggleSection(section.id)}
          />
        ))}
        <div className="flex-1" />
        <div className="flex items-center gap-1 px-4 shrink-0">
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Order:
          </span>
          {config.sections
            .filter((s) => s.visible)
            .map((section, idx, arr) => (
              <span
                key={section.id}
                className="flex items-center gap-1 text-[10px] text-muted-foreground"
              >
                <span>{section.label}</span>
                {idx < arr.length - 1 && (
                  <ArrowRight size={9} className="text-foreground/30" />
                )}
              </span>
            ))}
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Middle panel: content editor */}
        <div
          className="flex flex-col border-r border-border bg-background overflow-hidden"
          style={{ width: previewOpen ? `${100 - previewWidth}%` : "100%" }}
        >
          {activeSection ? (
            <>
              <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-foreground/[0.02]">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    Editing
                  </span>
                  <span className="text-sm font-medium">{activeSectionData?.label}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveSection(activeSectionData!.id, "up")}
                    className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                  >
                    ↑ Move up
                  </button>
                  <button
                    onClick={() => moveSection(activeSectionData!.id, "down")}
                    className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                  >
                    ↓ Move down
                  </button>
                  <button
                    onClick={() => toggleSection(activeSectionData!.id)}
                    className="flex items-center gap-1 text-[10px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                  >
                    {activeSectionData?.visible ? <EyeOff size={11} /> : <Eye size={11} />}
                    {activeSectionData?.visible ? "Hide" : "Show"}
                  </button>
                  <button
                    onClick={() => setActiveSection(null)}
                    className="flex items-center gap-1 text-[10px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                  >
                    <X size={11} /> Close
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {renderEditor(activeSection)}
              </div>
            </>
          ) : (
            <div className="flex flex-col h-full overflow-y-auto">
              <div className="px-6 py-5 border-b border-border">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={14} className="text-muted-foreground" />
                  <h2 className="text-sm font-medium">Welcome back</h2>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Pick a section above to edit its content, or use the quick
                  shortcuts below. Your changes appear live on the right.
                </p>
              </div>

              <div className="px-6 py-5 space-y-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3">
                    Quick start
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {config.sections.slice(0, 4).map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setActiveSection(s.id)}
                        className="group flex items-center justify-between p-3 border border-border rounded-sm hover:border-foreground/40 hover:bg-foreground/[0.02] transition-all text-left"
                      >
                        <span className="text-xs font-medium">{s.label}</span>
                        <ArrowRight
                          size={12}
                          className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3">
                    More editors
                  </p>
                  <div className="space-y-1">
                    <Link
                      href="/admin/projects"
                      className="flex items-center justify-between p-3 border border-border rounded-sm hover:border-foreground/40 hover:bg-foreground/[0.02] transition-all"
                    >
                      <div>
                        <p className="text-xs font-medium">Projects & images</p>
                        <p className="text-[10px] text-muted-foreground">
                          Add, edit, and reorder portfolio projects
                        </p>
                      </div>
                      <ArrowRight size={12} className="text-muted-foreground" />
                    </Link>
                    <Link
                      href="/admin/links"
                      className="flex items-center justify-between p-3 border border-border rounded-sm hover:border-foreground/40 hover:bg-foreground/[0.02] transition-all"
                    >
                      <div>
                        <p className="text-xs font-medium">Links & destinations</p>
                        <p className="text-[10px] text-muted-foreground">
                          Navigation, social URLs, and buttons
                        </p>
                      </div>
                      <ArrowRight size={12} className="text-muted-foreground" />
                    </Link>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3">
                    Section order (top → bottom)
                  </p>
                  <div className="border border-border rounded-sm divide-y divide-border">
                    {config.sections.map((s, i) => (
                      <div
                        key={s.id}
                        className="flex items-center gap-3 px-3 py-2.5"
                      >
                        <span className="text-[10px] text-muted-foreground w-4">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="flex-1 text-xs font-medium">
                          {s.label}
                        </span>
                        <button
                          onClick={() => moveSection(s.id, "up")}
                          disabled={i === 0}
                          className="text-[10px] text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveSection(s.id, "down")}
                          disabled={i === config.sections.length - 1}
                          className="text-[10px] text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => toggleSection(s.id)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {s.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {hasUnsavedChanges && (
                  <div className="p-4 border border-amber-500/30 bg-amber-500/5 rounded-sm">
                    <p className="text-xs text-amber-200/80 leading-relaxed">
                      You have unsaved changes. Click <strong>Save now</strong> at
                      the top to keep them.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right panel: live preview */}
        {previewOpen && (
          <div
            className="flex flex-col border-l border-border bg-background overflow-hidden"
            style={{ width: `${previewWidth}%` }}
          >
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-foreground/[0.02]">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  Live preview
                </p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="25"
                  max="75"
                  value={previewWidth}
                  onChange={(e) => setPreviewWidth(Number(e.target.value))}
                  className="w-16 h-1 accent-foreground"
                  title="Resize preview"
                />
                <button
                  onClick={() => setPreviewKey((k) => k + 1)}
                  className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors"
                  title="Replay animations"
                >
                  Replay
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ScrollRevealProvider key={previewKey}>
                <LivePreview config={config} scrollKey={previewKey} />
              </ScrollRevealProvider>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
</content>
</invoke>