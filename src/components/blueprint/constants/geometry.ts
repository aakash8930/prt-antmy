/**
 * All spatial constants for the Blueprint centerpiece live here, and nowhere
 * else. Every position used by the SVG scene or the animation timelines is
 * derived from these numbers so the "merged" (stages 1-2), "first seam"
 * (stage 3) and "exposed" (stage 4) states stay geometrically consistent
 * with each other by construction, not by hand-matched coordinates.
 */

export const VIEW_W = 1000;
export const VIEW_H = 720;

/**
 * Mobile (<640px) — a tighter static crop of the same 1000x720 drawing
 * (same aspect ratio, so nothing letterboxes), centered on the envelope.
 * The QA pass found the drawing rendering at ~150-170px of a 390px screen
 * under the full viewBox — content, not just CSS, needs to occupy more of
 * the viewport. This is a plain `viewBox` swap, not new geometry: every
 * coordinate in the scene is unchanged, only how much of the canvas is
 * framed changes, the same way bp-stage-frame's own width already differs
 * by breakpoint.
 */
export const MOBILE_VIEW_BOX = { x: 190, y: 39, width: 780, height: 562 };

export const ENVELOPE_X = 300;
export const ENVELOPE_W = 400;
export const BAND_H = 64;

export type PlateId = "infra" | "frontend" | "apis" | "backend" | "data";

/** Stacking order top -> bottom while the system is still one merged volume. */
export const PLATE_ORDER: PlateId[] = [
  "infra",
  "frontend",
  "apis",
  "backend",
  "data",
];

const ENVELOPE_TOP = 160;

/** Original (pre-separation) top edge of each band, contiguous, no gaps. */
export const BAND_TOP: Record<PlateId, number> = PLATE_ORDER.reduce(
  (acc, id, i) => {
    acc[id] = ENVELOPE_TOP + i * BAND_H;
    return acc;
  },
  {} as Record<PlateId, number>,
);

export const ENVELOPE_TOP_Y = ENVELOPE_TOP;
export const ENVELOPE_BOTTOM_Y = ENVELOPE_TOP + PLATE_ORDER.length * BAND_H;
export const ENVELOPE_H = ENVELOPE_BOTTOM_Y - ENVELOPE_TOP_Y;

/** The four internal seam lines, in original merged coordinates. */
export const SEAM_Y = {
  infraFrontend: BAND_TOP.frontend,
  frontendApis: BAND_TOP.apis,
  apisBackend: BAND_TOP.backend,
  backendData: BAND_TOP.data,
} as const;

/** Stage 3 — how far the data plate drops, and how far the rest lifts. */
export const MASS_LIFT = 18;
export const DATA_DROP = 130;

/**
 * Stage 4 — additional per-plate offset applied *inside* the already-lifted
 * mass wrapper, cascading from infra (0) down to backend (3 gaps). Because
 * this is local to the mass wrapper, it composes with MASS_LIFT for free
 * through normal SVG parent/child transforms instead of fighting over the
 * same property.
 */
export const GAP_EXPLODE = 34;

export const INNER_PLATE_LOCAL_Y: Record<
  Exclude<PlateId, "data">,
  number
> = {
  infra: 0,
  frontend: GAP_EXPLODE,
  apis: GAP_EXPLODE * 2,
  backend: GAP_EXPLODE * 3,
};

/** Small permanent tilt once fully separated — a fanned, inspectable look. */
export const PLATE_TILT_DEG: Record<PlateId, number> = {
  infra: -2.6,
  frontend: 1.7,
  apis: -1.7,
  backend: 2.6,
  data: 0, // the foundation stays level
};

/** Inset amount for the thin "wall thickness" line inside every plate outline. */
export const SECTION_INSET = 7;

/** Given an outline rect, the inset sectional-line rect nested inside it. */
export function insetRect(x: number, y: number, width: number, height: number) {
  return {
    x: x + SECTION_INSET,
    y: y + SECTION_INSET,
    width: width - SECTION_INSET * 2,
    height: height - SECTION_INSET * 2,
  };
}

// ---- derived, read-only values used for on-drawing dimension callouts ----

function bandBottomAbs(id: Exclude<PlateId, "data">): number {
  return BAND_TOP[id] + BAND_H - MASS_LIFT + INNER_PLATE_LOCAL_Y[id];
}

export const DATA_TOP_ABS = BAND_TOP.data + DATA_DROP;
export const BACKEND_BOTTOM_ABS = bandBottomAbs("backend");
export const SEAM_GAP_DATA = DATA_TOP_ABS - BACKEND_BOTTOM_ABS;

export const MASS_OUTLINE = {
  x: ENVELOPE_X,
  y: ENVELOPE_TOP_Y,
  width: ENVELOPE_W,
  height: BAND_H * 4, // infra..backend, before data separates
};

