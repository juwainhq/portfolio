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
  CheckCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
    "w-full bg-transparent border-b border-border py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors duration-200 placeholder:text-muted-foreground/40";
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
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
  onToggle,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: {
  section: SectionConfig;
  onToggle: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-4 px-5 py-4 border-b border-border transition-colors duration-150 ${
        section.visible ? "" : "opacity-40"
      }`}
    >
      {/* Drag handle */}
      <GripVertical size={14} className="text-muted-foreground shrink-0 cursor-grab" />

      {/* Visibility toggle */}
      <button
        onClick={onToggle}
        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors duration-150"
        title={section.visible ? "Hide section" : "Show section"}
      >
        {section.visible ? <Eye size={14} /> : <EyeOff size={14} />}
      </button>

      {/* Label */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{section.label}</p>
        <p className="text-[10px] text-muted-foreground">
          ID: <code className="text-[9px] bg-foreground/5 px-1 py-0.5 rounded">{section.id}</code>
        </p>
      </div>

      {/* Visibility badge */}
      <span
        className={`shrink-0 text-[9px] uppercase tracking-[0.15em] px-2 py-1 rounded-sm ${
          section.visible
            ? "bg-foreground/10 text-foreground/60"
            : "bg-foreground/5 text-muted-foreground"
        }`}
      >
        {section.visible ? "Visible" : "Hidden"}
      </span>

      {/* Order controls */}
      <div className="shrink-0 flex gap-1">
        <button
          onClick={onMoveUp}
          disabled={!canMoveUp}
          className="p-1.5 hover:bg-foreground/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-150"
        >
          <ChevronUp size={14} />
        </button>
        <button
          onClick={onMoveDown}
          disabled={!canMoveDown}
          className="p-1.5 hover:bg-foreground/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-150"
        >
          <ChevronDown size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Section editors ──────────────────────────────────────────────────────────

function HeroSectionEditor({ config, update }: { config: SiteConfig; update: (p: Partial<SiteConfig>) => void }) {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextField
          label="Name"
          value={config.name}
          onChange={(v) => update({ name: v })}
          placeholder="Your full name"
        />
        <TextField
          label="Role / Subtitle"
          value={config.tagline}
          onChange={(v) => update({ tagline: v })}
          placeholder="Graphic Designer / ..."
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextField
          label="Status text (top badge)"
          value={config.heroStatusText}
          onChange={(v) => update({ heroStatusText: v })}
          placeholder="Available for Projects"
        />
        <TextField
          label="Hero button text"
          value={config.heroButtonText}
          onChange={(v) => update({ heroButtonText: v })}
          placeholder="View Work"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextField
          label="Top-right line 1"
          value={config.heroTopRight[0]}
          onChange={(v) => update({ heroTopRight: [v, config.heroTopRight[1]] })}
          placeholder="Independent Practice"
        />
        <TextField
          label="Top-right line 2"
          value={config.heroTopRight[1]}
          onChange={(v) => update({ heroTopRight: [config.heroTopRight[0], v] })}
          placeholder="Est. 2019"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextField
          label="Bottom-left line 1"
          value={config.heroBottomLeft[0]}
          onChange={(v) => update({ heroBottomLeft: [v, config.heroBottomLeft[1]] })}
          placeholder="Selected Work 2019 — 2025"
        />
        <TextField
          label="Bottom-left line 2"
          value={config.heroBottomLeft[1]}
          onChange={(v) => update({ heroBottomLeft: [config.heroBottomLeft[0], v] })}
          placeholder="Based in Dhaka · Working Worldwide"
        />
      </div>
    </div>
  );
}

function AboutSectionEditor({ config, update }: { config: SiteConfig; update: (p: Partial<SiteConfig>) => void }) {
  return (
    <div className="p-6 space-y-6">
      <TextField
        label="About heading"
        value={config.aboutHeading}
        onChange={(v) => update({ aboutHeading: v })}
        multiline
        placeholder="Graphic designer and business consultant..."
      />
      <TextField
        label="About body text"
        value={config.aboutBody}
        onChange={(v) => update({ aboutBody: v })}
        multiline
        placeholder="I combine creative thinking with business strategy..."
      />
      <TextField
        label="Availability status text"
        value={config.aboutStatusText}
        onChange={(v) => update({ aboutStatusText: v })}
        placeholder="Available for select projects in 2025"
      />
    </div>
  );
}

function ServicesSectionEditor({ config, update }: { config: SiteConfig; update: (p: Partial<SiteConfig>) => void }) {
  const { services } = config;
  const set = (s: typeof services) => update({ services: s });

  const updateService = (index: number, patch: Partial<typeof services[number]>) => {
    const next = services.map((s, i) => (i === index ? { ...s, ...patch } : s));
    set(next);
  };

  return (
    <div className="p-6 space-y-6">
      <TextField
        label="Section heading"
        value={config.servicesHeading}
        onChange={(v) => update({ servicesHeading: v })}
        placeholder="Services"
      />
      <div className="space-y-4">
        {services.map((s, i) => (
          <div key={i} className="border border-border rounded-sm p-4 space-y-3">
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Service {s.number}
            </p>
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
    </div>
  );
}

function WorkSectionEditor({ config, update }: { config: SiteConfig; update: (p: Partial<SiteConfig>) => void }) {
  return (
    <div className="p-6 space-y-6">
      <TextField
        label="Section heading"
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
      <div className="border border-border rounded-sm p-4 bg-foreground/[0.02]">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
          Project images &amp; structure
        </p>
        <p className="text-xs text-muted-foreground">
          Manage projects and their images in the{" "}
          <a href="/admin/projects" className="underline underline-offset-2 hover:text-foreground">
            Projects editor
          </a>
          .
        </p>
      </div>
    </div>
  );
}

function HighlightsSectionEditor({ config, update }: { config: SiteConfig; update: (p: Partial<SiteConfig>) => void }) {
  return (
    <div className="p-6 space-y-6">
      <TextField
        label="Section heading"
        value={config.highlightsHeading}
        onChange={(v) => update({ highlightsHeading: v })}
        placeholder="Selected Highlights"
      />
      <p className="text-xs text-muted-foreground">
        The highlights list is automatically populated from projects marked as Featured. Edit projects in the{" "}
        <a href="/admin/projects" className="underline underline-offset-2 hover:text-foreground">
          Projects editor
        </a>
        .
      </p>
    </div>
  );
}

function HowIWorkSectionEditor({ config, update }: { config: SiteConfig; update: (p: Partial<SiteConfig>) => void }) {
  const { howIWorkSteps } = config;
  const set = (s: typeof howIWorkSteps) => update({ howIWorkSteps: s });

  const updateStep = (index: number, patch: Partial<typeof howIWorkSteps[number]>) => {
    const next = howIWorkSteps.map((s, i) => (i === index ? { ...s, ...patch } : s));
    set(next);
  };

  return (
    <div className="p-6 space-y-6">
      <TextField
        label="Section heading"
        value={config.howIWorkHeading}
        onChange={(v) => update({ howIWorkHeading: v })}
        placeholder="How I Work"
      />
      <div className="space-y-4">
        {howIWorkSteps.map((s, i) => (
          <div key={i} className="border border-border rounded-sm p-4 space-y-3">
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Step {s.number}
            </p>
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
    </div>
  );
}

function ContactSectionEditor({ config, update }: { config: SiteConfig; update: (p: Partial<SiteConfig>) => void }) {
  return (
    <div className="p-6 space-y-6">
      <TextField
        label="Section label"
        value={config.contactHeading}
        onChange={(v) => update({ contactHeading: v })}
        placeholder="Get in Touch"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextField
          label="Submit button text"
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
      <TextField
        label="Form recipient email"
        value={config.contactFormRecipient}
        onChange={(v) => update({ contactFormRecipient: v })}
        placeholder="hello@yourdomain.com"
      />
    </div>
  );
}

function FooterSectionEditor({ config, update }: { config: SiteConfig; update: (p: Partial<SiteConfig>) => void }) {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextField
          label="Footer tagline"
          value={config.footerTagline}
          onChange={(v) => update({ footerTagline: v })}
          placeholder="Graphic Designer · Business Consultant"
        />
        <TextField
          label="Copyright text"
          value={config.footerCopyright}
          onChange={(v) => update({ footerCopyright: v })}
          placeholder="© 2025 All Rights Reserved"
        />
      </div>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function AdminSectionsPage() {
  const { config, updateConfig } = useSiteConfig();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const visibleSections = config.sections.filter((s) => s.visible);
  const hiddenSections = config.sections.filter((s) => !s.visible);

  const moveSection = (id: string, direction: "up" | "down") => {
    const idx = config.sections.findIndex((s) => s.id === id);
    if (idx < 0) return;
    const next = [...config.sections];
    if (direction === "up" && idx > 0) {
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    } else if (direction === "down" && idx < next.length - 1) {
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    }
    updateConfig({ sections: next });
  };

  const toggleSection = (id: string) => {
    const next = config.sections.map((s) =>
      s.id === id ? { ...s, visible: !s.visible } : s
    );
    updateConfig({ sections: next });
    toast.success(
      config.sections.find((s) => s.id === id)?.visible
        ? "Section hidden"
        : "Section shown"
    );
  };

  const renderEditor = (id: string) => {
    const update = (patch: Partial<SiteConfig>) => updateConfig(patch);
    const editors: Record<string, React.ReactNode> = {
      hero: <HeroSectionEditor config={config} update={update} />,
      about: <AboutSectionEditor config={config} update={update} />,
      services: <ServicesSectionEditor config={config} update={update} />,
      work: <WorkSectionEditor config={config} update={update} />,
      highlights: <HighlightsSectionEditor config={config} update={update} />,
      "how-i-work": <HowIWorkSectionEditor config={config} update={update} />,
      contact: <ContactSectionEditor config={config} update={update} />,
    };
    return editors[id] ?? null;
  };

  return (
    <div className="flex h-full">
      {/* Left panel: section list */}
      <div className="w-80 shrink-0 border-r border-border flex flex-col">
        <div className="p-5 border-b border-border">
          <h2 className="text-[10px] uppercase tracking-[0.3em] font-medium">
            Page Structure
          </h2>
          <p className="text-[10px] text-muted-foreground mt-1">
            Toggle visibility and reorder sections.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-3">
            <p className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground mb-2 px-1">
              Visible ({visibleSections.length})
            </p>
            {visibleSections.map((section, idx) => (
              <SectionCard
                key={section.id}
                section={section}
                onToggle={() => toggleSection(section.id)}
                onMoveUp={() => moveSection(section.id, "up")}
                onMoveDown={() => moveSection(section.id, "down")}
                canMoveUp={idx > 0}
                canMoveDown={idx < visibleSections.length - 1}
              />
            ))}
          </div>

          {hiddenSections.length > 0 && (
            <div className="p-3 border-t border-border">
              <p className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground mb-2 px-1">
                Hidden ({hiddenSections.length})
              </p>
              {hiddenSections.map((section, idx) => (
                <SectionCard
                  key={section.id}
                  section={section}
                  onToggle={() => toggleSection(section.id)}
                  onMoveUp={() => {}}
                  onMoveDown={() => {}}
                  canMoveUp={false}
                  canMoveDown={false}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right panel: content editor */}
      <div className="flex-1 overflow-y-auto">
        {activeSection ? (
          <>
            <div className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  Editing
                </p>
                <p className="text-sm font-medium">
                  {config.sections.find((s) => s.id === activeSection)?.label}
                </p>
              </div>
              <button
                onClick={() => setActiveSection(null)}
                className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors duration-150"
              >
                Done
              </button>
            </div>
            {renderEditor(activeSection)}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center px-8">
            <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center mb-4">
              <ArrowRight size={16} className="text-muted-foreground" />
            </div>
            <p className="text-sm font-medium mb-2">Select a section to edit</p>
            <p className="text-xs text-muted-foreground max-w-xs">
              Click any section in the list on the left to edit its content.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
