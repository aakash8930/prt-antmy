/**
 * ISOLATED CONFIGURATION — engineering capabilities.
 *
 * Aggregated from the technologies ALREADY evidenced elsewhere in this
 * repository (data/techStack.ts, data/projects.ts, data/experience.ts).
 * Nothing here is invented: every technology appears in at least one of
 * those sources, and no proficiency level, year count, or certification is
 * claimed anywhere.
 *
 * Groups are capability layers (how the tooling actually groups when
 * building a system), not a re-print of the Blueprint's five plates — the
 * Blueprint visualizes the architecture; this records the toolset by layer.
 */
export type CapabilityGroup = {
  id: string;
  /** Display index, e.g. "01". */
  number: string;
  /** Short engineering tag shown as the redline mono label. */
  tag: string;
  /** Human-readable capability name. */
  name: string;
  /** One-line factual description of what this layer covers. */
  description: string;
  /** Verified technologies, from the existing repository data. */
  technologies: string[];
  /** Project ids this layer is evidenced by, when applicable. */
  projectIds?: string[];
};

export const CAPABILITIES: CapabilityGroup[] = [
  {
    id: "interface",
    number: "01",
    tag: "INTERFACE",
    name: "Frontend / Interface",
    description: "Web applications and administrative interfaces.",
    technologies: ["React", "TypeScript"],
    projectIds: ["cravecart"],
  },
  {
    id: "backend",
    number: "02",
    tag: "SERVICES",
    name: "Backend / APIs",
    description:
      "Server runtimes and REST APIs connecting client surfaces to data.",
    technologies: ["Node.js", "Express", "NestJS", "Python", "REST"],
    projectIds: ["cravecart", "genko", "quantx"],
  },
  {
    id: "data",
    number: "03",
    tag: "STORAGE",
    name: "Data / Storage",
    description: "Document and relational databases.",
    technologies: ["MongoDB", "PostgreSQL"],
    projectIds: ["cravecart"],
  },
  {
    id: "mobile",
    number: "04",
    tag: "MOBILE",
    name: "Mobile",
    description: "Native mobile applications.",
    technologies: ["React Native", "Expo"],
    projectIds: ["genko", "cravecart"],
  },
  {
    id: "infra",
    number: "05",
    tag: "PLATFORM",
    name: "Infrastructure / Tooling",
    description: "Containerized services and development environments.",
    technologies: ["Docker"],
  },
  {
    id: "automation",
    number: "06",
    tag: "AUTOMATION",
    name: "Automation / ML",
    description: "Automation workflows and ML-based systems.",
    technologies: ["Automation", "XGBoost", "Backtesting"],
    projectIds: ["quantx"],
  },
];
