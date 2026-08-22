import { createTimeline, createDrawable, type Timeline } from "animejs";
import type { NodeId, NodeRegistry } from "./types";
import {
  compressedPlateRect,
  DATA_DROP,
  ENVELOPE_W,
  ENVELOPE_X,
  BAND_H,
  BAND_TOP,
  FLOOR_PLAN_ZONES,
  FLOOR_PLAN_ZONES_MOBILE,
  INNER_PLATE_LOCAL_Y,
  INSPECT_SCRIM_OPACITY,
  MASS_LIFT,
  PLATE_TILT_DEG,
  PLATE_TO_ZONE,
  PROOF_SCALE,
  PROOF_SHIFT_X,
  TRACE_OPACITY,
  type FloorPlanZone,
  type PlateId,
} from "../constants/geometry";
import { PROJECTS } from "../data/projects";

function required<T extends SVGElement = SVGElement>(
  registry: NodeRegistry,
  id: NodeId,
): T {
  const el = registry[id];
  if (!el) {
    throw new Error(
      `Blueprint animation: node "${id}" was never registered by BlueprintScene.`,
    );
  }
  return el as T;
}

/** anime.js's SVG line-drawing helper, applied once per element that needs it. */
function drawableOf(registry: NodeRegistry, id: NodeId) {
  return createDrawable(required(registry, id));
}

/**
 * Wraps a tween (or multi-segment tween) with a leading hold segment so the
 * property's ENTIRE lifecycle — including the dead time before it starts —
 * lives in ONE continuous `.add()` call anchored at absolute position 0.
 *
 * `tl.set(el, {prop: V}, P)` followed by a separate `tl.add(el, {...}, R)`
 * (R > P) looks like it should mean "V from P until R, then the tween" —
 * but empirically it does not: once ANY later frame in the SAME timeline
 * has rendered a different value for that property (e.g. from scrubbing
 * forward past R, or jumping straight to the end), seeking back into
 * [P, R) can leave the property stuck at that later value instead of
 * falling back to V. This reproduces reliably with more than one
 * `.set()`/`.add()` pair sharing a timeline (i.e. every real case in this
 * file) even though an isolated single-pair timeline can appear fine — so
 * every property below gets exactly one keyframes chain, anchored at 0,
 * with an explicit hold for [0, R), and no separate `.set()` at all.
 *
 * `holdUntil` must be > 0 — a zero-duration lead-in segment is a no-op in
 * anime v4 (verified) and leaves the same gap it was meant to close, so
 * elements whose tween already starts at position 0 (nothing in this file
 * but the crosshair) must skip this and use a plain `.add()` instead.
 */
// Keyframe segment shape varies per call (opacity/draw/translateY/rotate,
// alone or combined), and anime's own types are stricter than useful to
// reproduce here; every call site below is a straight, checked
// transcription of the exact values the original .set()/.add() pairs used.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Keyframe = Record<string, any>;

function leadIn(
  holdValue: Keyframe,
  holdUntil: number,
  ...segments: Keyframe[]
): { keyframes: Keyframe[] } {
  return { keyframes: [{ ...holdValue, duration: holdUntil }, ...segments] };
}

// ---------------------------------------------------------------------------
// Motion language. Four eases, used deliberately rather than interchangeably:
//   EASE_DRAW    - stroke reveals (construction lines, envelope, leaders).
//                  Smooth and even in both directions: the pen neither
//                  hesitates nor rushes.
//   EASE_REVEAL  - opacity-only fades (registration marks, metadata, the
//                  overall content group). A calm, precise settle-in.
//   EASE_SNAP    - small confirmations that should feel like they click into
//                  place: the crosshair's first mark, interface nodes,
//                  a dimension's ticks and label once the measurement is
//                  confirmed. A quick, pronounced-but-brief overshoot.
//   EASE_SETTLE  - real structural motion: a plate separating, the seam
//                  opening. PRECISION -> FORCE -> SETTLE — the same back-ease
//                  family as EASE_SNAP but far more restrained, so a plate
//                  reads as *physically* arriving rather than *popping* in.
// All are pure functions of progress (anime's named `outBack(overshoot)`
// easing, not a real-time spring simulation), so every frame is still a
// deterministic function of scroll position — reversible, seekable,
// stoppable anywhere mid-motion.
// ---------------------------------------------------------------------------
const EASE_DRAW = "inOutQuad";
const EASE_REVEAL = "outCubic";
const EASE_SNAP = "outBack(1.8)";
const EASE_SETTLE = "outBack(1.15)";

/**
 * The whole 0-40% prototype is ONE anime.js timeline, not four. Two
 * independent `createTimeline()` instances that both animate the same
 * target/property fight each other in anime.js v4 — constructing the
 * second one corrupts the first one's ability to render that property at
 * all, even if the second is never seeked.
 *
 * A second, subtler version of the same limitation applies *inside* one
 * timeline too: a property that gets TWO separate `.add()` calls at
 * different positions (e.g. an element that's revealed by one stage and
 * hidden by a later one) renders correctly on the way forward, but seeking
 * backward past the second call's start does not fall back to the first
 * call's tween — the property is left stuck at whatever the second call
 * last rendered. Every element that hands off between stages is therefore
 * animated with exactly ONE `.add()` call for that property, expressed as
 * duration-based keyframes (reveal -> hold -> hide) rather than as
 * separate calls from separate stage-builder functions. See
 * `addHandoffAnimations` below.
 */
const DRAW_OFFSET = 0;
const ASSEMBLE_OFFSET = 1100;
const SEPARATE_OFFSET = 2200;
const EXPOSE_OFFSET = 3300;

/**
 * The approved 0-40% prototype's total duration — the last tween EXPOSE
 * adds (the infra plate's wrapper settle) ends at exactly this many ms.
 * Verified by hand against addExposeStage/addHandoffAnimations below; if
 * that choreography's timing ever changes, this constant must be
 * recomputed alongside it.
 *
 * Stages 5-7 (INSPECT/EVIDENCE/PROOF, the 40-70% window) are appended
 * after it, sized so that percent-of-total-scroll keeps mapping linearly
 * to percent-of-timeline-duration: 40 of the eventual 70 percentage
 * points are already spent by here, so the remaining 30 points get a
 * budget of EXPOSE_STAGE_END * (30/40). That's what keeps the 40% mark
 * pixel-identical to the old fully-exposed end state — BlueprintCenterpiece
 * scrubs this same timeline with `progress` now spanning 0-70% instead of
 * 0-40%, and 40/70 of that range lands exactly on EXPOSE_STAGE_END.
 */
const EXPOSE_STAGE_END = 4460;
const PHASE_MS = Math.round((EXPOSE_STAGE_END * 0.75) / 3); // 1115 — one 10-point phase
const INSPECT_OFFSET = EXPOSE_STAGE_END;
const EVIDENCE_OFFSET = INSPECT_OFFSET + PHASE_MS;
const PROOF_OFFSET = EVIDENCE_OFFSET + PHASE_MS;
const TIMELINE_END = PROOF_OFFSET + PHASE_MS; // 7805 — end of the approved 0-70% window

