"use client";

import { useSiteConfig } from "@/context/site-config";
import { SectionConfig, type SiteConfig } from "@/data/site-config";
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
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
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

function SectionCard({
  section,
  isActive,
  onSelect,
  onToggle,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: {
  section: SectionConfig;
  isActive: boolean;
  onSelect: () => void;
  onToggle: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}) {
  return (
    <div
      onClick={onSelect}
      className={`group flex items-center gap-2 px-3 py-2 border-b border-border cursor-pointer transition-colors duration-150 ${
        isActive ? "bg-foreground/5" : "hover:bg-foreground/[0.02]"
      } ${section.visible ? "" : "opacity-50"}`}
    >
      <GripVertical size={11} className="text-muted-foreground/50 shrink-0" />
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors duration-150"
        title={section.visible ? "Hide" : "Show"}
      >
        {section.visible ? <Eye size={12} /> : <EyeOff size={12} />}
      </button>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{section.label}</p>
      </div>
      <div className="shrink-0 flex flex-col gap-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMoveUp();
          }}
          disabled={!canMoveUp}
          className="p-0 hover:bg-foreground/10 disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <ChevronUp size={10} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMoveDown();
          }}
          disabled={!canMoveDown}
          className="p-0 hover:bg-foreground/10 disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <ChevronDown size={10} />
        </button>
      </div>
    </div>
  );
}

// ─── Section editors ──────────────────────────────────────────────────────────

function HeroSectionEditor({ config, update }: { config: SiteConfig; update: (p: Partial<SiteConfig>) => void }) {
  return (
    <div className="p-4 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <TextField label="Name" value={config.name} onChange={(v) => update({ name: v })} />
        <TextField label="Role / Subtitle" value={config.tagline} onChange={(v) => update({ tagline: v })} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <TextField label="Status (top)" value={config.heroStatusText} onChange={(v) => update({ heroStatusText: v })} />
        <TextField label="Button text" value={config.heroButtonText} onChange={(v) => update({ heroButtonText: v })} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <TextField label="Top-right L1" value={config.heroTopRight[0]} onChange={(v) => update({ heroTopRight: [v, config.heroTopRight[1]] })} />
        <TextField label="Top-right L2" value={config.heroTopRight[1]} onChange={(v) => update({ heroTopRight: [config.heroTopRight[0], v] })} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <TextField label="Bottom-left L1" value={config.heroBottomLeft[0]} onChange={(v) => update({ heroBottomLeft: [v, config.heroBottomLeft[1]] })} />
        <TextField label="Bottom-left L2" value={config.heroBottomLeft[1]} onChange={(v) => update({ heroBottomLeft: [config.heroBottomLeft[0], v] })} />
      </div>
    </div>
  );
}

function AboutSectionEditor({ config, update }: { config: SiteConfig; update: (p: Partial<SiteConfig>) => void }) {
  return (
    <div className="p-4 space-y-3">
      <TextField label="Heading" value={config.aboutHeading} onChange={(v) => update({ aboutHeading: v })} multiline />
      <TextField label="Body" value={config.aboutBody} onChange={(v) => update({ aboutBody: v })} multiline />
      <TextField label="Status text" value={config.aboutStatusText} onChange={(v) => update({ aboutStatusText: v })} />
    </div>
  );
}

