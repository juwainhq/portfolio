/**
 * Centralized site configuration.
 *
 * Every editable string, link, image, project, and section order lives here.
 * The public site reads from this config (via SiteConfigProvider) and the
 * /admin editor writes to it.
 *
 * Persistence: the canonical store is now the Supabase `site_config` table
 * (see `src/integrations/supabase/site-config.ts`). This file is still the
 * source of truth for the TypeScript shape, the defaults, and a defensive
 * localStorage cache used to make the first paint instant.
 */

export type Fit = "contain" | "cover";

export type Project = {
  slug: string;
  number: string;
  title: string;
  category: string;
  description: string;
  year: string;
  client: string;
  services: string[];
  layout: "featured" | "portrait" | "wide" | "square" | "two-col" | "gallery";
  fit: Fit;
  featured?: boolean;
  highlight?: boolean;
  hidden?: boolean;
  image: string;
  gallery?: string[];
  galleryFit?: Fit;
  challenge?: string;
  approach?: string;
  solution?: string;
  result?: string;
  /** Optional override of the project detail destination. */
  href?: string;
};

export type Service = {
  number: string;
  title: string;
  description: string;
};

export type HowIStep = {
  number: string;
  title: string;
  description: string;
};

export type NavLink = {
  label: string;
  /** Type of destination — controls what the editor offers. */
  kind: "section" | "page" | "external" | "email";
  href: string;
  /** True for the top-level nav and CTA buttons. */
  showInNav?: boolean;
};

export type SocialLink = {
  platform: "instagram" | "linkedin" | "behance" | "email" | "twitter" | "dribbble" | "business" | "custom";
  label: string;
  href: string;
};

export type SectionId =
  | "hero"
  | "about"
  | "services"
  | "work"
  | "highlights"
  | "how-i-work"
  | "contact";

export type SectionConfig = {
  id: SectionId;
  label: string;
  visible: boolean;
};

export type SiteConfig = {
  // Identity
  name: string;
  role: string;
  tagline: string;
  established: string;
  location: string;

  // Hero
  heroStatusText: string;
  heroTopRight: [string, string]; // two lines
  heroBottomLeft: [string, string];
  heroButtonText: string;
  heroButtonTarget: NavLink;

  // About
  aboutHeading: string;
  aboutBody: string;
  aboutStatusText: string;

  // Services
  servicesHeading: string;
  services: Service[];

  // Work
  workHeading: string;
  workFooterNote: string;
  projects: Project[];

  // Highlights
  highlightsHeading: string;

  // How I work
  howIWorkHeading: string;
  howIWorkSteps: HowIStep[];

  // Contact
  contactHeading: string;
  contactTitleLine1: string;
  contactTitleLine2: string;
  contactSubmitText: string;
  contactSuccessMessage: string;
  contactFormRecipient: string;

  // Footer
  footerTagline: string;
  footerCopyright: string;

  // Navigation + socials
  navLinks: NavLink[];
  socials: SocialLink[];

  // Section order + visibility
  sections: SectionConfig[];
};

/* -------------------------------------------------------------------------- */
/* Defaults                                                                   */
/* -------------------------------------------------------------------------- */

const defaultProjects: Project[] = [
  {
    slug: "project-01",
    number: "01",
    title: "Portrait Series",
    category: "Visual Identity",
    description: "A portrait study exploring identity and expression.",
    year: "2024",
    client: "",
    services: ["Photography Direction", "Visual Design"],
    layout: "featured",
    fit: "contain",
    featured: true,
    highlight: true,
    image: "/work-1.jpg",
    gallery: ["/work-4.jpg"],
    galleryFit: "contain",
  },
  {
    slug: "project-02",
    number: "02",
    title: "Character Study",
    category: "Creative Direction",
    description: "Exploring presence through composition and light.",
    year: "2024",
    client: "",
    services: ["Creative Direction", "Visual Design"],
    layout: "portrait",
    fit: "contain",
    featured: true,
    highlight: true,
    image: "/work-3.jpg",
  },
  {
    slug: "project-03",
    number: "03",
    title: "Identity",
    category: "Visual Identity",
    description: "Brand identity exploration.",
    year: "2023",
    client: "",
    services: ["Brand Identity", "Visual Design"],
    layout: "portrait",
    fit: "contain",
    image: "/work-8.jpg",
  },
  {
    slug: "project-04",
    number: "04",
    title: "Editorial",
    category: "Visual Identity",
    description: "Editorial composition and typography.",
    year: "2024",
    client: "",
    services: ["Editorial Design", "Visual Identity"],
    layout: "wide",
    fit: "contain",
    featured: true,
    image: "/work-4.jpg",
  },
  {
    slug: "project-05",
    number: "05",
    title: "Portrait",
    category: "Visual Identity",
    description: "A study in shadow and form.",
    year: "2024",
    client: "",
    services: ["Visual Design"],
    layout: "portrait",
    fit: "contain",
    image: "/work-8.webp",
  },
  {
    slug: "project-06",
    number: "06",
    title: "Portrait Study",
    category: "Visual Identity",
    description: "Exploring presence through light.",
    year: "2023",
    client: "",
    services: ["Visual Design"],
    layout: "square",
    fit: "contain",
    image: "/work-9.webp",
  },
  {
    slug: "project-07",
    number: "07",
    title: "Visual Archive",
    category: "Visual Identity",
    description: "A collection of visual studies.",
    year: "2023",
    client: "",
    services: ["Visual Design", "Art Direction"],
    layout: "gallery",
    fit: "contain",
    galleryFit: "contain",
    image: "/work-1.jpg",
    gallery: ["/work-3.jpg"],
  },
];