/**
 * Stages 8-10 (RECONCILE/WHOLE AGAIN/FLOOR PLAN, the 70-100% closing
 * sequence) continue at the same one-phase-per-ten-points pace.
 */
const RECONCILE_OFFSET = TIMELINE_END;
const WHOLE_AGAIN_OFFSET = RECONCILE_OFFSET + PHASE_MS;
const FLOOR_PLAN_OFFSET = WHOLE_AGAIN_OFFSET + PHASE_MS;
// tl.duration is left to whatever the floor-plan content below actually
// ends at (not pinned to a further FLOOR_PLAN_OFFSET + PHASE_MS constant,
// the way EXPOSE_STAGE_END pins the 40% mark) — applyProgress always maps
// scroll fraction to tl.duration directly, so this is self-consistent
// either way; the only cost of not hand-calibrating it is that stage 10's
// pacing isn't guaranteed to match the ~10.5vh/point rhythm as precisely
// as the earlier, load-bearing stage seams do.

// Stage 8 (RECONCILE) shared timing — plate/mass/data reassembly and the
// seam-cut "final review" redline pulse both key off these.
const RECONCILE_REVIEW_START = RECONCILE_OFFSET + 50;
const RECONCILE_REASSEMBLE_START = RECONCILE_OFFSET + 150;
const RECONCILE_REASSEMBLE_MS = 750; // precision -> acceleration -> controlled arrival

/**
 * Stage 10 (FLOOR PLAN) sub-beats — volume -> compressed volume -> travel ->
 * settle -> CONTACT arrives alone. Each of the 5 mapped plates runs its own
 * compress-then-travel sequence, staggered by COMPRESS_OFFSET +
 * i*TRAVEL_STAGGER_MS (i = that plate's INSPECT_ORDER index, echoing the
 * order the visitor already inspected them in).
 */
const COMPRESS_OFFSET = FLOOR_PLAN_OFFSET; // 90% — flattening begins
/**
 * The timeline position (ms) at which the floor-plan transformation truly
 * begins — the plate geometry starts compressing here. BlueprintCenterpiece
 * divides this by the built timeline's actual duration to derive the exact
 * scroll-percent at which the caption should flip from WHOLE AGAIN to
 * FLOOR PLAN. Exported (rather than a precomputed percent) because
 * `tl.duration` is only known after `buildTimeline()` runs — the real
 * timeline is the source of truth, not an assumed ms-per-percent value.
 */
export const FLOOR_PLAN_START_MS = COMPRESS_OFFSET;
const COMPRESS_MS = 220;
/**
 * Stage 10 — how the stale Stage-1 drafting information withdraws as the
 * floor plan forms, in the same beat the plates begin compressing
 * (COMPRESS_OFFSET): the outer dimensions (W 400 / H 320) retract, the
 * old interface nodes retract, and the sheet's figure title cross-fades
 * from "FIG. 01 — SYSTEM VOLUME" to "FIG. 02 — FLOOR PLAN". The scale /
 * projection line ("SCALE 1:1 · PROJECTION ORTHOGRAPHIC") is still valid
 * for a plan and stays. All part of the master timeline's own chains, so
 * seeking stays deterministic and reversible.
 */
const FLOOR_PLAN_RETRACT_MS = 240;
// Priority 5 (motion-quality pass): wider than the original 90ms so the
// five rooms visibly register one after another rather than nearly at
// once — still restrained, not six independent card animations.
const TRAVEL_STAGGER_MS = 130;
const TRAVEL_MS = 640;
const ZONE_LABEL_MS = 320;
// After the last (i=4) mapped plate's own label has finished settling,
// plus a beat of breathing room, so CONTACT never starts before the five
// architectural rooms have actually arrived.
const CONTACT_OFFSET =
  COMPRESS_OFFSET + 4 * TRAVEL_STAGGER_MS + COMPRESS_MS + TRAVEL_MS + 60 + ZONE_LABEL_MS + 120;
const CONTACT_MS = 420;

// ---------------------------------------------------------------------------
// Stage 1 — DRAW: the sheet specifies itself, one deliberate mark at a time.
//   reference crosshair -> center axis -> dimension guides -> outer geometry
//   -> confirmed measurements -> sheet metadata.
// (Envelope opacity itself is a handoff property — see addHandoffAnimations.)
// ---------------------------------------------------------------------------
function addDrawStage(tl: Timeline, registry: NodeRegistry, offset: number): void {
  const crosshair = required(registry, "crosshair");
  const registration = required(registry, "registrationGroup");
  const constructionH = drawableOf(registry, "constructionH");
  const constructionV = drawableOf(registry, "constructionV");
  const dimWLine = drawableOf(registry, "outerDimWLine");
  const dimWDecor = required(registry, "outerDimWDecor");
  const dimHLine = drawableOf(registry, "outerDimHLine");
  const dimHDecor = required(registry, "outerDimHDecor");
  const envelopeDraw = drawableOf(registry, "envelopeOutline");
  const metaGroup = required(registry, "metadataGroup");
  const metaTitle = required(registry, "metadataTitle");
  const metaFloorPlanTitle = required(registry, "metadataFloorPlanTitle");

  // the drawing announces itself: one reference point, precisely placed.
  // Starts exactly at position 0 (offset === DRAW_OFFSET === 0 always), so
  // there's no "before" to hold — no leadIn needed here.
  tl.add(
    crosshair,
    { opacity: [0, 1], scale: [0.4, 1], duration: 220, ease: EASE_SNAP },
    offset,
  );
  tl.add(
    registration,
    leadIn({ opacity: 0 }, offset + 40, { opacity: 1, duration: 220, ease: EASE_REVEAL }),
    0,
  );

  // center axis
  tl.add(
    constructionH,
    leadIn({ draw: "0 0" }, offset + 140, { draw: "0 1", duration: 320, ease: EASE_DRAW }),
    0,
  );
  tl.add(
    constructionV,
    leadIn({ draw: "0 0" }, offset + 200, { draw: "0 1", duration: 320, ease: EASE_DRAW }),
    0,
  );

  // dimension guides are struck before the geometry they will measure exists.
  // Stage 10 retracts them once the 400x320 envelope they measure is gone.
  tl.add(
    dimWLine,
    leadIn(
      { draw: "0 0" },
      offset + 480,
      { draw: "0 1", duration: 180, ease: EASE_DRAW },
      { draw: "0 1", duration: COMPRESS_OFFSET - (offset + 480 + 180) },
      { draw: "0 0", duration: FLOOR_PLAN_RETRACT_MS, ease: EASE_DRAW },
    ),
    0,
  );
  tl.add(
    dimHLine,
    leadIn(
      { draw: "0 0" },
      offset + 540,
      { draw: "0 1", duration: 180, ease: EASE_DRAW },
      { draw: "0 1", duration: COMPRESS_OFFSET - (offset + 540 + 180) },
      { draw: "0 0", duration: FLOOR_PLAN_RETRACT_MS, ease: EASE_DRAW },
    ),
    0,
  );

  // outer geometry resolves along those guides
  tl.add(
    envelopeDraw,
    leadIn({ draw: "0 0" }, offset + 660, { draw: "0 1", duration: 320, ease: EASE_DRAW }),
    0,
  );

  // the guides become confirmed measurements now that there is something to
  // measure. Stage 10 retracts the confirmed W/H reading along with the line.
  tl.add(
    dimWDecor,
    leadIn(
      { opacity: 0 },
      offset + 1000,
      { opacity: 1, duration: 130, ease: EASE_SNAP },
      { opacity: 1, duration: COMPRESS_OFFSET - (offset + 1000 + 130) },
      { opacity: 0, duration: FLOOR_PLAN_RETRACT_MS, ease: EASE_REVEAL },
    ),
    0,
  );
  tl.add(
    dimHDecor,
    leadIn(
      { opacity: 0 },
      offset + 1050,
      { opacity: 1, duration: 130, ease: EASE_SNAP },
      { opacity: 1, duration: COMPRESS_OFFSET - (offset + 1050 + 130) },
      { opacity: 0, duration: FLOOR_PLAN_RETRACT_MS, ease: EASE_REVEAL },
    ),
    0,
  );

  // sheet metadata: the scale/projection line persists (still valid for a
  // plan); the figure title cross-fades from SYSTEM VOLUME to FLOOR PLAN
  // when the plates begin reorganizing (stage 10).
  tl.add(
    metaGroup,
    leadIn({ opacity: 0 }, offset + 1150, { opacity: 1, duration: 150, ease: EASE_REVEAL }),
    0,
  );
  tl.add(
    metaTitle,
    leadIn(
      { opacity: 0 },
      offset + 1150,
      { opacity: 1, duration: 150, ease: EASE_REVEAL },
      { opacity: 1, duration: COMPRESS_OFFSET - (offset + 1150 + 150) },
      { opacity: 0, duration: FLOOR_PLAN_RETRACT_MS, ease: EASE_REVEAL },
    ),
    0,
  );
  tl.add(
    metaFloorPlanTitle,
    leadIn(
      { opacity: 0 },
      COMPRESS_OFFSET,
      { opacity: 1, duration: FLOOR_PLAN_RETRACT_MS, ease: EASE_REVEAL },
    ),
    0,
  );
}

