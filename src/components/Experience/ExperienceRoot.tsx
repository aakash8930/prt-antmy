"use client";

import { useEffect, useMemo, useRef } from "react";
import { ExperienceEngine } from "@/experience/ExperienceEngine";
import { ScrollController } from "@/animation/ScrollController";
import { experienceStore } from "@/experience/ExperienceStore";
import { audioController } from "@/audio/AudioController";
import { assetManager } from "@/rendering/AssetManager";
import ExperienceViewport from "./ExperienceViewport";
import ExperienceOverlay from "./ExperienceOverlay";
import Navigation from "./Navigation";
import Loading from "./Loading";
import DebugPanel from "./DebugPanel";

export default function ExperienceRoot() {
  const trackRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<ScrollController | null>(null);
  const engine = useMemo(() => new ExperienceEngine(), []);

  useEffect(() => {
    assetManager.start();
  }, []);

  useEffect(() => {
    if (!trackRef.current) return;
    const controller = new ScrollController({ track: trackRef.current });
    controller.init();
    controllerRef.current = controller;

    const engage = () => {
      if (experienceStore.get().enabled) return;
      experienceStore.setEnabled(true);
      audioController.setEnabled(true);
      experienceStore.setAudio(true);
    };

    const onJump = (e: Event) => {
      const detail = (e as CustomEvent<number>).detail ?? 1;
      controller.jumpTo(Math.max(0, Math.min(1, detail)));
    };

    window.addEventListener("volt:engage", engage);
    window.addEventListener("volt:jump", onJump);
    window.addEventListener("volt:return", () => engine.returnToExperience());

    // Unlock after the first real user gesture (respects autoplay).
    const once = () => engage();
    window.addEventListener("pointerdown", once, { once: true });
    window.addEventListener("wheel", once, { once: true, passive: true });
    window.addEventListener("keydown", once, { once: true });
    window.addEventListener("touchstart", once, { once: true, passive: true });

    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && /INPUT|TEXTAREA|SELECT/.test(el.tagName)) return;
      if (e.key.toLowerCase() === "d") {
        experienceStore.setDebugOpen(!experienceStore.get().debugOpen);
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("volt:engage", engage);
      window.removeEventListener("volt:jump", onJump);
      window.removeEventListener("keydown", onKey);
      controller.dispose();
      controllerRef.current = null;
    };
  }, [engine]);

  return (
    <>
      <div ref={trackRef} className="relative" style={{ height: "1500vh" }}>
        <div className="fixed inset-0">
          <ExperienceViewport engine={engine} />
          <ExperienceOverlay />
        </div>
      </div>
      <Navigation />
      <Loading />
      <DebugPanel engine={engine} />
      <div className="grain-overlay fixed inset-0 z-[70]" aria-hidden />
    </>
  );
}
