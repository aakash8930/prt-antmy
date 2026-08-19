/**
 * Stages 1-4 (draw..expose) are the approved 0-40% centerpiece. Stages 5-7
 * (inspect..proof) are the 40-70% INSPECTION -> EVIDENCE -> PROOF sequence.
 * Stages 8-10 (reconcile..floorPlan) are the 70-100% closing sequence:
 * the system reintegrates, settles, then flattens into the site's
 * navigation. Bounds are expressed as percent of the full 0-100% scroll
 * journey (not a locally-normalized 0-1 fraction).
 *
 * Stage windows overlap slightly at their edges on purpose: it lets the
 * next stage's motion begin before the previous one has fully settled
 * ("the next seam is already preparing"), without either stage ever
 * animating a property the other one owns.
 */
export type StageName =
  | "draw"
  | "assemble"
  | "separate"
  | "expose"
  | "inspect"
  | "evidence"
  | "proof"
  | "reconcile"
  | "wholeAgain"
  | "floorPlan";

export const STAGE_BOUNDS: Record<StageName, [number, number]> = {
  draw: [0, 10.4],
  assemble: [9.6, 20],
  separate: [19.2, 30],
  expose: [28.8, 40],
  inspect: [40, 50],
  evidence: [50, 60],
  proof: [60, 70],
  reconcile: [70, 80],
  wholeAgain: [80, 88],
  floorPlan: [88, 100],
};

export const STAGE_LABEL: Record<StageName, string> = {
  draw: "01 — INITIAL DRAWING",
  assemble: "02 — STRUCTURE / ASSEMBLY",
  separate: "03 — FIRST SEAM",
  expose: "04 — FULL EXPOSURE",
  inspect: "05 — INSPECTION",
  evidence: "06 — EVIDENCE",
  proof: "07 — PROOF",
  reconcile: "08 — RECONCILING",
  wholeAgain: "09 — WHOLE AGAIN",
  floorPlan: "10 — FLOOR PLAN",
};

function clampPercent(n: number): number {
  return n < 0 ? 0 : n > 100 ? 100 : n;
}

/** Maps global scroll percent (0-100) to a stage's own local progress (0-1). */
export function stageLocalProgress(globalPercent: number, stage: StageName): number {
  const [start, end] = STAGE_BOUNDS[stage];
  return clampPercent((globalPercent - start) * (100 / (end - start))) / 100;
}

/** Which stage is "current" for the on-screen caption, by the midpoint rule. */
export function currentStage(globalPercent: number): StageName {
  const order: StageName[] = [
    "draw",
    "assemble",
    "separate",
    "expose",
    "inspect",
    "evidence",
    "proof",
    "reconcile",
    "wholeAgain",
    "floorPlan",
  ];
  let active: StageName = "draw";
  for (const s of order) {
    const [start, end] = STAGE_BOUNDS[s];
    const mid = (start + end) / 2;
    if (globalPercent >= mid) active = s;
  }
  return active;
}