// ---------------------------------------------------------------------------
// Stage 2 — ASSEMBLE: the envelope resolves into internal layers and interfaces.
// (Divider and dependency opacity are handoff properties — see below.)
// ---------------------------------------------------------------------------
function addAssembleStage(tl: Timeline, registry: NodeRegistry, offset: number): void {
  const dividerIds: NodeId[] = ["divider1", "divider2", "divider3", "divider4"];
  const dividerDrawables = dividerIds.map((id) => drawableOf(registry, id));
  const interfaces = required(registry, "interfaceGroup");
  const dep1Draw = drawableOf(registry, "dependency1");
  const dep2Draw = drawableOf(registry, "dependency2");

  dividerDrawables.forEach((d, i) => {
    tl.add(
      d,
      leadIn({ draw: "0 0" }, offset + 60 * i, { draw: "0 1", duration: 360, ease: EASE_DRAW }),
      0,
    );
  });

  // interfaces click into existence where the seams cross the center axis.
  // Scale is deliberately not used here: this group spans four positions
  // along the whole center line, so a group-level scale would pivot around
  // their shared centroid and drag them apart instead of each popping in
  // place. EASE_SNAP still gives the fade a brisker, more decisive curve
  // than a plain reveal. Stage 10 retracts them once the central volume
  // they mark has become the floor plan.
  tl.add(
    interfaces,
    leadIn(
      { opacity: 0 },
      offset + 420,
      { opacity: 1, duration: 300, ease: EASE_SNAP },
      { opacity: 1, duration: COMPRESS_OFFSET - (offset + 420 + 300) },
      { opacity: 0, duration: FLOOR_PLAN_RETRACT_MS, ease: EASE_REVEAL },
    ),
    0,
  );
  tl.add(
    dep1Draw,
    leadIn({ draw: "0 0" }, offset + 560, { draw: "0 1", duration: 300, ease: EASE_DRAW }),
    0,
  );
  tl.add(
    dep2Draw,
    leadIn({ draw: "0 0" }, offset + 660, { draw: "0 1", duration: 300, ease: EASE_DRAW }),
    0,
  );
}