const defaultServices: Service[] = [
  {
    number: "01",
    title: "Graphic Design",
    description:
      "Brand identity, visual systems, marketing materials and creative direction.",
  },
  {
    number: "02",
    title: "Brand Strategy",
    description:
      "Positioning, messaging, visual direction and brand development.",
  },
  {
    number: "03",
    title: "Business Consulting",
    description:
      "Business strategy, customer experience, growth ideas and practical solutions.",
  },
  {
    number: "04",
    title: "Creative Direction",
    description:
      "Building cohesive visual concepts and creative campaigns.",
  },
];

const defaultHowIWork: HowIStep[] = [
  {
    number: "01",
    title: "Understand",
    description: "Understand the business, audience and problem.",
  },
  {
    number: "02",
    title: "Define",
    description: "Turn the problem into a clear strategy and visual direction.",
  },
  {
    number: "03",
    title: "Create",
    description:
      "Build a visual solution that looks strong and works for the business.",
  },
];

const defaultSocials: SocialLink[] = [
  { platform: "instagram", label: "@juwainhaque", href: "https://instagram.com" },
  { platform: "business", label: "Vindeshi", href: "https://vindeshimart.shop/" },
  { platform: "email", label: "hello@juwainhaque.com", href: "mailto:hello@juwainhaque.com" },
];

const defaultNavLinks: NavLink[] = [
  { label: "About", kind: "section", href: "#about", showInNav: true },
  { label: "Work", kind: "section", href: "#work", showInNav: true },
  { label: "Services", kind: "section", href: "#services", showInNav: true },
  { label: "Contact", kind: "section", href: "#contact", showInNav: true },
];

export const defaultConfig: SiteConfig = {
  name: "Juwain Haque",
  role: "Graphic Designer / Business Consultant",
  tagline: "Graphic Designer / Business Consultant",
  established: "Est. 2019",
  location: "Based in Dhaka · Working Worldwide",

  heroStatusText: "Available for Projects",
  heroTopRight: ["Independent Practice", "Est. 2019"],
  heroBottomLeft: ["Selected Work 2019 — 2025", "Based in Dhaka · Working Worldwide"],
  heroButtonText: "View Work",
  heroButtonTarget: { label: "Work", kind: "section", href: "#work" },

  aboutHeading:
    "Graphic designer and business consultant focused on creating strong visual identities and practical strategies.",
  aboutBody:
    "I combine creative thinking with business strategy to transform ideas into clear brands, compelling visuals, and useful solutions that drive real results.",
  aboutStatusText: "Available for select projects in 2025",

  servicesHeading: "Services",
  services: defaultServices,

  workHeading: "Selected Work",
  workFooterNote: "Projects / 2019 — 2025",
  projects: defaultProjects,

  highlightsHeading: "Selected Highlights",

  howIWorkHeading: "How I Work",
  howIWorkSteps: defaultHowIWork,

  contactHeading: "Get in Touch",
  contactTitleLine1: "Let's Work",
  contactTitleLine2: "Together.",
  contactSubmitText: "Send Message",
  contactSuccessMessage: "Message sent. I'll be in touch soon.",
  contactFormRecipient: "hello@juwainhaque.com",

  footerTagline: "Graphic Designer · Business Consultant",
  footerCopyright: "© 2025 All Rights Reserved",

  navLinks: [
    ...defaultNavLinks,
    { label: "Work", kind: "page", href: "/work", showInNav: true },
  ],
  socials: defaultSocials,

  sections: [
    { id: "hero", label: "Hero", visible: true },
    { id: "about", label: "About", visible: true },
    { id: "services", label: "Services", visible: true },
    { id: "work", label: "Selected Work", visible: true },
    { id: "highlights", label: "Highlights", visible: true },
    { id: "how-i-work", label: "How I Work", visible: true },
    { id: "contact", label: "Contact", visible: true },
  ],
};

export const STORAGE_KEY = "site-config-v2";

/* -------------------------------------------------------------------------- */
/* Local cache (used to make first paint instant; Supabase is the source)     */
/* -------------------------------------------------------------------------- */