/**
 * Stages 5-7 (40-70%, INSPECTION -> EVIDENCE -> PROOF) reuse the same
 * exploded plate positions stages 3-4 already computed, but as STATIC
 * offsets rather than animated ones: by the time inspection begins every
 * plate has already finished separating and never moves again on its own,
 * so new per-plate elements (scrims, inspection marks, tech annotations,
 * evidence markers) can be pre-positioned once in React with a plain SVG
 * `transform` attribute instead of being registered as animation targets.
 * They still move/scale as a whole during PROOF because they're nested
 * inside the same `blueprintRoot` group as everything else.
 */
export function plateRestingTransform(id: PlateId): string {
  if (id === "data") return `translate(0, ${DATA_DROP})`;
  const y = -MASS_LIFT + INNER_PLATE_LOCAL_Y[id];
  const cx = ENVELOPE_X + ENVELOPE_W / 2;
  const localCy = BAND_TOP[id] + BAND_H / 2;
  // rotate around the plate's own (pre-translate) center, then shift into
  // its exploded position — same composition the animated wrapper produces.
  return `translate(0, ${y}) rotate(${PLATE_TILT_DEG[id]} ${cx} ${localCy})`;
}

/** How far a plate recedes (opacity) while a sibling plate is under inspection. */
export const INSPECT_SCRIM_OPACITY = 0.55;

/** Stage 7 (PROOF) — how far the whole assembly shifts/shrinks to make room
 * for the fixed project column, and where that column sits. */
export const PROOF_SHIFT_X = -130;
export const PROOF_SCALE = 0.78;

export const PROJECT_COLUMN_X = 760;
export const PROJECT_COLUMN_TOP = 150;
export const PROJECT_COLUMN_GAP = 18;
export const PROJECT_CARD_W = 220;

/**
 * Stage 8 (RECONCILE) — how faint the INSPECTION-phase tech annotation
 * headings fold to rather than disappearing outright: they persist as the
 * "traces of the five architectural layers" stage 9 (WHOLE AGAIN) asks
 * for. The secondary technology/value line underneath fades to 0 instead
 * of this — see addRefinementStage in buildTimelines.ts.
 */
export const TRACE_OPACITY = 0.28;

/**
 * Mobile-only geometry for stages 5-7 (40-70%), INSPECTION -> EVIDENCE ->
 * PROOF. The desktop composition for this window (fixed right-side project
 * column, left-anchored evidence callouts) is a "cramped scaled desktop
 * layout" on a narrow screen — this section gives mobile its OWN spatial
 * targets for the SAME semantic stages, per the resolver model: global
 * progress -> desktop/mobile geometry resolver -> same stage -> different
 * spatial target. None of this changes desktop geometry, timing, or the
 * animated properties buildTimelines.ts drives (still just opacity/draw/
 * translateY) — only WHERE on mobile those properties are applied to.
 */

/** Must match BlueprintCenterpiece's spreadScaleForWidth() mobile value. */
export const MOBILE_SPREAD_SCALE = 0.4;

function mobilePlateTopAbs(id: PlateId): number {
  if (id === "data") return BAND_TOP.data + DATA_DROP * MOBILE_SPREAD_SCALE;
  const offset =
    -MASS_LIFT * MOBILE_SPREAD_SCALE + INNER_PLATE_LOCAL_Y[id] * MOBILE_SPREAD_SCALE;
  return BAND_TOP[id] + offset;
}

/** Each plate's mobile-resting vertical center once EXPOSE has finished
 * (40% onward, unchanged through RECONCILE at 70%) — the same positions
 * addExposeStage's wrapper animation already produces for spreadScale 0.4,
 * just read back out in absolute coordinates so a tracking viewBox can pan
 * to them without touching that animation. */
export const MOBILE_PLATE_CENTER_Y: Record<PlateId, number> = PLATE_ORDER.reduce(
  (acc, id) => {
    acc[id] = mobilePlateTopAbs(id) + BAND_H / 2;
    return acc;
  },
  {} as Record<PlateId, number>,
);

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Holds at `values[i]` once past `starts[i] + swing`; swings linearly from
 * `values[i-1]` during the first `swing` points of each window. Produces a
 * "settle on one thing, then move" camera instead of continuous drifting. */
function lerpSteps(percent: number, starts: number[], values: number[], swing: number): number {
  let idx = 0;
  for (let i = 0; i < starts.length; i++) {
    if (percent >= starts[i]) idx = i;
  }
  if (idx === 0 || percent >= starts[idx] + swing) return values[idx];
  const t = (percent - starts[idx]) / swing;
  return lerp(values[idx - 1], values[idx], t);
}

export type MobileFocusBox = { x: number; y: number; width: number; height: number };