// ---------------------------------------------------------------------------
// Stage 3 — SEPARATE: the first seam opens; DATA drops away as the foundation.
// (massOutline opacity and divider4 opacity are handoff properties.)
// ---------------------------------------------------------------------------
function addSeparateStage(
  tl: Timeline,
  registry: NodeRegistry,
  offset: number,
  spreadScale: number,
): void {
  const massLift = MASS_LIFT * spreadScale;
  const dataDrop = DATA_DROP * spreadScale;

  const massOutlineDraw = drawableOf(registry, "massOutline");
  const massWrapper = required(registry, "massWrapper");
  const dataWrapper = required(registry, "dataWrapper");
  const dataRect = required(registry, "dataRect");
  const dataRectInset = required(registry, "dataRectInset");
  const dataRectDraw = drawableOf(registry, "dataRect");
  const dataContent = required(registry, "dataContent");
  const dataLeaderDraw = drawableOf(registry, "dataLeader");
  const dataDimLineDraw = drawableOf(registry, "dataDimensionLine");
  const dataDimDecor = required(registry, "dataDimDecor");
  const seamCut4 = required(registry, "seamCut4");

  tl.add(
    massOutlineDraw,
    leadIn({ draw: "0 0" }, offset + 80, { draw: "0 1", duration: 260, ease: EASE_DRAW }),
    0,
  );

  // the mechanical cut: a redline flash marks exactly where the seam opened.
  // Array-shorthand [0, 0.9, 0.35] over one duration splits into two equal
  // (duration/2) segments — reproduced explicitly here so a hold segment
  // can be prepended. Stage 8 (RECONCILE) reuses this same element for one
  // final review pulse before the seam closes — see the note there.
  tl.add(
    seamCut4,
    leadIn(
      { opacity: 0 },
      offset + 200,
      { opacity: 0.9, duration: 210, ease: "outQuad" },
      { opacity: 0.35, duration: 210, ease: "outQuad" },
      { opacity: 0.35, duration: RECONCILE_REVIEW_START - (offset + 200 + 420) },
      { opacity: 0.7, duration: 200, ease: "outQuad" },
      { opacity: 0, duration: 300, ease: "outQuad" },
    ),
    0,
  );

  // the seam itself opening — precision, force, settle. RECONCILE reverses
  // this exact motion (same EASE_SETTLE) once the projects have receded.
  tl.add(
    massWrapper,
    leadIn(
      { translateY: 0 },
      offset + 220,
      { translateY: -massLift, duration: 620, ease: EASE_SETTLE },
      { translateY: -massLift, duration: RECONCILE_REASSEMBLE_START - (offset + 220 + 620) },
      { translateY: 0, duration: RECONCILE_REASSEMBLE_MS, ease: EASE_SETTLE },
    ),
    0,
  );
  tl.add(
    dataWrapper,
    leadIn(
      { translateY: 0 },
      offset + 220,
      { translateY: dataDrop, duration: 620, ease: EASE_SETTLE },
      { translateY: dataDrop, duration: RECONCILE_REASSEMBLE_START - (offset + 220 + 620) },
      { translateY: 0, duration: RECONCILE_REASSEMBLE_MS, ease: EASE_SETTLE },
    ),
    0,
  );

  // the foundation reveals what it is. rect and rectInset used to share one
  // .add() call (identical values, so no visual change here) — split so
  // stage 10 can extend rectInset alone with a fade, once the rect starts
  // physically traveling and the inset's fixed proportions would no longer
  // match it.
  tl.add(
    dataRect,
    leadIn({ opacity: 0 }, offset + 560, { opacity: 1, duration: 60, ease: EASE_REVEAL }),
    0,
  );
  tl.add(
    dataRectInset,
    leadIn(
      { opacity: 0 },
      offset + 560,
      { opacity: 1, duration: 60, ease: EASE_REVEAL },
      { opacity: 1, duration: COMPRESS_OFFSET - (offset + 620) },
      { opacity: 0, duration: 200, ease: EASE_REVEAL },
    ),
    0,
  );
  tl.add(
    dataRectDraw,
    leadIn({ draw: "0 0" }, offset + 560, { draw: "0 1", duration: 320, ease: EASE_DRAW }),
    0,
  );
  // stage 10 simplifies the diagram+label away (the leader line inherits
  // this via ancestor opacity, so it doesn't need its own fade) before the
  // bare rect starts traveling to its floor-plan zone.
  tl.add(
    dataContent,
    leadIn(
      { opacity: 0 },
      offset + 680,
      { opacity: 1, duration: 300, ease: EASE_REVEAL },
      { opacity: 1, duration: COMPRESS_OFFSET - (offset + 980) },
      { opacity: 0, duration: 200, ease: EASE_REVEAL },
    ),
    0,
  );
  tl.add(
    dataLeaderDraw,
    leadIn({ draw: "0 0" }, offset + 680, { draw: "0 1", duration: 220, ease: EASE_DRAW }),
    0,
  );

  // the measurement: line draws across the new gap, then the reading
  // confirms. Stage 8 (RECONCILE) retracts this measurement as the gap it
  // describes physically closes — a "GAP 46" label floating over a seam
  // that's no longer open would read as an error on the drawing, not as
  // one of the traces stage 9 is about.
  const dimLineRevealEnd = offset + 780 + 260;
  const dimDecorRevealEnd = offset + 1040 + 150;
  tl.add(
    dataDimLineDraw,
    leadIn(
      { draw: "0 0" },
      offset + 780,
      { draw: "0 1", duration: 260, ease: EASE_DRAW },
      { draw: "0 1", duration: RECONCILE_REASSEMBLE_START - dimLineRevealEnd },
      { draw: "0 0", duration: RECONCILE_REASSEMBLE_MS, ease: EASE_DRAW },
    ),
    0,
  );
  tl.add(
    dataDimDecor,
    leadIn(
      { opacity: 0 },
      offset + 1040,
      { opacity: 1, duration: 150, ease: EASE_SNAP },
      { opacity: 1, duration: RECONCILE_REASSEMBLE_START - dimDecorRevealEnd },
      { opacity: 0, duration: RECONCILE_REASSEMBLE_MS, ease: EASE_REVEAL },
    ),
    0,
  );
}

// ---------------------------------------------------------------------------
// Stage 4 — EXPOSE: the remaining mass unlocks into four independent plates.
// (Divider 1-3 opacity are handoff properties, added in addHandoffAnimations.)
// ---------------------------------------------------------------------------
type InnerPlate = "infra" | "frontend" | "apis" | "backend";

const CASCADE_ORDER: InnerPlate[] = ["backend", "apis", "frontend", "infra"];
const CASCADE_START: Record<InnerPlate, number> = {
  backend: 0,
  apis: 160,
  frontend: 320,
  infra: 480,
};
const SEAM_CUT_FOR: Record<InnerPlate, NodeId> = {
  backend: "seamCut3",
  apis: "seamCut2",
  frontend: "seamCut1",
  infra: "seamCut1", // infra's only boundary is the infra/frontend seam, so it shares that cut
};
const WRAPPER_ID: Record<InnerPlate, NodeId> = {
  infra: "plateInfraWrapper",
  frontend: "plateFrontendWrapper",
  apis: "plateApisWrapper",
  backend: "plateBackendWrapper",
};
const RECT_ID: Record<InnerPlate, NodeId> = {
  infra: "plateInfraRect",
  frontend: "plateFrontendRect",
  apis: "plateApisRect",
  backend: "plateBackendRect",
};
const RECT_INSET_ID: Record<InnerPlate, NodeId> = {
  infra: "plateInfraRectInset",
  frontend: "plateFrontendRectInset",
  apis: "plateApisRectInset",
  backend: "plateBackendRectInset",
};
const CONTENT_ID: Record<InnerPlate, NodeId> = {
  infra: "plateInfraContent",
  frontend: "plateFrontendContent",
  apis: "plateApisContent",
  backend: "plateBackendContent",
};
const LEADER_ID: Record<InnerPlate, NodeId> = {
  infra: "plateInfraLeader",
  frontend: "plateFrontendLeader",
  apis: "plateApisLeader",
  backend: "plateBackendLeader",
};