function readLocalCache(): SiteConfig | null {
  if (typeof window === "undefined") return null;
  try {
    // Prefer the current key; fall back to legacy v1 for one-time migration.
    let raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) raw = window.localStorage.getItem("site-config-v1");
    if (!raw) return null;
    return mergeWithDefaults(JSON.parse(raw) as Partial<SiteConfig>);
  } catch {
    return null;
  }
}

function writeLocalCache(config: SiteConfig) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // Ignore quota / privacy errors
  }
}

function clearLocalCache() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem("site-config-v1");
  } catch {
    // Ignore
  }
}

/* -------------------------------------------------------------------------- */
/* Public API                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Synchronous accessor used for the very first render. Returns the most
 * recently seen config (from local cache) or the bundled defaults.
 *
 * For the authoritative, latest-from-database config, use `loadSiteConfig`.
 */
export function loadConfig(): SiteConfig {
  return readLocalCache() ?? defaultConfig;
}

/**
 * Async loader. Reads the canonical `site_config` row from Supabase and
 * updates the local cache. Falls back to the cache, then to defaults, on
 * any network/permission error so the public site never goes blank.
 */
export async function loadSiteConfig(): Promise<SiteConfig> {
  if (typeof window === "undefined") return defaultConfig;
  try {
    const { fetchSiteConfig } = await import("@/integrations/supabase/site-config");
    const remote = await fetchSiteConfig();
    if (remote) {
      const merged = mergeWithDefaults(remote as Partial<SiteConfig>);
      const cleaned: SiteConfig = {
        ...merged,
        projects: deduplicateProjectImages(merged.projects),
      };
      writeLocalCache(cleaned);
      return cleaned;
    }
  } catch (err) {
    console.warn("[site-config] loadSiteConfig failed", err);
  }
  return readLocalCache() ?? defaultConfig;
}

/**
 * Async saver. Writes through to Supabase and refreshes the local cache.
 * Returns `{ ok: true }` on success, or `{ ok: false, error }` on failure
 * so callers (the editor) can show a toast.
 */
export async function saveConfig(config: SiteConfig): Promise<{
  ok: boolean;
  error?: string;
}> {
  if (typeof window === "undefined") return { ok: true };
  const cleaned: SiteConfig = {
    ...config,
    projects: deduplicateProjectImages(config.projects),
  };
  writeLocalCache(cleaned);
  // Same-tab listeners (e.g. other editor tabs in the same browser).
  window.dispatchEvent(new CustomEvent("site-config:update", { detail: cleaned }));
  try {
    const { upsertSiteConfig } = await import("@/integrations/supabase/site-config");
    const result = await upsertSiteConfig(cleaned);
    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { ok: false, error: message };
  }
}

/**
 * Resets to bundled defaults both locally and (if authenticated) remotely.
 * The remote reset is best-effort: the editor will still show the local
 * defaults if the network call fails.
 */
export async function resetConfig(): Promise<{ ok: boolean; error?: string }> {
  clearLocalCache();
  window.dispatchEvent(new CustomEvent("site-config:update", { detail: defaultConfig }));
  try {
    const { upsertSiteConfig } = await import("@/integrations/supabase/site-config");
    return await upsertSiteConfig(defaultConfig);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { ok: false, error: message };
  }
}

/* -------------------------------------------------------------------------- */
/* Internal helpers                                                           */
/* -------------------------------------------------------------------------- */

function mergeWithDefaults(partial: Partial<SiteConfig>): SiteConfig {
  return {
    ...defaultConfig,
    ...partial,
    navLinks: partial.navLinks ?? defaultConfig.navLinks,
    socials: partial.socials ?? defaultConfig.socials,
    services: partial.services ?? defaultConfig.services,
    projects: partial.projects ?? defaultConfig.projects,
    howIWorkSteps: partial.howIWorkSteps ?? defaultConfig.howIWorkSteps,
    sections: partial.sections ?? defaultConfig.sections,
  };
}

/**
 * Deduplicate hero images across projects.
 * The first project to claim an image keeps it. Subsequent projects
 * that share the same hero image are reassigned to an unused image.
 * Gallery images are intentionally left unconstrained (they can repeat).
 */
const ALL_IMAGES = ["/work-1.jpg", "/work-3.jpg", "/work-4.jpg", "/work-8.jpg", "/work-8.webp", "/work-9.webp"];

function deduplicateProjectImages(projects: Project[]): Project[] {
  const usedHeroImages = new Set<string>();
  return projects.map((p) => {
    if (!p.image) return p;
    if (!usedHeroImages.has(p.image)) {
      usedHeroImages.add(p.image);
      return p;
    }
    const unused = ALL_IMAGES.find((img) => !usedHeroImages.has(img));
    if (!unused) return p;
    usedHeroImages.add(unused);
    return { ...p, image: unused };
  });
}
