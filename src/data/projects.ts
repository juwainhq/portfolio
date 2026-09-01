export type Project = {
  slug: string;
  number: string;
  title: string;
  category: string;
  description: string;
  year: string;
  client: string;
  services: string[];
  layout: "full" | "large" | "two-col" | "small";
  featured?: boolean;
  highlight?: boolean;
  image: string;
  gallery?: string[];
  challenge?: string;
  approach?: string;
  solution?: string;
  result?: string;
};

// Centralized project data — edit this array to update the entire site
export const projects: Project[] = [
  {
    slug: "monolith-studios",
    number: "01",
    title: "Monolith Studios",
    category: "Brand Identity · Art Direction",
    description:
      "A complete visual identity for an architecture practice rooted in material honesty and quiet precision.",
    year: "2025",
    client: "Monolith Studios",
    services: ["Brand Identity", "Visual System", "Art Direction"],
    layout: "large",
    featured: true,
    highlight: true,
    image: "linear-gradient(135deg, #1a1a1a 0%, #3a3a3a 100%)",
    gallery: [
      "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)",
      "linear-gradient(135deg, #2a2a2a 0%, #4a4a4a 100%)",
      "linear-gradient(135deg, #0f0f0f 0%, #2f2f2f 100%)",
    ],
    challenge:
      "The practice needed an identity that felt as rigorous as their work — something that could communicate material thinking without resorting to trends or visual noise.",
    approach:
      "We built a system around restraint. A monospaced wordmark, a single weight of typography, and a grid that allows the work to lead while the brand quietly supports it.",
    solution:
      "A complete identity system including a custom wordmark, a typographic system, stationery, signage, and a website that mirrors the studio's quiet confidence.",
    result:
      "The new identity has been adopted across all client deliverables, press materials, and the practice's first monograph.",
  },
  {
    slug: "field-notes",
    number: "02",
    title: "Field Notes",
    category: "Editorial · Print Design",
    description:
      "A quarterly journal exploring the intersection of design, ecology, and contemporary culture.",
    year: "2024",
    client: "Field Notes Press",
    services: ["Editorial Design", "Print", "Art Direction"],
    layout: "two-col",
    featured: true,
    image: "linear-gradient(135deg, #e8e6e1 0%, #d4d0c8 100%)",
    gallery: [
      "linear-gradient(135deg, #e8e6e1 0%, #d4d0c8 100%)",
      "linear-gradient(135deg, #d4d0c8 0%, #c0bcb4 100%)",
    ],
    challenge:
      "Create a publication that feels both literary and contemporary — a journal readers want to keep on their shelf long after the content is read.",
    approach:
      "A typographic-first editorial system. We established a strict grid that supports long-form essays while allowing photography to interrupt the rhythm when needed.",
    solution:
      "Four issues designed end-to-end, with a consistent typographic system, careful paper choices, and a binding that rewards repeated reading.",
    result:
      "Subscription base grew 320% in the first year, with stockists in 14 countries and distribution into major museum shops.",
  },
  {
    slug: "atelier-north",
    number: "03",
    title: "Atelier North",
    category: "Brand Strategy · Identity",
    description:
      "Strategic positioning and identity for a contemporary furniture maker bridging craft and industry.",
    year: "2024",
    client: "Atelier North",
    services: ["Brand Strategy", "Identity", "Visual System"],
    layout: "small",
    featured: true,
    image: "linear-gradient(135deg, #2c2c2c 0%, #4c4c4c 100%)",
  },
  {
    slug: "echo-cinema",
    number: "04",
    title: "Echo Cinema",
    category: "Identity · Campaign",
    description:
      "Identity and seasonal campaigns for an independent film house programming contemporary cinema.",
    year: "2023",
    client: "Echo Cinema",
    services: ["Identity", "Campaign", "Print"],
    layout: "full",
    featured: true,
    highlight: true,
    image: "linear-gradient(135deg, #0a0a0a 0%, #2a2a2a 100%)",
    gallery: [
      "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
      "linear-gradient(135deg, #1a1a1a 0%, #3a3a3a 100%)",
    ],
    challenge:
      "An independent cinema needed a brand that felt cinematic without leaning on the visual clichés of the category — no film reels, no clapperboards, no red curtains.",
    approach:
      "We treated each film in the program as a typographic event. The brand became a system for presenting work rather than a fixed visual mark.",
    solution:
      "A flexible identity built around the season's program, with bespoke typographic compositions for each film, posters, and a quarterly brochure.",
    result:
      "Membership grew 180% year-over-year, and the cinema's seasonal posters are now part of the permanent collection at the local design museum.",
  },
  {
    slug: "kestrel-co",
    number: "05",
    title: "Kestrel & Co.",
    category: "Naming · Identity",
    description:
      "Naming, identity, and launch strategy for a new menswear label built on slow production.",
    year: "2023",
    client: "Kestrel & Co.",
    services: ["Naming", "Identity", "Launch Strategy"],
    layout: "two-col",
    featured: true,
    image: "linear-gradient(135deg, #d8d4ca 0%, #b8b4aa 100%)",
  },
  {
    slug: "parallel-house",
    number: "06",
    title: "Parallel House",
    category: "Wayfinding · Identity",
    description:
      "Wayfinding, signage, and visual identity for a contemporary art space housed in a converted industrial building.",
    year: "2022",
    client: "Parallel House",
    services: ["Identity", "Wayfinding", "Signage"],
    layout: "small",
    image: "linear-gradient(135deg, #181818 0%, #383838 100%)",
  },
  {
    slug: "meridian-type",
    number: "07",
    title: "Meridian Type",
    category: "Type Design · Campaign",
    description:
      "A bespoke typeface and launch campaign for a digital publication focused on global design movements.",
    year: "2022",
    client: "Meridian",
    services: ["Type Design", "Campaign", "Digital"],
    layout: "large",
    featured: true,
    highlight: true,
    image: "linear-gradient(135deg, #3a3a3a 0%, #5a5a5a 100%)",
    gallery: [
      "linear-gradient(135deg, #3a3a3a 0%, #5a5a5a 100%)",
      "linear-gradient(135deg, #1a1a1a 0%, #3a3a3a 100%)",
    ],
  },
  {
    slug: "still-water",
    number: "08",
    title: "Still Water",
    category: "Packaging · Brand",
    description:
      "Packaging system for a premium water brand sourcing from alpine springs.",
    year: "2021",
    client: "Still Water Co.",
    services: ["Packaging", "Brand", "Type"],
    layout: "small",
    image: "linear-gradient(135deg, #ece9e2 0%, #c8c4ba 100%)",
  },
];

export const highlights = projects.filter((p) => p.highlight);