function addExposeStage(
  tl: Timeline,
  registry: NodeRegistry,
  offset: number,
  spreadScale: number,
  tiltScale: number,
): void {
  const seenSeamCuts = new Set<NodeId>();

  for (const plate of CASCADE_ORDER) {
    const start = offset + CASCADE_START[plate];
    const wrapper = required(registry, WRAPPER_ID[plate]);
    const rect = required(registry, RECT_ID[plate]);
    const rectInset = required(registry, RECT_INSET_ID[plate]);
    const rectDraw = drawableOf(registry, RECT_ID[plate]);
    const content = required(registry, CONTENT_ID[plate]);
    const leaderDraw = drawableOf(registry, LEADER_ID[plate]);

    const seamCutId = SEAM_CUT_FOR[plate];
    if (!seenSeamCuts.has(seamCutId)) {
      seenSeamCuts.add(seamCutId);
      const cut = required(registry, seamCutId);
      // array-shorthand [0, 0.9, 0.35] over one duration splits into two
      // equal (duration/2) segments — see the matching note in
      // addSeparateStage. Stage 8 (RECONCILE) reuses this element for one
      // final review pulse before the seam closes.
      tl.add(
        cut,
        leadIn(
          { opacity: 0 },
          start,
          { opacity: 0.9, duration: 210, ease: "outQuad" },
          { opacity: 0.35, duration: 210, ease: "outQuad" },
          { opacity: 0.35, duration: RECONCILE_REVIEW_START - (start + 420) },
          { opacity: 0.7, duration: 200, ease: "outQuad" },
          { opacity: 0, duration: 300, ease: "outQuad" },
        ),
        0,
      );
    }

    // precision -> force -> settle: the plate accelerates away then arrives.
    // Stage 8 (RECONCILE) reverses this exact motion, same EASE_SETTLE, once
    // the plate has nothing left to explain and the projects have receded.
    const reassembleHold = RECONCILE_REASSEMBLE_START - (start + 680);
    tl.add(
      wrapper,
      leadIn(
        { translateY: 0, rotate: 0 },
        start,
        {
          translateY: INNER_PLATE_LOCAL_Y[plate] * spreadScale,
          rotate: PLATE_TILT_DEG[plate] * tiltScale,
          duration: 680,
          ease: EASE_SETTLE,
        },
        {
          translateY: INNER_PLATE_LOCAL_Y[plate] * spreadScale,
          rotate: PLATE_TILT_DEG[plate] * tiltScale,
          duration: reassembleHold,
        },
        { translateY: 0, rotate: 0, duration: RECONCILE_REASSEMBLE_MS, ease: EASE_SETTLE },
      ),
      0,
    );
    // rect and rectInset used to share one .add() call (identical values,
    // so no visual change here) — split so stage 10 can extend rectInset
    // alone with a fade, once the rect starts physically traveling and the
    // inset's fixed proportions would no longer match it.
    tl.add(
      rect,
      leadIn({ opacity: 0 }, start + 60, { opacity: 1, duration: 60, ease: EASE_REVEAL }),
      0,
    );
    // this plate's own stage-10 compress start — see addFloorPlanTransformStage
    const plateCompressStart = COMPRESS_OFFSET + INSPECT_ORDER.indexOf(plate) * TRAVEL_STAGGER_MS;
    tl.add(
      rectInset,
      leadIn(
        { opacity: 0 },
        start + 60,
        { opacity: 1, duration: 60, ease: EASE_REVEAL },
        { opacity: 1, duration: plateCompressStart - (start + 120) },
        { opacity: 0, duration: 200, ease: EASE_REVEAL },
      ),
      0,
    );
    tl.add(
      rectDraw,
      leadIn({ draw: "0 0" }, start + 60, { draw: "0 1", duration: 340, ease: EASE_DRAW }),
      0,
    );
    // stage 10 simplifies the diagram+label away (the leader line inherits
    // this via ancestor opacity, so it doesn't need its own fade) before
    // the bare rect starts traveling to its floor-plan zone.
    tl.add(
      content,
      leadIn(
        { opacity: 0 },
        start + 300,
        { opacity: 1, duration: 280, ease: EASE_REVEAL },
        { opacity: 1, duration: plateCompressStart - (start + 580) },
        { opacity: 0, duration: 200, ease: EASE_REVEAL },
      ),
      0,
    );
    tl.add(
      leaderDraw,
      leadIn({ draw: "0 0" }, start + 280, { draw: "0 1", duration: 200, ease: EASE_DRAW }),
      0,
    );
  }
}

// ---------------------------------------------------------------------------
// Cross-stage handoffs: every element whose opacity is set by one stage and
// unset by a later one gets exactly one `.add()` call here, as a single
// reveal -> hold -> hide keyframe sequence, so backward seeks resolve
// correctly (see the architecture note above `DRAW_OFFSET`).
// ---------------------------------------------------------------------------
function addHandoffAnimations(tl: Timeline, registry: NodeRegistry): void {
  const envelope = required(registry, "envelopeOutline");
  const envelopeInset = required(registry, "envelopeInset");
  const dependency1 = required(registry, "dependency1");
  const dependency2 = required(registry, "dependency2");
  const divider1 = required(registry, "divider1");
  const divider2 = required(registry, "divider2");
  const divider3 = required(registry, "divider3");
  const divider4 = required(registry, "divider4");
  const massOutline = required(registry, "massOutline");
  const massOutlineInset = required(registry, "massOutlineInset");

  // Every element here already used one keyframes chain per property (the
  // reveal -> hold -> hide sequence a handoff needs), which solves the
  // "two separate .add() calls" failure mode. But each chain still started
  // at its own revealStart rather than absolute position 0, leaving [0,
  // revealStart) uncovered — the same gap every other stage has, just
  // smaller. leadIn() closes it the same way everywhere else in this file.

  // envelope + its inset section line: revealed alongside the outer stroke,
  // held, hidden as SEPARATE begins
  const envelopeRevealStart = DRAW_OFFSET + 660;
  const envelopeRevealEnd = envelopeRevealStart + 40;
  tl.add(
    [envelope, envelopeInset],
    leadIn(
      { opacity: 0 },
      envelopeRevealStart,
      { opacity: 1, duration: 40 },
      { opacity: 1, duration: SEPARATE_OFFSET - envelopeRevealEnd },
      { opacity: 0, duration: 200, ease: "outQuad" },
    ),
    0,
  );

  // dependency arrows: revealed late in ASSEMBLE, hidden at the start of SEPARATE
  tl.add(
    dependency1,
    leadIn(
      { opacity: 0 },
      ASSEMBLE_OFFSET + 560,
      { opacity: 1, duration: 60 },
      { opacity: 1, duration: SEPARATE_OFFSET - (ASSEMBLE_OFFSET + 620) },
      { opacity: 0, duration: 160 },
    ),
    0,
  );
  tl.add(
    dependency2,
    leadIn(
      { opacity: 0 },
      ASSEMBLE_OFFSET + 660,
      { opacity: 1, duration: 60 },
      { opacity: 1, duration: SEPARATE_OFFSET + 40 - (ASSEMBLE_OFFSET + 720) },
      { opacity: 0, duration: 160 },
    ),
    0,
  );

  // dividers 1-3: revealed in ASSEMBLE, each hidden when its own seam opens in EXPOSE
  const upperDividers: Array<{ el: SVGElement; assembleIndex: number; exposeStart: number }> = [
    { el: divider1, assembleIndex: 0, exposeStart: EXPOSE_OFFSET + CASCADE_START.frontend },
    { el: divider2, assembleIndex: 1, exposeStart: EXPOSE_OFFSET + CASCADE_START.apis },
    { el: divider3, assembleIndex: 2, exposeStart: EXPOSE_OFFSET + CASCADE_START.backend },
  ];
  upperDividers.forEach(({ el, assembleIndex, exposeStart }) => {
    const revealStart = ASSEMBLE_OFFSET + 60 * assembleIndex;
    const revealEnd = revealStart + 40;
    tl.add(
      el,
      leadIn(
        { opacity: 0 },
        revealStart,
        { opacity: 1, duration: 40 },
        { opacity: 1, duration: exposeStart - revealEnd },
        { opacity: 0, duration: 120 },
      ),
      0,
    );
  });

  // divider4: revealed in ASSEMBLE, hidden when the first seam opens in SEPARATE
  const divider4RevealStart = ASSEMBLE_OFFSET + 60 * 3;
  const divider4RevealEnd = divider4RevealStart + 40;
  const divider4FadeStart = SEPARATE_OFFSET + 220;
  tl.add(
    divider4,
    leadIn(
      { opacity: 0 },
      divider4RevealStart,
      { opacity: 1, duration: 40 },
      { opacity: 1, duration: divider4FadeStart - divider4RevealEnd },
      { opacity: 0, duration: 120 },
    ),
    0,
  );

  // massOutline + its inset: revealed in SEPARATE, held, hidden at EXPOSE start
  const massRevealStart = SEPARATE_OFFSET + 80;
  const massRevealEnd = massRevealStart + 200;
  tl.add(
    [massOutline, massOutlineInset],
    leadIn(
      { opacity: 0 },
      massRevealStart,
      { opacity: 1, duration: 200, ease: "outQuad" },
      { opacity: 1, duration: EXPOSE_OFFSET - massRevealEnd },
      { opacity: 0, duration: 200, ease: "outQuad" },
    ),
    0,
  );
}

