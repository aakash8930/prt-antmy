"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Timeline } from "animejs";
import { BlueprintScene } from "./BlueprintScene";
import {
  applyProgress,
  buildTimeline,
  revertTimeline,
} from "./animation/buildTimelines";
import type { NodeId, NodeRegistry } from "./animation/types";
import { useScrollProgress } from "./hooks/useScrollProgress";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useIsMobileViewport } from "./hooks/useIsMobileViewport";
import { currentStage, STAGE_LABEL, type StageName } from "./constants/stages";

/**
 * Scroll runway for the complete 0-100% experience. Stages 1-4 set the pace
 * (420vh / 40 points = 10.5vh per point); every later phase, through the
 * closing floor-plan sequence, continues at that same pace so scrubbing
 * never suddenly speeds up or slows down at a stage seam.
 */
const SCROLL_RUNWAY_VH = 1050;
/** The percent this prototype's local 0-1 scroll progress maps to at its end. */
const PROGRESS_MAX_PERCENT = 100;
/** Stage 10 — from here the floor-plan zones read as live navigation, not
 * just architecture (see BlueprintScene's nav-active affordance). */
const NAV_ACTIVE_PERCENT = 96;
/** Mobile only — below this percent the tighter DRAW..INSPECT crop applies
 * (see geometry.MOBILE_VIEW_BOX); at and above it, EVIDENCE's fixed project
 * column and the floor plan's fuller vertical extent need the whole
 * viewBox, so the crop releases back to it. */
const MOBILE_WIDE_VIEWBOX_PERCENT = 50;

/**
 * How far the plates travel when they separate, as a fraction of the
 * desktop spread. Tablet keeps the same choreography but tightens it;
 * mobile tightens it further still rather than trying to be a scaled-down
 * desktop composition. Recomputed once per mount — a resize/orientation
 * change won't re-scale an in-progress session, which is an acceptable
 * limitation for this prototype.
 */
function spreadScaleForWidth(width: number): number {
  if (width < 640) return 0.4;
  if (width < 1024) return 0.65;
  return 1;
}

export function BlueprintCenterpiece() {
  const containerRef = useRef<HTMLDivElement>(null);
  const registryRef = useRef<NodeRegistry>({});
  const timelineRef = useRef<Timeline | null>(null);
  const progressLabelRef = useRef<HTMLSpanElement>(null);
  const lastStageRef = useRef<StageName | null>(null);
  const lastNavActiveRef = useRef(false);

  const prefersReducedMotion = usePrefersReducedMotion();
  const [stageLabel, setStageLabel] = useState(STAGE_LABEL.draw);
  // Whether the floor-plan zones currently read as live navigation — a
  // plain threshold recomputed from `progress` every frame (like stageLabel
  // above), not accumulated state, so it's exact regardless of how the
  // visitor's scroll position arrived here.
  const [navActive, setNavActive] = useState(false);
  const [mobileWideViewBox, setMobileWideViewBox] = useState(false);
  const lastMobileWideRef = useRef(false);
  const isMobileLayout = useIsMobileViewport();

  const registerNode = useCallback((id: NodeId, el: SVGElement | null) => {
    registryRef.current[id] = el;
  }, []);

  // Build the single master timeline once the scene's refs have committed.
  useEffect(() => {
    const spreadScale = spreadScaleForWidth(window.innerWidth);
    const timeline = buildTimeline(registryRef.current, spreadScale, isMobileLayout);
    timelineRef.current = timeline;

    if (prefersReducedMotion) {
      applyProgress(timeline, 1); // static, fully-resolved floor-plan fallback
    }

    return () => {
      revertTimeline(timeline);
      timelineRef.current = null;
    };
  }, [prefersReducedMotion, isMobileLayout]);

  const handleProgress = useCallback((progress: number) => {
    const timeline = timelineRef.current;
    if (!timeline) return;

    applyProgress(timeline, progress);
    const percent = progress * PROGRESS_MAX_PERCENT;

    if (progressLabelRef.current) {
      progressLabelRef.current.textContent = `${Math.round(percent)
        .toString()
        .padStart(2, "0")}%`;
    }

    const stage = currentStage(percent);
    if (stage !== lastStageRef.current) {
      lastStageRef.current = stage;
      setStageLabel(STAGE_LABEL[stage]);
    }

    const navActiveNow = percent >= NAV_ACTIVE_PERCENT;
    if (navActiveNow !== lastNavActiveRef.current) {
      lastNavActiveRef.current = navActiveNow;
      setNavActive(navActiveNow);
    }

    const wideNow = percent >= MOBILE_WIDE_VIEWBOX_PERCENT;
    if (wideNow !== lastMobileWideRef.current) {
      lastMobileWideRef.current = wideNow;
      setMobileWideViewBox(wideNow);
    }
  }, []);

  useScrollProgress({
    containerRef,
    onProgress: handleProgress,
    enabled: !prefersReducedMotion,
  });

  return (
    <div
      ref={containerRef}
      className="bp-spacer"
      style={{ height: prefersReducedMotion ? "auto" : `${SCROLL_RUNWAY_VH}vh` }}
    >
      <div
        className="bp-viewport"
        style={prefersReducedMotion ? { position: "relative", height: "100vh" } : undefined}
      >
        <div className="bp-titleblock">
          <span className="bp-titleblock-eyebrow">SHEET 01 · SYSTEM VOLUME</span>
          <span className="bp-titleblock-tagline">
            I don&rsquo;t just write code. I build systems.
          </span>
        </div>

        <div className="bp-stage-frame">
          <BlueprintScene
            registerNode={registerNode}
            isMobileLayout={isMobileLayout}
            navActive={navActive || prefersReducedMotion}
            mobileWideViewBox={mobileWideViewBox || prefersReducedMotion}
          />
        </div>

        <div className="bp-caption">
          <span className="bp-caption-stage">
            {prefersReducedMotion ? STAGE_LABEL.floorPlan : stageLabel}
          </span>
          {!prefersReducedMotion && (
            <span className="bp-caption-progress mono-num" ref={progressLabelRef}>
              00%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
