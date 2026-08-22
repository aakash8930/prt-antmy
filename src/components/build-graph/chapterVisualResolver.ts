import type {
  BuildGraphState,
  GraphViewport,
} from "./model";

export type IntegratedChapterId =
  | "what-i-build-now"
  | "before-the-system"
  | "spotify-clone"
  | "first-real-system"
  | "client-work"
  | "rebuilding-model"
  | "building-genko";

export type ChapterVisualInput = {
  chapterId: IntegratedChapterId;
  localProgress: number;
  viewport: GraphViewport;
  reducedMotion: boolean;
};

export type ResolvedChapterVisual = {
  state: BuildGraphState;
  phase:
    | "present"
    | "peelback"
    | "foundation"
    | "player"
    | "limited"
    | "backend-boundary"
    | "connected-responsibilities"
    | "coherent-system"
    | "client-workbench"
    | "external-constraints"
    | "client-delivery"
    | "inherited-system"
    | "inspection"
    | "rebuild-growing"
    | "shared-system"
    | "shared-capability"
    | "personal-problem"
    | "learning-loop"
    | "ai-product-feature"
    | "product-capability";
};

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

/**
 * Pure chapter-local resolver. It knows chapter identity and that chapter's
 * own 0..1 progress, but nothing about document-wide progress or scroll
 * history. The same input always returns the same semantic graph state.
 */
export function resolveChapterVisual({
  chapterId,
  localProgress,
  viewport,
  reducedMotion,
}: ChapterVisualInput): ResolvedChapterVisual {
  const progress = clamp01(localProgress);

  if (chapterId === "what-i-build-now") {
    return { state: "current", phase: "present" };
  }

  if (chapterId === "before-the-system") {
    if (reducedMotion) return { state: "beginner-tools", phase: "foundation" };
    const peelbackEnd = viewport === "mobile" ? 0.42 : 0.48;
    if (progress < 0.2) return { state: "current", phase: "present" };
    if (progress < peelbackEnd) {
      return { state: "capability-peelback", phase: "peelback" };
    }
    return { state: "beginner-tools", phase: "foundation" };
  }

  if (chapterId === "spotify-clone") {
    if (reducedMotion) return { state: "spotify-limited", phase: "limited" };
    const limitedStart = viewport === "mobile" ? 0.44 : 0.5;
    if (progress < limitedStart) return { state: "spotify-player", phase: "player" };
    return { state: "spotify-limited", phase: "limited" };
  }

  if (chapterId === "first-real-system") {
    if (reducedMotion) {
      return { state: "bellybasket-system", phase: "coherent-system" };
    }

    const connectedStart = viewport === "mobile" ? 0.3 : 0.34;
    const coherentStart = viewport === "mobile" ? 0.64 : 0.69;
    if (progress < connectedStart) {
      return { state: "bellybasket-foundation", phase: "backend-boundary" };
    }
    if (progress < coherentStart) {
      return { state: "system-thinking", phase: "connected-responsibilities" };
    }
    return { state: "bellybasket-system", phase: "coherent-system" };
  }

  if (chapterId === "client-work") {
    if (reducedMotion) {
      return { state: "client-constraints", phase: "external-constraints" };
    }
    const constraintStart = viewport === "mobile" ? 0.25 : 0.3;
    const deliveryStart = viewport === "mobile" ? 0.65 : 0.72;
    if (progress < constraintStart) {
      return { state: "client-workbench", phase: "client-workbench" };
    }
    if (progress < deliveryStart) {
      return { state: "client-constraints", phase: "external-constraints" };
    }
    return { state: "client-delivery", phase: "client-delivery" };
  }

  if (chapterId === "rebuilding-model") {
    if (reducedMotion) {
      return { state: "inherited-rebuild", phase: "shared-system" };
    }
    const inspectionStart = viewport === "mobile" ? 0.2 : 0.25;
    const rebuildStart = viewport === "mobile" ? 0.42 : 0.5;
    const connectedStart = viewport === "mobile" ? 0.65 : 0.75;
    const extractionStart = viewport === "mobile" ? 0.88 : 0.92;
    if (progress < inspectionStart) {
      return { state: "dapigo-inherited", phase: "inherited-system" };
    }
    if (progress < rebuildStart) {
      return { state: "dapigo-inspection", phase: "inspection" };
    }
    if (progress < connectedStart) {
      return { state: "cravecart-growing", phase: "rebuild-growing" };
    }
    if (progress < extractionStart) {
      return { state: "inherited-rebuild", phase: "shared-system" };
    }
    return { state: "shared-architecture", phase: "shared-capability" };
  }

  if (reducedMotion) {
    return { state: "genko-capability", phase: "product-capability" };
  }
  const loopStart = viewport === "mobile" ? 0.22 : 0.3;
  const aiStart = viewport === "mobile" ? 0.55 : 0.7;
  const extractionStart = viewport === "mobile" ? 0.82 : 0.9;
  if (progress < loopStart) {
    return { state: "genko-problem", phase: "personal-problem" };
  }
  if (progress < aiStart) {
    return { state: "genko-loop", phase: "learning-loop" };
  }
  if (progress < extractionStart) {
    return { state: "genko-ai-product", phase: "ai-product-feature" };
  }
  return { state: "genko-capability", phase: "product-capability" };
}