// ---------------------------------------------------------------------------
// Stage 5 — INSPECT (40-50%): the system inspects each plate in turn. Every
// plate already reached its final resting position in EXPOSE and never
// moves again on its own, so the scrim/mark/annotation elements below are
// pre-positioned in BlueprintScene with a *static* transform (geometry
// .plateRestingTransform) rather than being registered as new animation
// targets for position — only their opacity is driven here.
// ---------------------------------------------------------------------------
const INSPECT_ORDER: PlateId[] = ["data", "backend", "apis", "frontend", "infra"];
const INSPECT_WINDOW = 205;
const INSPECT_RELEASE = 90; // 5 * 205 + 90 = 1115 = PHASE_MS, exactly

const INSPECT_SCRIM_ID: Record<PlateId, NodeId> = {
  infra: "infraInspectScrim",
  frontend: "frontendInspectScrim",
  apis: "apisInspectScrim",
  backend: "backendInspectScrim",
  data: "dataInspectScrim",
};
const INSPECT_MARK_ID: Record<PlateId, NodeId> = {
  infra: "infraInspectMark",
  frontend: "frontendInspectMark",
  apis: "apisInspectMark",
  backend: "backendInspectMark",
  data: "dataInspectMark",
};
const TECH_ANNOTATION_ID: Record<PlateId, NodeId> = {
  infra: "infraTechAnnotation",
  frontend: "frontendTechAnnotation",
  apis: "apisTechAnnotation",
  backend: "backendTechAnnotation",
  data: "dataTechAnnotation",
};
const TECH_VALUE_ID: Record<PlateId, NodeId> = {
  infra: "infraTechValue",
  frontend: "frontendTechValue",
  apis: "apisTechValue",
  backend: "backendTechValue",
  data: "dataTechValue",
};

type OpacityKeyframe = { opacity: number; duration: number; ease?: string };

/**
 * Builds the whole INSPECT-phase opacity lifecycle for one cycling element
 * (a scrim or an inspection mark) in a single keyframe chain — required so
 * backward seeks resolve correctly (see the architecture note above
 * DRAW_OFFSET). Five 205ms segments, one per plate's inspection window,
 * followed by a 90ms release segment that returns every such element to
 * `releaseOpacity` so EVIDENCE starts from a neutral, undimmed drawing.
 */
function buildInspectCycle(
  ownIndex: number,
  activeOpacity: number,
  inactiveOpacity: number,
  releaseOpacity: number,
  ease: string,
): OpacityKeyframe[] {
  const frames: OpacityKeyframe[] = INSPECT_ORDER.map((_, i) => ({
    opacity: i === ownIndex ? activeOpacity : inactiveOpacity,
    duration: INSPECT_WINDOW,
    ease,
  }));
  frames.push({ opacity: releaseOpacity, duration: INSPECT_RELEASE, ease: EASE_REVEAL });
  return frames;
}

function addInspectStage(tl: Timeline, registry: NodeRegistry): void {
  INSPECT_ORDER.forEach((plate, i) => {
    const scrim = required(registry, INSPECT_SCRIM_ID[plate]);
    const mark = required(registry, INSPECT_MARK_ID[plate]);
    const annotation = required(registry, TECH_ANNOTATION_ID[plate]);
    const value = required(registry, TECH_VALUE_ID[plate]);

    // Every keyframe chain below starts at absolute position 0 and covers
    // the element's ENTIRE lifecycle in one `.add()` call — including a
    // leading hold segment for the dead time before anything happens.
    // anime only re-evaluates a property while some tween's own [start,end]
    // window contains the seek time; a gap between a `.set()` and a later
    // `.add()` is owned by nothing, so seeking backward INTO that gap from
    // a point past it leaves the property stuck at whatever the last seek
    // rendered, instead of the pre-reveal value. A single, gap-free chain
    // per property is the only way scrubbing (including a hard jump, e.g.
    // the End/Home keys or a scrollbar-track click) resolves correctly at
    // every position — see the DRAW_OFFSET note above for the sibling
    // failure mode (two separate `.add()` calls) this generalizes.

    // the other plates recede while this one is under inspection
    tl.add(
      scrim,
      {
        keyframes: [
          { opacity: 0, duration: INSPECT_OFFSET },
          ...buildInspectCycle(i, 0, INSPECT_SCRIM_OPACITY, 0, EASE_REVEAL),
        ],
      },
      0,
    );
    // a confirmed inspection point: the bracket clicks on, then off
    tl.add(
      mark,
      {
        keyframes: [
          { opacity: 0, duration: INSPECT_OFFSET },
          ...buildInspectCycle(i, 1, 0, 0, EASE_SNAP),
        ],
      },
      0,
    );

    // The heading+rules (annotation) and the technology value line below
    // it used to fade together. Priority 4 (motion-quality pass) splits
    // them: the value line disappears outright when RECONCILE begins
    // folding, so stage 9 (WHOLE AGAIN) reads as "TRACE: DATA / BACKEND /
    // ..." rather than a heading sitting over a half-legible value — the
    // heading alone continues to a quiet TRACE_OPACITY and persists as
    // that trace. Both clear away for good once this plate's own rect
    // starts physically traveling to its floor-plan zone (stage 10).
    const windowStart = INSPECT_OFFSET + i * INSPECT_WINDOW;
    const revealStart = windowStart + 40;
    const revealEnd = revealStart + 180;
    const foldHold = RECONCILE_OFFSET - revealEnd;
    const plateCompressStart = COMPRESS_OFFSET + i * TRAVEL_STAGGER_MS;
    const traceHold = plateCompressStart - (RECONCILE_OFFSET + 400);
    tl.add(
      annotation,
      {
        keyframes: [
          { opacity: 0, duration: revealStart },
          { opacity: 1, duration: 180, ease: EASE_REVEAL },
          { opacity: 1, duration: foldHold },
          { opacity: TRACE_OPACITY, duration: 400, ease: EASE_REVEAL },
          { opacity: TRACE_OPACITY, duration: traceHold },
          { opacity: 0, duration: 300, ease: EASE_REVEAL },
        ],
      },
      0,
    );
    tl.add(
      value,
      {
        keyframes: [
          { opacity: 0, duration: revealStart },
          { opacity: 1, duration: 180, ease: EASE_REVEAL },
          { opacity: 1, duration: foldHold },
          { opacity: 0, duration: 250, ease: EASE_REVEAL },
        ],
      },
      0,
    );
  });
}

