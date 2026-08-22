import type { PlateId } from "../constants/geometry";

/**
 * ISOLATED CONFIGURATION — edit freely, this is the single place project
 * evidence data lives.
 *
 * No existing project/portfolio data source was found in this repo. These
 * three entries were pulled from real sibling repos under `~/Projects`
 * (README.md / package.json, as of 2026-08-18) — nothing here is
 * fabricated, but descriptions are paraphrased and short by design (see
 * DESIGN CONSTRAINT: these are evidence callouts, not case studies).
 *
 * Only 3 real projects were found. The EVIDENCE/PROOF phases render
 * whatever is in this array (in order) and support up to 5 without layout
 * changes — add more entries here to show more.
 *
 * `architectureArea` controls which plate the evidence callout visually
 * originates from — pick the plate that best represents this project's
 * primary contribution to the drawing.
 */
export type Project = {
  id: string;
  /** Display index, e.g. "01" — kept as a string so it can carry a leading zero. */
  number: string;
  name: string;
  category: string;
  description: string;
  architectureArea: Exclude<PlateId, never>;
  technologies: string[];
  /**
   * Optional real evidence fields — populated from supplied information, not
   * invented. Every one is optional: when absent, the corresponding row is
   * simply omitted from the Projects section (never shown as a placeholder).
   * The Blueprint's EVIDENCE/PROOF phases ignore these fields entirely, so
   * adding them changes nothing about how the centerpiece renders.
   */
  /** What the author did on this project. */
  role?: string;
  /** Public live URL, when one exists. */
  liveUrl?: string;
  /** Public source repository URL, when one exists. */
  githubUrl?: string;
  /** Longer prose on how the system is structured. */
  systemNarrative?: string;
};

export const PROJECTS: Project[] = [
  {
    id: "cravecart",
    number: "01",
    name: "CraveCart",
    category: "E-commerce / Delivery Platform",
    description:
      "Multi-vendor delivery platform — storefront, admin, partner and rider consoles, plus a customer mobile app.",
    architectureArea: "backend",
    technologies: ["Node.js", "Express", "MongoDB", "React"],
    role: "Full-stack developer · product rebuild",
    liveUrl: "https://cravecart.duforge.tech/",
    systemNarrative:
      "Rebuilt an earlier PHP/Flutter delivery platform (Dapigo) as a multi-surface system on React, Node.js and React Native. The customer, admin, partner and rider experiences are separate interfaces connected through a shared backend.",
  },
  {
    id: "genko",
    number: "02",
    name: "GENKŌ",
    category: "AI / Language Learning",
    description:
      "AI-native Japanese language learning platform — a native mobile app backed by a NestJS API.",
    architectureArea: "frontend",
    technologies: ["NestJS", "React Native", "Expo"],
    role: "Solo developer · AI-assisted development",
    liveUrl: "https://aakash-ideapad-3-15iml05-u-1.tail7a4203.ts.net/",
    githubUrl: "https://github.com/aakash8930/langapp.git",
    systemNarrative:
      "An AI-assisted Japanese learning system where conversational AI is one part of a broader learning flow — structured courses, writing practice, listening practice, quizzes and progress tracking, delivered through a React/React Native client and a NestJS backend.",
  },
  {
    id: "quantx",
    number: "03",
    name: "QuantX",
    category: "AI / Trading Systems",
    description:
      "Autonomous cryptocurrency trading bot — XGBoost ML models, technical-analysis strategies, live risk engine.",
    architectureArea: "data",
    technologies: ["Python", "XGBoost", "Backtesting"],
    role: "Developer · AI-assisted development",
    systemNarrative:
      "An experimental autonomous trading and research system focused on deciding when to trade — and when not to. The pipeline evaluates market conditions and strategy signals before applying risk and execution logic, with backtesting and outcome tracking used to evaluate decisions.",
  },
];

/** Display label for a project card's "architecture connection" tag. */
export const ARCHITECTURE_LABEL: Record<Exclude<PlateId, never>, string> = {
  data: "DATA LAYER",
  backend: "BACKEND",
  apis: "API",
  frontend: "FRONTEND",
  infra: "INFRASTRUCTURE",
};
