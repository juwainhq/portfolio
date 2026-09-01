"use client";

import { useSiteConfig } from "@/context/site-config";
import { type NavLink, type SocialLink } from "@/data/site-config";
import { Plus, Trash2, Edit3, Check, X, ExternalLink } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function LinkKindBadge({ kind }: { kind: NavLink["kind"] }) {
  const labels: Record<NavLink["kind"], string> = {
    section: "Section",
    page: "Page",
    external: "External",
    email: "Email",
  };
  return (
    <span className="text-[9px] uppercase tracking-[0.1em] px-1.5 py-0.5 rounded-sm bg-foreground/5 text-muted-foreground">
      {labels[kind]}
    </span>
  );
}

function NavLinkRow({
  link,
  onUpdate,
  onDelete,
  canDelete,
}: {
  link: NavLink;
  onUpdate: (l: NavLink) => void;
  onDelete: () => void;
  canDelete: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(link);

  const commit = () => {
    onUpdate(form);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="px-5 py-4 border-b border-border bg-foreground/[0.02] space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Edit Link
          </p>
          <div className="flex gap-1">
            <button
              onClick={commit}
              className="p-1.5 hover:bg-foreground/5 rounded-sm transition-colors"
            >
              <Check size={13} />
            </button>
            <button
              onClick={() => { setForm(link); setEditing(false); }}
              className="p-1.5 hover:bg-foreground/5 rounded-sm transition-colors"
            >
              <X size={13} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
              Label
            </label>
            <input
              className="w-full bg-transparent border-b border-border py-1.5 text-sm focus:outline-none focus:border-foreground transition-colors duration-200"
              value={form.label}
              onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
              Type
            </label>
            <select
              className="w-full bg-transparent border-b border-border py-1.5 text-sm focus:outline-none focus:border-foreground transition-colors duration-200 appearance-none cursor-pointer"
              value={form.kind}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  kind: e.target.value as NavLink["kind"],
                }))
              }
            >
              <option value="section">Section (#id)</option>
              <option value="page">Internal page</option>
              <option value="external">External URL</option>
              <option value="email">Email address</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
            Destination
          </label>
          <input
            className="w-full bg-transparent border-b border-border py-1.5 text-sm font-mono focus:outline-none focus:border-foreground transition-colors duration-200"
            value={form.href}
            onChange={(e) => setForm((f) => ({ ...f, href: e.target.value }))}
            placeholder={
              form.kind === "section"
                ? "#about"
                : form.kind === "email"
                ? "you@example.com"
                : "https://..."
            }
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.showInNav ?? false}
              onChange={(e) =>
                setForm((f) => ({ ...f, showInNav: e.target.checked }))
              }
              className="sr-only"
            />
            <span
              className={`w-3.5 h-3.5 rounded-sm border transition-colors duration-150 flex items-center justify-center ${
                form.showInNav
                  ? "bg-foreground border-foreground"
                  : "border-border"
              }`}
            >
              {form.showInNav && <Check size={9} className="text-background" />}
            </span>
            <span className="text-[10px]">Show in navigation</span>
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border hover:bg-foreground/[0.02] transition-colors duration-150 group">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-medium truncate">{link.label}</p>
          <LinkKindBadge kind={link.kind} />
          {link.showInNav && (
            <span className="text-[9px] text-muted-foreground">nav</span>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground truncate font-mono">
          {link.href}
        </p>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <button
          onClick={() => setEditing(true)}
          className="p-1.5 hover:bg-foreground/5 rounded-sm transition-colors"
        >
          <Edit3 size={13} />
        </button>
        {canDelete && (
          <button
            onClick={onDelete}
            className="p-1.5 hover:bg-foreground/5 rounded-sm transition-colors text-muted-foreground hover:text-foreground"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>
    </div>
  );
}

function SocialLinkRow({
  social,
  onUpdate,
  onDelete,
}: {
  social: SocialLink;
  onUpdate: (s: SocialLink) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(social);

  const commit = () => {
    onUpdate(form);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="px-5 py-4 border-b border-border bg-foreground/[0.02] space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Edit {form.platform}
          </p>
          <div className="flex gap-1">
            <button
              onClick={commit}
              className="p-1.5 hover:bg-foreground/5 rounded-sm transition-colors"
            >
              <Check size={13} />
            </button>
            <button
              onClick={() => { setForm(social); setEditing(false); }}
              className="p-1.5 hover:bg-foreground/5 rounded-sm transition-colors"
            >
              <X size={13} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
              Platform
            </label>
            <select
              className="w-full bg-transparent border-b border-border py-1.5 text-sm focus:outline-none focus:border-foreground transition-colors duration-200 appearance-none cursor-pointer"
              value={form.platform}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  platform: e.target.value as SocialLink["platform"],
                }))
              }
            >
              {["instagram", "linkedin", "behance", "email", "twitter", "dribbble", "custom"].map(
                (p) => (
                  <option key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                )
              )}
            </select>
          </div>
          <div>
            <label className="block text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
              Label
            </label>
            <input
              className="w-full bg-transparent border-b border-border py-1.5 text-sm focus:outline-none focus:border-foreground transition-colors duration-200"
              value={form.label}
              onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              placeholder="@username"
            />
          </div>
        </div>
        <div>
          <label className="block text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
            URL / Destination
          </label>
          <input
            className="w-full bg-transparent border-b border-border py-1.5 text-sm font-mono focus:outline-none focus:border-foreground transition-colors duration-200"
            value={form.href}
            onChange={(e) => setForm((f) => ({ ...f, href: e.target.value }))}
            placeholder={
              form.platform === "email"
                ? "mailto:you@example.com"
                : "https://..."
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border hover:bg-foreground/[0.02] transition-colors duration-150 group">
      <div className="w-6 h-6 rounded-full bg-foreground/5 flex items-center justify-center shrink-0">
        <span className="text-[9px] font-medium uppercase">{social.platform[0]}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm truncate">{social.label}</p>
        <p className="text-[10px] text-muted-foreground truncate font-mono">
          {social.href}
        </p>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <button
          onClick={() => setEditing(true)}
          className="p-1.5 hover:bg-foreground/5 rounded-sm transition-colors"
        >
          <Edit3 size={13} />
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 hover:bg-foreground/5 rounded-sm transition-colors text-muted-foreground hover:text-foreground"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AdminLinksPage() {
  const { config, updateConfig } = useSiteConfig();

  const updateNavLink = (index: number, updated: NavLink) => {
    const next = [...config.navLinks];
    next[index] = updated;
    updateConfig({ navLinks: next });
  };

  const deleteNavLink = (index: number) => {
    const next = config.navLinks.filter((_, i) => i !== index);
    updateConfig({ navLinks: next });
  };

  const addNavLink = () => {
    const next: NavLink = {
      label: "New Link",
      kind: "section",
      href: "#section",
      showInNav: true,
    };
    updateConfig({ navLinks: [...config.navLinks, next] });
  };

  const updateSocial = (index: number, updated: SocialLink) => {
    const next = [...config.socials];
    next[index] = updated;
    updateConfig({ socials: next });
  };

  const deleteSocial = (index: number) => {
    const next = config.socials.filter((_, i) => i !== index);
    updateConfig({ socials: next });
  };

  const addSocial = () => {
    const next: SocialLink = {
      platform: "custom",
      label: "New Platform",
      href: "https://",
    };
    updateConfig({ socials: [...config.socials, next] });
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Navigation */}
      <div className="w-1/2 border-r border-border flex flex-col">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-[10px] uppercase tracking-[0.3em] font-medium">
              Navigation Links
            </h2>
            <p className="text-[10px] text-muted-foreground mt-1">
              Main site navigation items.
            </p>
          </div>
          <button
            onClick={addNavLink}
            className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.15em] hover:opacity-60 transition-opacity duration-150"
          >
            <Plus size={13} />
            Add
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {config.navLinks.map((link, i) => (
            <NavLinkRow
              key={i}
              link={link}
              onUpdate={(l) => updateNavLink(i, l)}
              onDelete={() => deleteNavLink(i)}
              canDelete={config.navLinks.length > 1}
            />
          ))}
        </div>
      </div>

      {/* Social links */}
      <div className="w-1/2 flex flex-col">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-[10px] uppercase tracking-[0.3em] font-medium">
              Social &amp; Contact Links
            </h2>
            <p className="text-[10px] text-muted-foreground mt-1">
              Footer and contact section links.
            </p>
          </div>
          <button
            onClick={addSocial}
            className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.15em] hover:opacity-60 transition-opacity duration-150"
          >
            <Plus size={13} />
            Add
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {config.socials.map((social, i) => (
            <SocialLinkRow
              key={i}
              social={social}
              onUpdate={(s) => updateSocial(i, s)}
              onDelete={() => deleteSocial(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
