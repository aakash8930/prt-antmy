"use client";

import { useEffect, useRef, useState } from "react";
import type { StoryChapter as StoryChapterModel } from "@/content/story";
import { StoryChapter } from "@/components/story/StoryChapter";
import { SoftwareAssembly } from "@/components/workspace/SoftwareAssembly";
import { BuildGraphCanvas } from "./BuildGraphCanvas";
import {
  resolveChapterVisual,
  type IntegratedChapterId,
} from "./chapterVisualResolver";
import type { BuildGraphState, GraphViewport } from "./model";

type IntegratedStoryArcProps = {
  chapters: StoryChapterModel[];
};

type VisualRuntime = {
  chapterId: IntegratedChapterId;
  state: BuildGraphState;
  phase: string;
  viewport: GraphViewport;
  reducedMotion: boolean;
};

const INTEGRATED_IDS: IntegratedChapterId[] = [
  "what-i-build-now",
  "before-the-system",
  "spotify-clone",
  "first-real-system",
  "client-work",
  "rebuilding-model",
  "building-genko",
  "ai-engineering",
  "quantx-experiment",
  "how-i-build-now",
];

function isIntegratedId(value: string): value is IntegratedChapterId {
  return INTEGRATED_IDS.includes(value as IntegratedChapterId);
}

const INITIAL_VISUAL: VisualRuntime = {
  chapterId: "what-i-build-now",
  state: "current",
  phase: "present",
  viewport: "desktop",
  reducedMotion: false,
};

export function IntegratedStoryArc({ chapters }: IntegratedStoryArcProps) {
  const arcRef = useRef<HTMLDivElement>(null);
  const runtimeRef = useRef(INITIAL_VISUAL);
  const frameRef = useRef<number | null>(null);
  const [runtime, setRuntime] = useState(INITIAL_VISUAL);

  useEffect(() => {
    const arc = arcRef.current;
    if (!arc) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const measure = () => {
      frameRef.current = null;
      const viewport: GraphViewport =
        window.innerWidth <= 760
          ? "mobile"
          : window.innerWidth <= 900 && window.innerHeight > window.innerWidth
            ? "tablet"
            : "desktop";
      const reducedMotion = motionQuery.matches;
      const navHeight =
        document.querySelector<HTMLElement>(".story-nav")?.getBoundingClientRect().height ?? 0;
      const availableHeight = Math.max(1, window.innerHeight - navHeight);
      const focusY = navHeight + availableHeight * 0.35;
      const sections = Array.from(
        arc.querySelectorAll<HTMLElement>("[data-integrated-chapter]"),
      );

      let active = sections.find((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= focusY && rect.bottom > focusY;
      });

      if (!active && sections.length > 0) {
        active = sections.reduce((closest, section) => {
          const distance = Math.abs(section.getBoundingClientRect().top - focusY);
          const closestDistance = Math.abs(closest.getBoundingClientRect().top - focusY);
          return distance < closestDistance ? section : closest;
        });
      }

      sections.forEach((section) => {
        const sectionRect = section.getBoundingClientRect();
        const sectionDistance = Math.max(1, sectionRect.height - availableHeight);
        const sectionProgress = Math.max(
          0,
          Math.min(1, (navHeight - sectionRect.top) / sectionDistance),
        );
        section.dataset.localProgress = sectionProgress.toFixed(3);
      });

      if (!active || !isIntegratedId(active.id)) return;
      const id = active.id;
      const localProgress = Number(active.dataset.localProgress ?? 0);
      arc.style.setProperty("--chapter-progress", localProgress.toFixed(4));
      arc.dataset.localProgress = localProgress.toFixed(3);

      const resolved = resolveChapterVisual({
        chapterId: id,
        localProgress,
        viewport,
        reducedMotion,
      });
      const previous = runtimeRef.current;
      const next: VisualRuntime = {
        chapterId: id,
        state: resolved.state,
        phase: resolved.phase,
        viewport,
        reducedMotion,
      };

      if (
        previous.chapterId !== next.chapterId ||
        previous.state !== next.state ||
        previous.phase !== next.phase ||
        previous.viewport !== next.viewport ||
        previous.reducedMotion !== next.reducedMotion
      ) {
        runtimeRef.current = next;
        setRuntime(next);
      }
    };

    const schedule = () => {
      if (frameRef.current !== null) return;
      frameRef.current = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    motionQuery.addEventListener("change", schedule);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      motionQuery.removeEventListener("change", schedule);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const activeChapter = chapters.find((chapter) => chapter.id === runtime.chapterId);
  const usesAssemblyPrototype = [
    "what-i-build-now",
    "before-the-system",
    "spotify-clone",
    "first-real-system",
    "client-work",
    "rebuilding-model",
    "building-genko",
    "ai-engineering",
    "quantx-experiment",
  ].includes(runtime.chapterId);

  return (
    <div
      ref={arcRef}
      className={`story-arc story-arc--${runtime.chapterId}`}
      data-active-chapter={runtime.chapterId}
      data-visual-state={runtime.state}
      data-visual-phase={runtime.phase}
      data-reduced-motion={runtime.reducedMotion ? "true" : "false"}
    >
      <div className="story-arc-visual-layer">
        <div className="story-arc-visual-sticky">
          <div className="story-arc-visual">
            {usesAssemblyPrototype ? (
              <SoftwareAssembly
                state={runtime.state}
                reducedMotion={runtime.reducedMotion}
                chapterLabel={
                  activeChapter
                    ? `${activeChapter.number} / ${activeChapter.navLabel}`
                    : "00 / Now"
                }
              />
            ) : (
              <BuildGraphCanvas
                state={runtime.state}
                instanceId="integrated-story-graph"
                showStateLabel={false}
                context={{
                  chapter: activeChapter
                    ? `${activeChapter.number} / ${activeChapter.navLabel}`
                    : "00 / Now",
                }}
              />
            )}
          </div>
        </div>
      </div>

      <div className="story-arc-chapters">
        {chapters.map((chapter, index) => (
          <StoryChapter
            key={chapter.id}
            chapter={chapter}
            projectEntry={index === 3}
            integrated
          />
        ))}
      </div>
    </div>
  );
}
