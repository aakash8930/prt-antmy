import type {
  BuildGraphState,
  GraphViewport,
} from "./model";

export type IntegratedChapterId =
  | "what-i-build-now"
  | "before-the-system"
  | "spotify-clone"
  | "first-real-system";

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
    | "coherent-system";
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