const MOBILE_CX = ENVELOPE_X + ENVELOPE_W / 2;
// bp-stage-frame is a tall 3:4 box below 640px (see blueprint.css) — a wide
// crop (like the plate's own ~6:1 native proportions) letterboxes badly
// inside it (most of the tall frame goes unused). These are picked close to
// that 3:4 ratio instead, so the active plate actually fills the portrait
// frame rather than floating in a thin horizontal strip of it.
const INSPECT_CROP = { width: 520, height: 580 };
const EVIDENCE_CROP = { width: 560, height: 660 };
/** PROOF's crop is fixed (not tracking): the envelope settles into the
 * upper portion, the vertical project sequence (MOBILE_PROOF_*) occupies
 * the room below it in the SAME crop, per the "blueprint remains visually
 * present as context" requirement. */
const PROOF_CROP: MobileFocusBox = { x: 190, y: 100, width: 780, height: 950 };

// Inspection: same 5-plate order INSPECT_ORDER establishes in
// buildTimelines.ts, split into equal windows across the stage's own
// [40,50] label boundary (constants/stages.ts STAGE_BOUNDS.inspect) rather
// than converting that file's internal ms offsets to percent — the ms
// scale (PHASE_MS = 111.5ms/point) is only exactly linear against
// scroll-percent up to TIMELINE_END; once RECONCILE/WHOLE_AGAIN/FLOOR_PLAN
// extend tl.duration past that (their own pacing is explicitly documented
// as "not hand-calibrated" there), percent = ms/tl.duration*100 drifts from
// that assumption — verified empirically (a hand-converted ms breakpoint
// landed the camera ~4 points early against the real reveal). Equal
// division against the label boundary is what the on-screen stage caption
// itself is keyed to, so it's the more honest sync target.
const INSPECT_PLATES: PlateId[] = ["data", "backend", "apis", "frontend", "infra"];
const INSPECT_STARTS = [40, 42, 44, 46, 48];
const INSPECT_SWING = 0.8;

// Evidence: same project order addEvidenceProofStage uses — backend
// (CraveCart) -> frontend (GENKO) -> data (QuantX) — equal windows across
// [50,60] for the same reason as INSPECT_STARTS above.
const EVIDENCE_PLATES: PlateId[] = ["backend", "frontend", "data"];
const EVIDENCE_STARTS = [50, 53.33, 56.67];
const EVIDENCE_SWING = 1.2;
/** Bias the evidence camera below the plate's own center so the leader +
 * card emerging beneath it stay in frame, not just the plate itself. */
const EVIDENCE_Y_BIAS = 70;

/**
 * Mobile-only continuous camera for the 40-70% window. Stages 0-40 and
 * 70-100 keep their existing static crops (MOBILE_VIEW_BOX, then the full
 * canvas) — this is only ever consulted for percent in [40, 70).
 */
export function mobileFocusViewBox(percent: number): MobileFocusBox {
  if (percent < 50) {
    const values = INSPECT_PLATES.map((p) => MOBILE_PLATE_CENTER_Y[p]);
    const cy = lerpSteps(percent, INSPECT_STARTS, values, INSPECT_SWING);
    return {
      x: MOBILE_CX - INSPECT_CROP.width / 2,
      y: cy - INSPECT_CROP.height / 2,
      width: INSPECT_CROP.width,
      height: INSPECT_CROP.height,
    };
  }
  if (percent < 60) {
    const values = EVIDENCE_PLATES.map((p) => MOBILE_PLATE_CENTER_Y[p] + EVIDENCE_Y_BIAS);
    const cy = lerpSteps(percent, EVIDENCE_STARTS, values, EVIDENCE_SWING);
    return {
      x: MOBILE_CX - EVIDENCE_CROP.width / 2,
      y: cy - EVIDENCE_CROP.height / 2,
      width: EVIDENCE_CROP.width,
      height: EVIDENCE_CROP.height,
    };
  }
  return PROOF_CROP;
}

/**
 * Mobile PROOF (60-70%) project sequence — a vertical stack below the
 * envelope within the SAME crop as the architecture (PROOF_CROP above), not
 * a fixed right column. Width fits the crop with comfortable margins;
 * MOBILE_PROOF_TOP sits just below the mobile-resting envelope's bottom
 * edge (data plate bottom ~= 468 + 64 = 532).
 */
export const MOBILE_PROOF_CARD_W = 480;
export const MOBILE_PROOF_TOP = 570;
export const MOBILE_PROOF_GAP = 26;
export const MOBILE_PROOF_CENTER_X = MOBILE_CX;

