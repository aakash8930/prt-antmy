import { useEffect, useRef, useSyncExternalStore } from "react";

/**
 * Volatile, mutable runtime state shared by the DOM overlay layer and the
 * WebGL experience. High-frequency data (progress) is intentionally NOT
 * React state — it is written to a mutable object and delivered to direct
 * DOM updaters inside a single rAF tick so scrolling stays at frame-rate
 * without triggering React reconciliations.
 */

export type PhaseKey =
  | "ignition"
  | "form"
  | "material"
  | "deconstruction"
  | "power"
  | "core"
  | "performance"
  | "human"
  | "final";

export interface ExperienceSnapshot {
  progress: number;
  phase: PhaseKey;
  phaseIndex: number;
  scrollVelocity: number;
  fps: number;
  frame: number;
  enabled: boolean;
  audio: boolean;
  debugOpen: boolean;
  hoveredPart: string;
  motorSpeed: number;
}

const PHASES: PhaseKey[] = [
  "ignition",
  "form",
  "material",
  "deconstruction",
  "power",
  "core",
  "performance",
  "human",
  "final",
];

export const phaseForProgress = (p: number): number => {
  if (p < 0.07) return 0;
  if (p < 0.22) return 1;
  if (p < 0.34) return 2;
  if (p < 0.52) return 3;
  if (p < 0.66) return 4;
  if (p < 0.77) return 5;
  if (p < 0.89) return 6;
  if (p < 0.96) return 7;
  return 8;
};

export type Snapshot = ExperienceSnapshot;

class ExperienceStore {
  private state: ExperienceSnapshot = {
    progress: 0,
    phase: "ignition",
    phaseIndex: 0,
    scrollVelocity: 0,
    fps: 60,
    frame: 0,
    enabled: false,
    audio: false,
    debugOpen: false,
    hoveredPart: "",
    motorSpeed: 0,
  };

  private directUpdaters = new Set<() => void>();
  private reactListeners = new Set<() => void>();
  private snapshotCache: ExperienceSnapshot | null = null;
  private serverSnapshot: ExperienceSnapshot = {
    progress: 0,
    phase: "ignition",
    phaseIndex: 0,
    scrollVelocity: 0,
    fps: 60,
    frame: 0,
    enabled: false,
    audio: false,
    debugOpen: false,
    hoveredPart: "",
    motorSpeed: 0,
  };

  get = () => this.state;

  subscribeDirect = (fn: () => void) => {
    this.directUpdaters.add(fn);
    return () => {
      this.directUpdaters.delete(fn);
    };
  };

  subscribe = (listener: () => void) => {
    this.reactListeners.add(listener);
    return () => {
      this.reactListeners.delete(listener);
    };
  };

  getSnapshot = (): ExperienceSnapshot => {
    if (!this.snapshotCache) {
      this.snapshotCache = { ...this.state };
    }
    return this.snapshotCache;
  };

  getServerSnapshot = (): ExperienceSnapshot => this.serverSnapshot;

  private notifyReact = () => {
    this.snapshotCache = { ...this.state };
    this.reactListeners.forEach((l) => l());
  };

  setProgress = (progress: number, velocity = 0) => {
    const clamped = Math.min(1, Math.max(0, progress));
    const prevPhase = this.state.phaseIndex;
    const nextPhase = phaseForProgress(clamped);
    const changed = prevPhase !== nextPhase;
    this.state.progress = clamped;
    this.state.scrollVelocity = velocity;
    // Only broadcast a React snapshot on discrete changes; direct DOM
    // updaters read `progress` every frame regardless.
    if (changed) {
      this.state.phaseIndex = nextPhase;
      this.state.phase = PHASES[nextPhase];
      this.notifyReact();
    }
  };

  setEnabled = (enabled: boolean) => {
    if (this.state.enabled === enabled) return;
    this.state.enabled = enabled;
    this.notifyReact();
  };

  setAudio = (audio: boolean) => {
    this.state.audio = audio;
    this.notifyReact();
  };

  setDebugOpen = (open: boolean) => {
    this.state.debugOpen = open;
    this.notifyReact();
  };

  setEngineValues = (hoveredPart: string, motorSpeed: number) => {
    this.state.hoveredPart = hoveredPart;
    this.state.motorSpeed = motorSpeed;
  };

  tick = (fps: number) => {
    this.state.frame += 1;
    this.state.fps = fps;
    this.directUpdaters.forEach((fn) => fn());
  };
}

export const experienceStore = new ExperienceStore();

export const getExperience = () => experienceStore.get();

/** React store snapshot. Re-renders only when a discrete value changes. */
export const useExperience = (): ExperienceSnapshot => {
  return useSyncExternalStore(
    experienceStore.subscribe,
    experienceStore.getSnapshot,
    experienceStore.getServerSnapshot,
  );
};

/** Phase/UI-state subscription only (never re-renders per-frame). */
export const usePhase = (): Pick<
  ExperienceSnapshot,
  "phase" | "phaseIndex" | "enabled" | "audio" | "debugOpen"
> => {
  return useExperience();
};

/**
 * Runs `callback(state)` once per animation frame while mounted. Intended for
 * values that must update continuously (opacity, transforms, numeric HUDs).
 * Does not cause React re-renders.
 */
export const useDirectFrame = (callback: (s: ExperienceSnapshot) => void) => {
  const cb = useRef(callback);
  cb.current = callback;
  useEffect(() => {
    return experienceStore.subscribeDirect(() =>
      cb.current(experienceStore.get()),
    );
  }, []);
};
