export const profile = {
  name: "Aakash Singh",
  title: "Full-Stack Developer",
  location: "India",
  email: "aakashtanwar8930@gmail.com",
  github: "https://github.com/aakash8930",
  bio: "I build full-stack products end to end — storefronts, admin dashboards, and the APIs behind them. Most of my recent work lives in the Next.js / TypeScript / Node ecosystem, shipping e-commerce platforms, internal tools, and the occasional weekend experiment.",
};

export type FlagshipProject = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  stack: string[];
  video: string;
  github: string;
  live?: string;
  frameRange: [number, number];
};

// Paired with public/video/v1-v3.mp4, which are also the source clips
// the /public/sequence frame set was extracted from (300 frames each).
// v4.mp4 / frames 900-1199 are held back until Business OS is ready.
export const flagshipProjects: FlagshipProject[] = [
  {
    slug: "makhanav2",
    name: "MakhanaV2",
    tagline: "Full-stack e-commerce platform",
    description:
      "A commerce platform split across three services — a customer-facing storefront, an admin dashboard, and a backend API — built to run as independent deployables.",
    stack: ["TypeScript", "Next.js", "Node.js", "REST API"],
    video: "/video/v1.mp4",
    github: "https://github.com/aakash8930/MakhanaV2-Customer",
    frameRange: [0, 299],
  },
  {
    slug: "vanam",
    name: "Vanam",
    tagline: "E-commerce platform, customer + admin + backend",
    description:
      "Another three-service commerce build — storefront, admin panel, and backend — this one in a JavaScript stack, covering the same customer-to-fulfillment flow end to end.",
    stack: ["JavaScript", "Node.js", "REST API"],
    video: "/video/v2.mp4",
    github: "https://github.com/aakash8930/vanam-customer",
    frameRange: [300, 599],
  },
  {
    slug: "resonate",
    name: "Resonate",
    tagline: "Spotify-inspired music streaming app",
    description:
      "A music streaming client built to explore playback UI and state management patterns — queueing, now-playing, and library browsing.",
    stack: ["TypeScript", "Next.js"],
    video: "/video/v3.mp4",
    github: "https://github.com/aakash8930/resonate",
    live: "https://spotify-lime-pi.vercel.app",
    frameRange: [600, 899],
  },
];

export type Project = {
  name: string;
  description: string;
  stack: string[];
  github: string;
  live?: string;
};

export const otherProjects: Project[] = [
  {
    name: "School Admin",
    description: "Administration system for managing school records and operations.",
    stack: ["TypeScript"],
    github: "https://github.com/aakash8930/school-admin",
  },
  {
    name: "Aura Ecommerce",
    description: "Storefront for an e-commerce brand.",
    stack: ["TypeScript"],
    github: "https://github.com/aakash8930/Aura-Ecommerce",
  },
  {
    name: "UltraCoreWood",
    description: "Customer-facing site for a wood products business.",
    stack: ["JavaScript"],
    github: "https://github.com/aakash8930/UltraCoreWood-Customer",
  },
  {
    name: "SEO AI SaaS",
    description: "AI-assisted SEO tooling for content and site optimization.",
    stack: ["TypeScript"],
    github: "https://github.com/aakash8930/seo-ai-saas",
  },
  {
    name: "AI Job Board",
    description: "Job board platform with AI-driven matching.",
    stack: ["Next.js"],
    github: "https://github.com/aakash8930/ai-job-board",
  },
  {
    name: "LangApp",
    description: "Language learning application.",
    stack: ["TypeScript"],
    github: "https://github.com/aakash8930/langapp",
  },
  {
    name: "Future Trader",
    description: "Algorithmic trading tool.",
    stack: ["Python"],
    github: "https://github.com/aakash8930/future_trader",
  },
  {
    name: "BGMI Team",
    description: "Site for an esports team.",
    stack: ["HTML"],
    github: "https://github.com/aakash8930/BGMI-team",
    live: "https://bgmi-team-eight.vercel.app",
  },
];

export const skills = {
  Languages: ["TypeScript", "JavaScript", "Python"],
  "Frameworks & Libraries": ["Next.js", "React", "Node.js", "Tailwind CSS"],
  Tools: ["Git", "REST APIs", "Vercel"],
};

export const socials = [
  { label: "GitHub", href: profile.github },
  { label: "Email", href: `mailto:${profile.email}` },
];