/**
 * Stage 10 (FLOOR PLAN, 88-100%) — the site's navigation, drawn as six
 * rooms on a technical plan rather than a nav bar. Same footprint as the
 * envelope (ENVELOPE_X..+ENVELOPE_W) so the plan reads as having grown out
 * of the same drawing rather than a new, unrelated layout.
 *
 * `originPlate` is the architecture plate this zone's ROOM PHYSICALLY IS —
 * that plate's own rect is what travels to and becomes this zone's bounds
 * (see buildTimelines.ts's addFloorPlanTransformStage). Five of the six
 * zones have an honest one, chosen by what that plate's own annotation
 * already says about itself, not by force-fitting a grid position:
 *   DATA (foundation)         -> ARCHITECTURE (the technical foundation)
 *   BACKEND (services/logic)  -> EXPERIENCE (the professional depth)
 *   APIS (contracts/endpoints)-> PROJECTS (the exposed, tangible surface)
 *   FRONTEND (what's visible) -> ABOUT (the front-facing introduction)
 *   INFRA (deployment/tooling)-> SKILLS (the operational toolkit)
 * CONTACT has no defensible architectural origin and is deliberately not
 * forced into one — it arrives on its own, after the other five have
 * physically settled.
 */
export type FloorPlanZone = {
  id: string;
  label: string;
  href: string;
  x: number;
  y: number;
  w: number;
  h: number;
  originPlate: PlateId | null;
};

export const PLATE_TO_ZONE: Record<PlateId, string> = {
  data: "architecture",
  backend: "experience",
  apis: "projects",
  frontend: "about",
  infra: "skills",
};

const ZONE_W = 180;
const ZONE_H = 120;
const ZONE_GAP_X = 40;
const ZONE_GAP_Y = 25;
const ZONE_COL1_X = ENVELOPE_X;
const ZONE_COL2_X = ENVELOPE_X + ZONE_W + ZONE_GAP_X;
const ZONE_ROW1_Y = 170;
const ZONE_ROW2_Y = ZONE_ROW1_Y + ZONE_H + ZONE_GAP_Y;
const ZONE_ROW3_Y = ZONE_ROW2_Y + ZONE_H + ZONE_GAP_Y;

/** Desktop/tablet — a 2-column grid, same footprint as the envelope. */
export const FLOOR_PLAN_ZONES: FloorPlanZone[] = [
  { id: "about", label: "ABOUT", href: "#about", x: ZONE_COL1_X, y: ZONE_ROW1_Y, w: ZONE_W, h: ZONE_H, originPlate: "frontend" },
  { id: "architecture", label: "ARCHITECTURE", href: "#architecture", x: ZONE_COL2_X, y: ZONE_ROW1_Y, w: ZONE_W, h: ZONE_H, originPlate: "data" },
  { id: "projects", label: "PROJECTS", href: "#projects", x: ZONE_COL1_X, y: ZONE_ROW2_Y, w: ZONE_W, h: ZONE_H, originPlate: "apis" },
  { id: "experience", label: "EXPERIENCE", href: "#experience", x: ZONE_COL2_X, y: ZONE_ROW2_Y, w: ZONE_W, h: ZONE_H, originPlate: "backend" },
  { id: "skills", label: "SKILLS", href: "#skills", x: ZONE_COL1_X, y: ZONE_ROW3_Y, w: ZONE_W, h: ZONE_H, originPlate: "infra" },
  { id: "contact", label: "CONTACT", href: "#contact", x: ZONE_COL2_X, y: ZONE_ROW3_Y, w: ZONE_W, h: ZONE_H, originPlate: null },
];

/** Mobile (<640px) — a single vertical column, matching the mobile explode
 * strategy elsewhere: compress the geometry rather than reflow the concept. */
const MOBILE_ZONE_W = 340;
const MOBILE_ZONE_H = 74;
const MOBILE_ZONE_GAP = 14;
const MOBILE_ZONE_X = ENVELOPE_X + ENVELOPE_W / 2 - MOBILE_ZONE_W / 2;
const MOBILE_ROW0_Y = 130;

export const FLOOR_PLAN_ZONES_MOBILE: FloorPlanZone[] = FLOOR_PLAN_ZONES.map((zone, i) => ({
  ...zone,
  x: MOBILE_ZONE_X,
  y: MOBILE_ROW0_Y + i * (MOBILE_ZONE_H + MOBILE_ZONE_GAP),
  w: MOBILE_ZONE_W,
  h: MOBILE_ZONE_H,
}));

/**
 * Stage 10 — the intermediate "compressed" size a plate's rect passes
 * through before it travels to its zone: a visible beat (volume ->
 * compressed volume) rather than the resize happening invisibly at the
 * start of the travel tween. Shrunk and re-centered on the plate's own
 * original position, not its future destination.
 */
export function compressedPlateRect(x: number, y: number, width: number, height: number) {
  const w = width * 0.8;
  const h = height * 0.6;
  return { x: x + (width - w) / 2, y: y + (height - h) / 2, width: w, height: h };
}
