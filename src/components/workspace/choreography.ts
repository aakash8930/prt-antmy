import type { IntegratedChapterId } from "@/components/build-graph/chapterVisualResolver";
import type { GraphViewport } from "@/components/build-graph/model";

export type ChoreographyRole =
  | "interface"
  | "api"
  | "service"
  | "data"
  | "workbench"
  | "sources"
  | "assets"
  | "admin"
  | "payment"
  | "location"
  | "maps"
  | "tracking"
  | "constraints"
  | "delivery"
  | "legacy"
  | "inspection"
  | "rebuild"
  | "shared"
  | "learning"
  | "productResearch"
  | "productAI"
  | "aiInputs"
  | "decision"
  | "outcomes"
  | "implementation"
  | "testing"
  | "market"
  | "features"
  | "models"
  | "riskGates"
  | "actions"
  | "unresolved"
  | "capability"
  | "provenance"
  | "frontier"
  | "contact";

export type CompositionMode = "copy-left" | "copy-right" | "copy-center" | "visual-dominant";

type RoleFrame = {
  x?: number;
  y?: number;
  z?: number;
  scale?: number;
  opacity?: number;
};

type RootFrame = {
  x?: number;
  y?: number;
  scale?: number;
  rotationY?: number;
};

type CameraFrame = {
  x: number;
  y: number;
  z: number;
  lookX?: number;
  lookY?: number;
  lookZ?: number;
};

export type ChoreographyFrame = {
  composition: CompositionMode;
  root?: RootFrame;
  camera?: CameraFrame;
  roles: Partial<Record<ChoreographyRole, RoleFrame>>;
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const mix = (from: number, to: number, progress: number) => from + (to - from) * progress;

function smoothRange(progress: number, start: number, end: number): number {
  if (end <= start) return progress >= end ? 1 : 0;
  const value = clamp01((progress - start) / (end - start));
  return value * value * (3 - 2 * value);
}

function threePoint(
  progress: number,
  start: number,
  middle: number,
  end: number,
  from: number,
  peak: number,
  to: number,
): number {
  if (progress <= middle) return mix(from, peak, smoothRange(progress, start, middle));
  return mix(peak, to, smoothRange(progress, middle, end));
}

function beforeSystemTrack(progress: number, viewport: GraphViewport): ChoreographyFrame {
  const mobile = viewport === "mobile";
  const tablet = viewport === "tablet";
  const separate = smoothRange(progress, 0.08, 0.38);
  const simplify = smoothRange(progress, 0.3, 0.68);
  const depth = mobile ? 0.68 : 1;

  return {
    composition: "copy-left",
    root: {
      x: mobile ? 0 : tablet ? 0.28 : 0.64,
      y: mobile ? -0.2 : 0,
      scale: mobile ? 0.84 : tablet ? 0.93 : 1,
      rotationY: mix(-0.34, -0.16, smoothRange(progress, 0.08, 0.7)),
    },
    camera: mobile
      ? {
          x: mix(7.8, 6.9, simplify),
          y: mix(5.4, 4.7, simplify),
          z: mix(13.4, 12.2, simplify),
          lookY: -0.15,
        }
      : {
          x: mix(7.4, 6.65, simplify),
          y: mix(4.7, 4.05, simplify),
          z: mix(8.8, 7.9, simplify),
          lookY: -0.12,
        },
    roles: {
      interface: {
        y: threePoint(progress, 0.08, 0.36, 0.7, 0, 0.62, 0),
        z: threePoint(progress, 0.08, 0.36, 0.7, 0, 0.5 * depth, 0),
        opacity: 1,
      },
      api: {
        y: -0.1 * separate,
        z: -0.25 * separate * depth,
        opacity: mix(1, 0, smoothRange(progress, 0.14, 0.58)),
      },
      service: {
        y: threePoint(progress, 0.08, 0.4, 0.7, 0, -0.72, -0.18),
        z: threePoint(progress, 0.08, 0.4, 0.7, 0, -1.25 * depth, -0.35),
        opacity: mix(1, 0, smoothRange(progress, 0.12, 0.66)),
      },
      data: {
        y: threePoint(progress, 0.08, 0.42, 0.7, 0, -0.98, -0.28),
        z: threePoint(progress, 0.08, 0.42, 0.7, 0, -1.72 * depth, -0.5),
        opacity: mix(1, 0, smoothRange(progress, 0.1, 0.62)),
      },
      workbench: {
        x: 0.35 * separate,
        z: -0.6 * separate * depth,
        opacity: mix(0.8, 0, smoothRange(progress, 0.08, 0.42)),
      },
      sources: {
        x: mix(0.65, 0, smoothRange(progress, 0.3, 0.7)),
        y: mix(0.25, -0.45, smoothRange(progress, 0.3, 0.7)),
        opacity: smoothRange(progress, 0.26, 0.62),
      },
    },
  };
}

const COMPOSITIONS: Record<IntegratedChapterId, CompositionMode> = {
  "what-i-build-now": "copy-left",
  "before-the-system": "copy-left",
  "spotify-clone": "copy-left",
  "first-real-system": "copy-left",
  "client-work": "copy-left",
  "rebuilding-model": "copy-left",
  "building-genko": "copy-left",
  "ai-engineering": "copy-left",
  "quantx-experiment": "copy-left",
  "how-i-build-now": "copy-left",
};

export function compositionForChapter(chapterId: IntegratedChapterId): CompositionMode {
  return COMPOSITIONS[chapterId];
}

export function sampleChoreography(
  chapterId: IntegratedChapterId,
  localProgress: number,
  viewport: GraphViewport,
  reducedMotion: boolean,
): ChoreographyFrame {
  const progress = reducedMotion ? 1 : clamp01(localProgress);
  if (chapterId === "before-the-system") return beforeSystemTrack(progress, viewport);
  return { composition: COMPOSITIONS[chapterId], roles: {} };
}
