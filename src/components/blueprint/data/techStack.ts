import type { PlateId } from "../constants/geometry";

/**
 * ISOLATED CONFIGURATION — edit freely.
 *
 * No existing tech-stack data source was found in this repo, so these
 * annotations were derived by inspecting the sibling project repos under
 * `~/Projects` (dapigo-v2 / Duforge-CraveCart, langapp, and the docker/
 * compose configs) as of 2026-08-18. Every entry below is backed by
 * something concrete (a package.json dependency, a tsconfig, a compose
 * service) — nothing here was invented. Replace/extend as your real stack
 * changes; each plate's `heading` is just the annotation's engineering
 * label (e.g. "RUNTIME"), not a hard category.
 */
export type TechGroup = {
  heading: string;
  items: string[];
};

export const TECH_STACK: Record<Exclude<PlateId, never>, TechGroup> = {
  data: {
    heading: "STORAGE",
    // MongoDB: CraveCart's Mongoose models. PostgreSQL: configured under
    // docker/postgres — confirm which project(s) actually run against it.
    items: ["MongoDB", "PostgreSQL"],
  },
  backend: {
    heading: "RUNTIME",
    // Node.js/Express: CraveCart's REST API. NestJS: GENKŌ's api/. Python:
    // QuantX's trading engine.
    items: ["Node.js", "NestJS", "Python"],
  },
  apis: {
    heading: "PROTOCOL",
    // Only REST is evidenced (Express + NestJS controllers). No GraphQL or
    // WebSocket usage was found — add them here if that changes.
    items: ["REST"],
  },
  frontend: {
    heading: "STACK",
    // React: CraveCart's storefront/admin. TypeScript: GENKŌ's client/web
    // (tsconfig present). React Native + Expo: GENKŌ's client and
    // CraveCart's mobile app.
    items: ["React", "TypeScript", "React Native"],
  },
  infra: {
    heading: "PLATFORM",
    // Docker: docker/{redis,mongodb,postgres}/compose.yml in this
    // workspace. Add real hosting/CI/reverse-proxy details here once
    // confirmed — nothing else was evidenced.
    items: ["Docker"],
  },
};