// ---------------------------------------------------------------------------
// Stages 6-7 — EVIDENCE (50-60%) then PROOF (60-70%): project evidence
// emerges from the architecture plate it belongs to, then resolves into the
// fixed, readable column. The leader/marker/compact-card and the full
// column card share one project's lifecycle each, authored together here
// (rather than split "by stage") because the leader and marker specifically
// span all the way from their EVIDENCE reveal through PROOF and only
// retract at the very end — splitting that into two `.add()` calls per
// property would hit the same backward-seek bug the file-level note above
// DRAW_OFFSET warns about.
// ---------------------------------------------------------------------------
const EVIDENCE_PROJECTS = PROJECTS.slice(0, 5);
const EVIDENCE_LEADER_ID: NodeId[] = [
  "evidenceLeader1",
  "evidenceLeader2",
  "evidenceLeader3",
  "evidenceLeader4",
  "evidenceLeader5",
];
const EVIDENCE_MARKER_ID: NodeId[] = [
  "evidenceMarker1",
  "evidenceMarker2",
  "evidenceMarker3",
  "evidenceMarker4",
  "evidenceMarker5",
];
const EVIDENCE_COMPACT_ID: NodeId[] = [
  "evidenceCompactCard1",
  "evidenceCompactCard2",
  "evidenceCompactCard3",
  "evidenceCompactCard4",
  "evidenceCompactCard5",
];
const EVIDENCE_FULL_ID: NodeId[] = [
  "evidenceFullCard1",
  "evidenceFullCard2",
  "evidenceFullCard3",
  "evidenceFullCard4",
  "evidenceFullCard5",
];

const EVIDENCE_SEQUENCE_MS = 460; // leader draw -> marker snap -> compact reveal, per project
const RECONVERGE_MS = 120; // tail window where leaders/markers retract

function addEvidenceProofStage(tl: Timeline, registry: NodeRegistry): void {
  const n = EVIDENCE_PROJECTS.length;
  if (n === 0) return;

  const evidenceStagger =
    n > 1 ? Math.min(300, Math.floor((PHASE_MS - EVIDENCE_SEQUENCE_MS) / (n - 1))) : 0;
  // full-card reveals live inside PROOF's own budget and must all finish,
  // settle included, by TIMELINE_END — staggered to fit whatever's left
  // after their own reveal+settle duration.
  const fullBudgetStart = PROOF_OFFSET + 150;
  const fullBudgetEnd = TIMELINE_END - 400; // 340 reveal + 60 settle
  const fullStagger =
    n > 1 ? Math.max(0, Math.floor((fullBudgetEnd - fullBudgetStart) / (n - 1))) : 0;
  const retractStart = TIMELINE_END - RECONVERGE_MS;

  EVIDENCE_PROJECTS.forEach((_project, i) => {
    const s = EVIDENCE_OFFSET + i * evidenceStagger;

    const leader = drawableOf(registry, EVIDENCE_LEADER_ID[i]);
    const marker = required(registry, EVIDENCE_MARKER_ID[i]);
    const compact = required(registry, EVIDENCE_COMPACT_ID[i]);
    const full = required(registry, EVIDENCE_FULL_ID[i]);

    // Every chain below starts at absolute position 0 with a leading hold
    // segment — see the note in addInspectStage on why a gap between a
    // `.set()` and a later `.add()` breaks backward jumps.

    // leader: draws off the plate, holds through PROOF, retracts at the very end
    const leaderDrawEnd = s + 200;
    tl.add(
      leader,
      {
        keyframes: [
          { draw: "0 0", duration: s },
          { draw: "0 1", duration: 200, ease: EASE_DRAW },
          { draw: "0 1", duration: Math.max(0, retractStart - leaderDrawEnd) },
          { draw: "0 0", duration: RECONVERGE_MS, ease: EASE_DRAW },
        ],
      },
      0,
    );

    // marker: snaps in just after the leader lands, holds, fades at retraction
    const markerStart = s + 160;
    const markerRevealEnd = markerStart + 150;
    tl.add(
      marker,
      {
        keyframes: [
          { opacity: 0, duration: markerStart },
          { opacity: 1, duration: 150, ease: EASE_SNAP },
          { opacity: 1, duration: Math.max(0, retractStart - markerRevealEnd) },
          { opacity: 0, duration: RECONVERGE_MS, ease: EASE_REVEAL },
        ],
      },
      0,
    );

    // compact card: resolves in EVIDENCE, fades out right as PROOF begins
    // (its full-column counterpart takes over)
    const compactStart = s + 280;
    const compactRevealEnd = compactStart + 220;
    tl.add(
      compact,
      {
        keyframes: [
          { opacity: 0, duration: compactStart },
          { opacity: 1, duration: 220, ease: EASE_REVEAL },
          { opacity: 1, duration: Math.max(0, PROOF_OFFSET - compactRevealEnd) },
          { opacity: 0, duration: 180, ease: EASE_REVEAL },
        ],
      },
      0,
    );

    // full column card: settles into the fixed report column during PROOF,
    // a small reconvergence-cue settle at 70%, then stage 8 (RECONCILE)
    // condenses it away — the last piece of visible evidence to go, per the
    // brief's "project cards -> compact -> ... -> disappear into the
    // architecture" sequence (the leader/marker retraction above already
    // covers the earlier steps of that sequence, at the very end of PROOF).
    const fullStart = fullBudgetStart + i * fullStagger;
    const fullRevealEnd = fullStart + 340;
    const condenseStart = RECONCILE_OFFSET + i * 100;
    tl.add(
      full,
      {
        keyframes: [
          { opacity: 0, translateY: 14, duration: fullStart },
          { opacity: 1, translateY: 0, duration: 340, ease: EASE_SETTLE },
          { opacity: 1, translateY: 0, duration: Math.max(0, TIMELINE_END - 60 - fullRevealEnd) },
          { opacity: 0.94, translateY: 0, duration: 60, ease: EASE_REVEAL },
          { opacity: 0.94, translateY: 0, duration: condenseStart - TIMELINE_END },
          { opacity: 0, translateY: -10, duration: 260, ease: EASE_REVEAL },
        ],
      },
      0,
    );
  });
}

