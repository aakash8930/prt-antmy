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
