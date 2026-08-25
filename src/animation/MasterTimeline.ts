/**
 * MasterTimeline — the single source of truth for the normalized scroll
 * experience. Every act is defined as a window on `experienceProgress`
 * (0..1). Any animation system that needs to react to a section only needs
 * to ask for the act's local intensity; it never owns its own scroll state.
 */
import { clamp, smoothstep } from "@/utils/math";

export type ActKey =
  | "ignition"
  | "form"
  | "material"
  | "deconstruction"
  | "power"
  | "core"
  | "performance"
  | "human"
  | "final";

export interface Act {
  key: ActKey;
  index: number;
  /** Normalized window in experience space. */
  start: number;
  end: number;
  /** Fade-in and fade-out fractions of the window. */
  fadeIn: number;
  fadeOut: number;
}

export const ACTS: Act[] = [
  { key: "ignition", index: 0, start: 0.0, end: 0.07, fadeIn: 0.03, fadeOut: 0.03 },
  { key: "form", index: 1, start: 0.07, end: 0.22, fadeIn: 0.04, fadeOut: 0.04 },
  { key: "material", index: 2, start: 0.22, end: 0.34, fadeIn: 0.05, fadeOut: 0.05 },
  { key: "deconstruction", index: 3, start: 0.34, end: 0.52, fadeIn: 0.08, fadeOut: 0.06 },
  { key: "power", index: 4, start: 0.52, end: 0.66, fadeIn: 0.06, fadeOut: 0.06 },
  { key: "core", index: 5, start: 0.66, end: 0.77, fadeIn: 0.05, fadeOut: 0.05 },
  { key: "performance", index: 6, start: 0.77, end: 0.89, fadeIn: 0.05, fadeOut: 0.05 },
  { key: "human", index: 7, start: 0.89, end: 0.96, fadeIn: 0.05, fadeOut: 0.05 },
  { key: "final", index: 8, start: 0.96, end: 1.0, fadeIn: 0.04, fadeOut: 0.0 },
];

export const getAct = (progress: number): Act => {
  const p = clamp(progress, 0, 1);
  for (const act of ACTS) {
    if (p < act.end) return act;
  }
  return ACTS[ACTS.length - 1];
};

/** 0..1 membership for an act's window with smooth edges. */
export const actIntensity = (progress: number, act: Act): number => {
  const p = clamp(progress, 0, 1);
  if (p < act.start || p > act.end) return 0;
  const inner = p - act.start;
  const span = Math.max(0.0001, act.end - act.start);
  const rise = smoothstep(0, act.fadeIn * span, inner);
  const fall = smoothstep((1 - act.fadeOut) * span, span, inner);
  return clamp(rise * (1 - fall));
};

/** 0..1 continuous window with explicit edges — used by 3D choreography. */
export const windowRange = (
  progress: number,
  from: number,
  to: number,
  fullFrom: number,
  fullTo: number,
): number => {
  const p = clamp(progress, 0, 1);
  const rise = smoothstep(from, to, p);
  const fall = smoothstep(fullFrom, fullTo, p);
  return clamp(rise * (1 - fall));
};

/** Local 0..1 progress inside a span of experience space. */
export const localProgress = (
  progress: number,
  from: number,
  to: number,
): number => clamp((progress - from) / Math.max(0.0001, to - from), 0, 1);