// ---------------------------------------------------------------------------
// Stage 7 (PROOF, tail) through stage 9 (WHOLE AGAIN) — blueprintRoot's own
// transform, in one chain since it's never touched by any other function:
// PROOF shifts the whole drawing left to make room for the project column;
// RECONCILE/WHOLE AGAIN hold that; then, before stage 10's physical
// transform begins, blueprintRoot returns to identity (translateX 0, scale
// 1) so every plate rect's own local x/y/width/height — which stage 10
// animates directly — line up with the floor-plan zones' coordinates
// one-to-one. blueprintRoot's opacity stays at 1 throughout: the primary
// transformation is the plates physically traveling, not this group fading.
// ---------------------------------------------------------------------------
function addProofRootShift(tl: Timeline, registry: NodeRegistry): void {
  const root = required(registry, "blueprintRoot");
  const shiftEnd = PROOF_OFFSET + 520;
  const returnStart = COMPRESS_OFFSET - 450;
  const returnMs = 400;
  // One chain from position 0 — see the note in addInspectStage.
  tl.add(
    root,
    {
      keyframes: [
        { translateX: 0, scale: 1, duration: PROOF_OFFSET },
        { translateX: PROOF_SHIFT_X, scale: PROOF_SCALE, duration: 520, ease: EASE_SETTLE },
        { translateX: PROOF_SHIFT_X, scale: PROOF_SCALE, duration: returnStart - shiftEnd },
        { translateX: 0, scale: 1, duration: returnMs, ease: EASE_SETTLE },
      ],
    },
    0,
  );
}

// ---------------------------------------------------------------------------
// Stage 10 — FLOOR PLAN (88-100%): the system physically becomes its own
// navigation. Five of the six zones are not new elements at all — they're
// the ORIGIN PLATE'S OWN RECT, its diagram/label/inset simplified away (see
// the fades added in addExposeStage/addSeparateStage above), animated
// directly on x/y/width/height from its architecture-band geometry to its
// zone's bounds. Plate and zone are both plain <rect>s, so this is direct
// SVG attribute interpolation — no path morphing, no new library. The
// zone's own label+ticks (a sibling of blueprintRoot, see BlueprintScene)
// fade in once that specific rect has arrived, not on a shared timer.
// CONTACT has no honest architectural origin (see geometry.ts) and is the
// one zone that still grows in from nothing, arriving last.
// ---------------------------------------------------------------------------
const ZONE_GROUP_ID: Record<string, NodeId> = {
  about: "zoneAboutGroup",
  architecture: "zoneArchitectureGroup",
  projects: "zoneProjectsGroup",
  experience: "zoneExperienceGroup",
  skills: "zoneSkillsGroup",
  contact: "zoneContactGroup",
};

const PLATE_RECT_ID: Record<PlateId, NodeId> = {
  data: "dataRect",
  infra: "plateInfraRect",
  frontend: "plateFrontendRect",
  apis: "plateApisRect",
  backend: "plateBackendRect",
};

function zoneFor(zoneId: string, isMobileLayout: boolean): FloorPlanZone {
  const list = isMobileLayout ? FLOOR_PLAN_ZONES_MOBILE : FLOOR_PLAN_ZONES;
  const zone = list.find((z) => z.id === zoneId);
  if (!zone) {
    throw new Error(`Blueprint animation: no floor-plan zone registered for id "${zoneId}"`);
  }
  return zone;
}

function addFloorPlanTransformStage(
  tl: Timeline,
  registry: NodeRegistry,
  isMobileLayout: boolean,
): void {
  const group = required(registry, "floorPlanGroup");
  tl.add(
    group,
    leadIn({ opacity: 0 }, COMPRESS_OFFSET, { opacity: 1, duration: 300, ease: EASE_REVEAL }),
    0,
  );

  INSPECT_ORDER.forEach((plate, i) => {
    const zoneId = PLATE_TO_ZONE[plate];
    const zone = zoneFor(zoneId, isMobileLayout);
    const rect = required(registry, PLATE_RECT_ID[plate]);
    const top = BAND_TOP[plate];
    const original = { x: ENVELOPE_X, y: top, width: ENVELOPE_W, height: BAND_H };
    const compressed = compressedPlateRect(original.x, original.y, original.width, original.height);

    const compressStart = COMPRESS_OFFSET + i * TRAVEL_STAGGER_MS;
    const travelStart = compressStart + COMPRESS_MS;
    const arriveAt = travelStart + TRAVEL_MS;

    // volume -> compressed volume -> travel to the zone's exact bounds.
    // Same EASE_SETTLE both segments: precision, force, settle — the plate
    // visibly reorganizes rather than snapping or dissolving.
    tl.add(
      rect,
      leadIn(
        original,
        compressStart,
        { ...compressed, duration: COMPRESS_MS, ease: EASE_SETTLE },
        { x: zone.x, y: zone.y, width: zone.w, height: zone.h, duration: TRAVEL_MS, ease: EASE_SETTLE },
      ),
      0,
    );

    // the zone's own label+ticks fade in once THIS rect has arrived — not
    // a shared timer, so each room registers as its plate settles.
    const zoneNode = required(registry, ZONE_GROUP_ID[zoneId]);
    tl.add(
      zoneNode,
      leadIn(
        { opacity: 0 },
        arriveAt + 60,
        { opacity: 1, duration: ZONE_LABEL_MS, ease: EASE_SETTLE },
      ),
      0,
    );
  });

  // CONTACT: no architectural origin (see geometry.ts) — grows in on its
  // own, after the five mapped rooms have physically settled.
  const contactNode = required(registry, ZONE_GROUP_ID.contact);
  tl.add(
    contactNode,
    leadIn(
      { scale: 0.2, opacity: 0 },
      CONTACT_OFFSET,
      { scale: 1, opacity: 1, duration: CONTACT_MS, ease: EASE_SETTLE },
    ),
    0,
  );
}

/**
 * @param spreadScale How far plates travel when separated, 0-1. Desktop
 * uses the full 1.0 spread; smaller viewports pass a smaller value so the
 * exploded assembly still fits without shrinking the drawing itself.
 */
export function buildTimeline(
  registry: NodeRegistry,
  spreadScale = 1,
  isMobileLayout = false,
): Timeline {
  const tl = createTimeline({ autoplay: false });
  // Mobile drops the fanned tilt entirely (an isometric-depth cue that
  // doesn't help a narrow screen) while keeping the same vertical spread —
  // see Priority 2 in the motion-quality pass.
  const tiltScale = isMobileLayout ? 0 : spreadScale;
  addDrawStage(tl, registry, DRAW_OFFSET);
  addAssembleStage(tl, registry, ASSEMBLE_OFFSET);
  addSeparateStage(tl, registry, SEPARATE_OFFSET, spreadScale);
  addExposeStage(tl, registry, EXPOSE_OFFSET, spreadScale, tiltScale);
  addHandoffAnimations(tl, registry);
  addInspectStage(tl, registry);
  addEvidenceProofStage(tl, registry);
  addProofRootShift(tl, registry);
  addFloorPlanTransformStage(tl, registry, isMobileLayout);
  return tl;
}

function clamp01(n: number): number {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

/** The single source of truth: scroll position, mapped straight onto the timeline. */
export function applyProgress(tl: Timeline, globalProgress: number): void {
  tl.seek(clamp01(globalProgress) * tl.duration);
}

export function revertTimeline(tl: Timeline): void {
  tl.revert();
}