function ServicesSectionEditor({ config, update }: { config: SiteConfig; update: (p: Partial<SiteConfig>) => void }) {
  const { services } = config;
  const updateService = (i: number, patch: Partial<typeof services[number]>) =>
    update({ services: services.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) });
  return (
    <div className="p-4 space-y-3">
      <TextField label="Section heading" value={config.servicesHeading} onChange={(v) => update({ servicesHeading: v })} />
      <div className="space-y-3">
        {services.map((s, i) => (
          <div key={i} className="border border-border p-3 space-y-2">
            <p className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground">Service {s.number}</p>
            <TextField label="Title" value={s.title} onChange={(v) => updateService(i, { title: v })} />
            <TextField label="Description" value={s.description} onChange={(v) => updateService(i, { description: v })} multiline />
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkSectionEditor({ config, update }: { config: SiteConfig; update: (p: Partial<SiteConfig>) => void }) {
  return (
    <div className="p-4 space-y-3">
      <TextField label="Section heading" value={config.workHeading} onChange={(v) => update({ workHeading: v })} />
      <TextField label="Footer note" value={config.workFooterNote} onChange={(v) => update({ workFooterNote: v })} />
      <div className="border border-border p-3 bg-foreground/[0.02]">
        <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Projects & Images</p>
        <p className="text-xs text-muted-foreground">
          Manage in <a href="/admin/projects" className="underline">Projects editor</a>.
        </p>
      </div>
    </div>
  );
}

function HighlightsSectionEditor({ config, update }: { config: SiteConfig; update: (p: Partial<SiteConfig>) => void }) {
  return (
    <div className="p-4 space-y-3">
      <TextField label="Section heading" value={config.highlightsHeading} onChange={(v) => update({ highlightsHeading: v })} />
      <p className="text-xs text-muted-foreground">
        Auto-populated from Featured projects. Edit in <a href="/admin/projects" className="underline">Projects</a>.
      </p>
    </div>
  );
}

function HowIWorkSectionEditor({ config, update }: { config: SiteConfig; update: (p: Partial<SiteConfig>) => void }) {
  const { howIWorkSteps } = config;
  const updateStep = (i: number, patch: Partial<typeof howIWorkSteps[number]>) =>
    update({ howIWorkSteps: howIWorkSteps.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) });
  return (
    <div className="p-4 space-y-3">
      <TextField label="Section heading" value={config.howIWorkHeading} onChange={(v) => update({ howIWorkHeading: v })} />
      <div className="space-y-3">
        {howIWorkSteps.map((s, i) => (
          <div key={i} className="border border-border p-3 space-y-2">
            <p className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground">Step {s.number}</p>
            <TextField label="Title" value={s.title} onChange={(v) => updateStep(i, { title: v })} />
            <TextField label="Description" value={s.description} onChange={(v) => updateStep(i, { description: v })} multiline />
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactSectionEditor({ config, update }: { config: SiteConfig; update: (p: Partial<SiteConfig>) => void }) {
  return (
    <div className="p-4 space-y-3">
      <TextField label="Section label" value={config.contactHeading} onChange={(v) => update({ contactHeading: v })} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <TextField label="Title L1" value={config.contactTitleLine1} onChange={(v) => update({ contactTitleLine1: v })} />
        <TextField label="Title L2" value={config.contactTitleLine2} onChange={(v) => update({ contactTitleLine2: v })} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <TextField label="Button" value={config.contactSubmitText} onChange={(v) => update({ contactSubmitText: v })} />
        <TextField label="Success msg" value={config.contactSuccessMessage} onChange={(v) => update({ contactSuccessMessage: v })} />
      </div>
      <TextField label="Email" value={config.contactFormRecipient} onChange={(v) => update({ contactFormRecipient: v })} />
    </div>
  );
}

function FooterSectionEditor({ config, update }: { config: SiteConfig; update: (p: Partial<SiteConfig>) => void }) {
  return (
    <div className="p-4 space-y-3">
      <TextField label="Tagline" value={config.footerTagline} onChange={(v) => update({ footerTagline: v })} />
      <TextField label="Copyright" value={config.footerCopyright} onChange={(v) => update({ footerCopyright: v })} />
    </div>
  );
}

// ─── Live preview renderer ──────────────────────────────────────────────────

function LivePreview({ config, mode, activeSection }: { config: SiteConfig; mode: 'desktop' | 'mobile'; activeSection: string | null }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Scroll to active section when it changes
  useEffect(() => {
    if (!activeSection || !containerRef.current) return;
    
    const sectionElement = containerRef.current.querySelector(`[data-section-id="${activeSection}"]`);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeSection]);

  const previewClass = mode === 'mobile' ? 'w-[375px] mx-auto' : 'w-full';
  
  return (
    <div ref={containerRef} className={`h-full bg-background text-foreground overflow-y-auto ${previewClass}`}>
      <Navigation />
      <main>
        {config.sections.map((s) => {
          if (!s.visible) return null;
          
          const sectionClass = activeSection === s.id 
            ? 'border-2 border-amber-500/50 transition-all duration-300'
            : 'transition-all duration-300';
            
          return (
            <div key={s.id} data-section-id={s.id} className={sectionClass}>
              {s.id === "hero" && <Hero />}
              {s.id === "about" && <About />}
              {s.id === "services" && <Services />}
              {s.id === "work" && <PortfolioGrid />}
              {s.id === "highlights" && <Highlights />}
              {s.id === "how-i-work" && <HowIWork />}
              {s.id === "contact" && <Contact />}
            </div>
          );
        })}
      </main>
      <Footer />
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function AdminSectionsPage() {
  const { config, updateConfig } = useSiteConfig();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(true);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [previewKey, setPreviewKey] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const lastSavedConfig = useRef<SiteConfig>(JSON.parse(JSON.stringify(config)));

  const handleUpdate = (patch: Partial<SiteConfig>) => {
    updateConfig(patch);
    setPreviewKey((k) => k + 1);
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    // Save is automatic, but we'll show a confirmation
    toast(
      <div className="flex items-center gap-2">
        <CheckCircle2 size={16} className="text-emerald-500" />
        <span>Changes saved successfully</span>
      </div>,
      { duration: 2000 }
    );
    setHasUnsavedChanges(false);
    lastSavedConfig.current = JSON.parse(JSON.stringify(config));
  };

  const visibleSections = config.sections.filter((s) => s.visible);
  const hiddenSections = config.sections.filter((s) => !s.visible);

  const moveSection = (id: string, direction: "up" | "down") => {
    const idx = config.sections.findIndex((s) => s.id === id);
    if (idx < 0) return;
    const next = [...config.sections];
    if (direction === "up" && idx > 0) [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    else if (direction === "down" && idx < next.length - 1) [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    handleUpdate({ sections: next });
  };

  const toggleSection = (id: string) => {
    const next = config.sections.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s));
    handleUpdate({ sections: next });
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

  const activeLabel = config.sections.find((s) => s.id === activeSection)?.label;

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-background shrink-0">
        <div className="flex items-center gap-2">
          <h1 className="text-[10px] uppercase tracking-[0.25em] font-medium">Editor</h1>
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
        {/* Left: section list */}
        <div className="w-56 shrink-0 border-r border-border flex flex-col bg-background">
          <div className="p-2.5 border-b border-border">
            <p className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground">Page Structure</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            <p className="text-[8px] uppercase tracking-[0.25em] text-muted-foreground mt-2 mb-1 px-3">Visible ({visibleSections.length})</p>
            {visibleSections.map((section, idx) => (
              <SectionCard
                key={section.id}
                section={section}
                isActive={activeSection === section.id}
                onSelect={() => setActiveSection(section.id)}
                onToggle={() => toggleSection(section.id)}
                onMoveUp={() => moveSection(section.id, "up")}
                onMoveDown={() => moveSection(section.id, "down")}
                canMoveUp={idx > 0}
                canMoveDown={idx < visibleSections.length - 1}
              />
            ))}
            {hiddenSections.length > 0 && (
              <>
                <p className="text-[8px] uppercase tracking-[0.25em] text-muted-foreground mt-2 mb-1 px-3 pt-2 border-t border-border">Hidden ({hiddenSections.length})</p>
                {hiddenSections.map((section) => (
                  <SectionCard
                    key={section.id}
                    section={section}
                    isActive={activeSection === section.id}
                    onSelect={() => setActiveSection(section.id)}
                    onToggle={() => toggleSection(section.id)}
                    onMoveUp={() => {}}
                    onMoveDown={() => {}}
                    canMoveUp={false}
                    canMoveDown={false}
                  />
                ))}
              </>
            )}
          </div>
        </div>

        {/* Middle: editor */}
        <div className="flex flex-col border-r border-border bg-background overflow-hidden flex-1 min-w-0">
          {activeSection ? (
            <>
              <div className="sticky top-0 z-10 bg-background border-b border-border px-3 py-2 flex items-center justify-between shrink-0">
                <p className="text-sm font-medium">{activeLabel}</p>
                <button
                  onClick={() => setActiveSection(null)}
                  className="flex items-center gap-1 text-[9px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground"
                >
                  <X size={10} />
                  <span>Close</span>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">{renderEditor(activeSection)}</div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
              <ArrowRight size={14} className="text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground mb-3">Select a section to edit</p>
              <div className="space-y-1">
                <a href="/admin/projects" className="block text-[10px] text-muted-foreground hover:text-foreground">→ Projects</a>
                <a href="/admin/links" className="block text-[10px] text-muted-foreground hover:text-foreground">→ Links</a>
              </div>
            </div>
          )}
        </div>

        {/* Right: live preview */}
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
                  Replay
                </button>
                <div className="h-3 w-px bg-border" />
                <button
                  onClick={() => {
                    if (activeSection) {
                      const container = document.querySelector(`[data-section-id="${activeSection}"]`);
                      if (container) container.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground"
                  title="Scroll to active section"
                >
                  Jump to
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ScrollRevealProvider key={previewKey}>
                <LivePreview 
                  config={config} 
                  mode={previewMode} 
                  activeSection={activeSection} 
                />
              </ScrollRevealProvider>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}