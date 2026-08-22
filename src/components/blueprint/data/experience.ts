/**
 * ISOLATED CONFIGURATION — engineering-experience records.
 *
 * Populated with verified information only. Experience = where/how I
 * operated as an engineer; Projects = what I built. To avoid duplicating
 * the Projects section, an entry references project ids (see
 * data/projects.ts) rather than restating their descriptions.
 */
export type ExperienceEntry = {
  id: string;
  /** Display index, e.g. "01". */
  number: string;
  /** Role / capacity. */
  role: string;
  /** Organization (employer / client / context). */
  organization: string;
  /** Time period. */
  period: string;
  /** Short factual description of what was done there. */
  summary: string;
  /** Relevant technologies / responsibilities. */
  systems: string[];
  /** Project ids this role relates to, when applicable. */
  projects?: string[];
};

export const EXPERIENCE: ExperienceEntry[] = [
  {
    id: "duforge",
    number: "01",
    role: "Founding Engineer",
    organization: "Duforge",
    period: "2024 — Present",
    summary:
      "Founding engineer at Duforge — building and delivering software across web, mobile, backend and automation projects, working directly with the founder on technical execution and client delivery.",
    systems: [
      "React",
      "TypeScript",
      "React Native",
      "Node.js",
      "NestJS",
      "Python",
      "MongoDB",
      "PostgreSQL",
      "Docker",
      "APIs",
      "Automation",
    ],
    projects: ["cravecart"],
  },
];
