import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  experienceStore,
  type ExperienceSnapshot,
} from "@/experience/ExperienceStore";

gsap.registerPlugin(ScrollTrigger);

export interface ScrollControllerOptions {
  track: HTMLElement;
  onFrame?: (snapshot: ExperienceSnapshot) => void;
}

export type FrameCallback = (snapshot: ExperienceSnapshot, delta: number) => void;

/**
 * ScrollController — the bridge between physical scroll and the master
 * experience. It drives a smooth-scroll system (Lenis), synchronizes a
 * scrubbed ScrollTrigger across the full track, and runs a single rAF engine
 * that dispatches the normalized progress to all direct consumers.
 */
export class ScrollController {
  private lenis: Lenis | null = null;
  private trigger: ScrollTrigger | null = null;
  private raf = 0;
  private last = 0;
  private fpsSamples: number[] = [];
  private frameCallbacks = new Set<FrameCallback>();
  private disposed = false;
  private onProgress: (p: number, velocity: number) => void;

  constructor(private options: ScrollControllerOptions) {
    this.options = options;
    this.onProgress = (p, v) => {
      experienceStore.setProgress(p, v);
    };
  }

  registerFrame = (fn: FrameCallback) => {
    this.frameCallbacks.add(fn);
    return () => {
      this.frameCallbacks.delete(fn);
    };
  };

  init = () => {
    if (this.disposed) return;
    // Smooth scroll on if not reduced, otherwise native scroll.
    if (!this.reducedMotion()) {
      this.lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.4,
      });
      this.lenis.on("scroll", () => {
        this.trigger?.update();
      });
      const lenisRaf = (time: number) => {
        if (this.disposed) return;
        this.lenis?.raf(time);
        this.raf = requestAnimationFrame(lenisRaf);
      };
      this.raf = requestAnimationFrame(lenisRaf);
    }

    this.trigger = ScrollTrigger.create({
      trigger: this.options.track,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6,
      onUpdate: (self) => {
        this.onProgress(self.progress, Math.abs(self.getVelocity() / 250));
      },
    });

    this.last = performance.now();
    this.loop(this.last);
  };

  private reducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  private loop = (now: number) => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.loop);
    const dt = Math.min(0.05, (now - this.last) / 1000) || 0.016;
    this.last = now;
    const fps = dt > 0 ? 1 / dt : 60;
    this.fpsSamples.push(fps);
    if (this.fpsSamples.length > 20) this.fpsSamples.shift();
    const avgFps =
      this.fpsSamples.reduce((a, b) => a + b, 0) / Math.max(1, this.fpsSamples.length);
    experienceStore.tick(avgFps);
    const snapshot = experienceStore.get();
    this.frameCallbacks.forEach((fn) => fn(snapshot, dt));
  };

  /** Programmatic jump (used by the debug panel / CTA). */
  jumpTo = (progress: number, immediate = false) => {
    if (!this.lenis || !this.trigger) return;
    const target =
      this.trigger.start + (this.trigger.end - this.trigger.start) * progress;
    if (immediate) {
      window.scrollTo(0, target);
      this.trigger.update();
      return;
    }
    this.lenis.scrollTo(target, { duration: 1.4 });
  };

  pause = () => {
    if (this.trigger && "isPaused" in this.trigger) {
      (this.trigger as unknown as { pause: () => void }).pause();
    }
    this.lenis?.stop();
  };

  resume = () => {
    (this.trigger as unknown as { resume: () => void } | null)?.resume?.();
    this.lenis?.start();
  };

  dispose = () => {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.trigger?.kill();
    ScrollTrigger.getAll().forEach((t) => t.kill());
    this.lenis?.destroy();
    this.lenis = null;
    this.frameCallbacks.clear();
  };

  getTrigger = () => this.trigger;
  getProgress = () => experienceStore.get().progress;
}
