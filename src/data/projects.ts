import { StaticImageData } from "next/image";

export type Project = {
  slug: string;
  number: string;
  title: string;
  category: string;
  description: string;
  year: string;
  client: string;
  services: string[];
  layout: "full" | "large" | "two-col" | "small" | "portrait" | "wide";
  featured?: boolean;
  highlight?: boolean;
  image: string;
  gallery?: string[];
  challenge?: string;
  approach?: string;
  solution?: string;
  result?: string;
};

// Your portfolio work - edit this array to update the entire site
// Images are located in /public/work-{number}.{ext}
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
    layout: "large",
    featured: true,
    highlight: true,
    image: "/work-2.jpg",
    gallery: ["/work-2.jpg", "/work-1.jpg"],
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
    featured: true,
    highlight: true,
    image: "/work-3.jpg",
  },
  {
    slug: "project-03",
    number: "03",
    title: "Motion Study",
    category: "Animation",
    description: "Animated visual exploration.",
    year: "2024",
    client: "",
    services: ["Motion Design", "Animation"],
    layout: "wide",
    featured: true,
    highlight: true,
    image: "/work-6.gif",
  },
  {
    slug: "project-04",
    number: "04",
    title: "Portrait",
    category: "Visual Identity",
    description: "A study in shadow and form.",
    year: "2024",
    client: "",
    services: ["Visual Design"],
    layout: "portrait",
    featured: true,
    image: "/work-5.jpg",
  },
  {
    slug: "project-05",
    number: "05",
    title: "Editorial",
    category: "Visual Identity",
    description: "Editorial composition and typography.",
    year: "2024",
    client: "",
    services: ["Editorial Design", "Visual Identity"],
    layout: "large",
    featured: true,
    image: "/work-7.jpg",
  },
  {
    slug: "project-06",
    number: "06",
    title: "Identity",
    category: "Visual Identity",
    description: "Brand identity exploration.",
    year: "2023",
    client: "",
    services: ["Brand Identity", "Visual Design"],
    layout: "portrait",
    image: "/work-8.jpg",
  },
  {
    slug: "project-07",
    number: "07",
    title: "Portrait Study",
    category: "Visual Identity",
    description: "Exploring presence through light.",
    year: "2023",
    client: "",
    services: ["Visual Design"],
    layout: "portrait",
    image: "/work-9.webp",
  },
];

export const highlights = projects.filter((p) => p.highlight);
