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
  /**
   * Editorial placement of the piece in the grid.
   * `featured` is a large centered hero shot, `portrait` is a tall piece,
   * `wide` is a panoramic piece, `square` is a balanced cube, `two-col`
   * is paired with a sibling, `gallery` is a multi-image work.
   */
  layout: "featured" | "portrait" | "wide" | "square" | "two-col" | "gallery";
  /**
   * How the image should be fitted inside its container.
   * `contain` keeps the entire artwork visible (no cropping).
   * `cover` fills the natural-ratio box edge-to-edge (safe for bleed art).
   */
  fit: Fit;
  featured?: boolean;
  highlight?: boolean;
  image: string;
  gallery?: string[];
  galleryFit?: Fit;
  challenge?: string;
  approach?: string;
  solution?: string;
  result?: string;
};

/**
 * Portfolio work.
 *
 * Each image is presented at its NATURAL aspect ratio — the layout below
 * only describes where the piece sits on the page, not how the artwork
 * is cropped. The `fit` field controls object-fit per image.
 *
 * Images on disk: /work-1.jpg, /work-3.jpg, /work-4.jpg,
 *                 /work-8.jpg, /work-8.webp, /work-9.webp
 */
export const projects: Project[] = [
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
    gallery: ["/work-1.jpg", "/work-3.jpg"],
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
    featured: true,
    image: "/work-4.jpg",
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
    image: "/work-8.jpg",
    gallery: ["/work-8.jpg", "/work-9.webp"],
  },
];

export const highlights = projects.filter((p) => p.highlight);
