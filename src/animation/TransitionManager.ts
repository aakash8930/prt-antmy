import gsap from "gsap";
import { experienceStore, type ExperienceSnapshot } from "@/experience/ExperienceStore";
import { ACTS, getAct } from "./MasterTimeline";

/**
 * TransitionManager owns the "soft" GSAP transitions that are safe to run on
 * top of the primary scroll timeline: enter/exit text reveals, load-to-scene
 * crossfade, and section curtain pulses. All of these are scrubbed against
 * the master progress or triggered once on discrete phase boundaries.
 */
export class TransitionManager {
  private enterTimelines = new Map<string, gsap.core.Timeline>();
  private activePhase = -1;

  mount = () => {
    gsap.registerPlugin(); // keep gsap registered for any external consumers
  };

  unmount = () => {
    this.enterTimelines.forEach((t) => t.kill());
    this.enterTimelines.clear();
  };

  /** Trigger a one-shot reveal when a phase boundary is crossed. */
  observePhase(boundary: number) {
    const p = experienceStore.get().phaseIndex;
    if (p === boundary && this.activePhase !== boundary) return;
    if (p === boundary) return;
    this.activePhase = p;
  }

  /**
   * Creates a self-contained text reveal timeline for DOM elements inside a
   * section. Each child is revealable by setting data attributes before the
   * timeline builds (line reveals are driven by clip-path + y translation).
   */
  buildReveal(selector: string): gsap.core.Timeline {
    const existing = this.enterTimelines.get(selector);
    if (existing) {
      existing.kill();
    }
    const targets = Array.from(document.querySelectorAll(selector));
    const tl = gsap.timeline({ paused: true });
    targets.forEach((el) => {
      const lines = el.querySelectorAll("[data-reveal-line]");
      if (lines.length) {
        gsap.set(lines, { yPercent: 120, opacity: 0 });
        tl.to(lines, { yPercent: 0, opacity: 1, duration: 1.1, ease: "power4.out" }, "<0.05");
      } else {
        gsap.set(el, { yPercent: 30, opacity: 0 });
        tl.to(el, { yPercent: 0, opacity: 1, duration: 1.1, ease: "power3.out" }, "<");
      }
    });
    this.enterTimelines.set(selector, tl);
    return tl;
  }

  /** Play a reveal based on the current phase (idempotent). */
  playForPhase(selector: string) {
    const tl = this.buildReveal(selector);
    tl.play();
  }

  /**
   * Apply a crossfade between the loader and the live scene. Reversible via
   * the master progress; the loader is only visible before the experience is
   * unlocked by an interaction.
   */
  applyLoaderFade(el: HTMLElement | null, unlocked: boolean) {
    if (!el) return;
    gsap.to(el, {
      opacity: unlocked ? 0 : 1,
      pointerEvents: unlocked ? "none" : "auto",
      duration: unlocked ? 1.0 : 0.2,
      ease: "power2.inOut",
    });
  }

  /** Small screen "curtain" pulse used at hard act boundaries. */
  curtainPulse(el: HTMLElement | null) {
    if (!el) return;
    gsap.fromTo(
      el,
      { opacity: 0.9 },
      { opacity: 0, duration: 0.7, ease: "power2.inOut", overwrite: "auto" },
    );
  }

  /** React to progress-driven cross-section curtains for a target element. */
  applySectionCurtain(el: HTMLElement | null, progress: number) {
    if (!el) return;
    const act = getAct(progress);
    const boundary = (act.index + 1) * 0.11;
    const edge = Math.abs(progress - boundary);
    const intensity = edge < 0.01 ? 1 - edge / 0.01 : 0;
    gsap.set(el, { opacity: intensity * 0.35 });
  }
}

export const transitionManager = new TransitionManager();
