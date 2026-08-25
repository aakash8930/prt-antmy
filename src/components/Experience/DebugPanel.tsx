"use client";

import { useEffect, useRef, useState } from "react";
import { useDirectFrame, useExperience, experienceStore } from "@/experience/ExperienceStore";
import type { ExperienceEngine } from "@/experience/ExperienceEngine";
import { qualityManager, type QualitySettings } from "@/rendering/QualityManager";
import { getDeviceProfile } from "@/utils/device";
import { audioController } from "@/audio/AudioController";

const qualityLabel = (q: QualitySettings) => `[${q.level.toUpperCase()}]`;

export default function DebugPanel({ engine }: { engine: ExperienceEngine }) {
  const { debugOpen } = useExperience();
  const [jump, setJump] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!debugOpen) return;
      const target = e.target as HTMLElement | null;
      if (target && /INPUT|TEXTAREA|SELECT/.test(target.tagName)) return;
      switch (e.key.toLowerCase()) {
        case "d":
          experienceStore.setDebugOpen(false);
          break;
        case "p":
          engine.debugPauseToggle();
          break;
        case "w":
          engine.setDebugWireframe(!engine.isWireframe());
          break;
        case "b":
          engine.setDebugBounds(!engine.isBounds());
          break;
        case "c":
          engine.setDebugCameraPath(!engine.isCameraPath());
          break;
        case "n":
          engine.setDebugComponentNames(!engine.getDebugComponentNames());
          break;
        case "1":
          qualityManager.set("low");
          break;
        case "2":
          qualityManager.set("medium");
          break;
        case "3":
          qualityManager.set("high");
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [debugOpen, engine]);

  if (!debugOpen) return null;

  return (
    <div className="fixed bottom-5 left-5 z-[85] w-[min(440px,88vw)] border border-white/12 bg-black/70 p-4 font-tech text-[10px] backdrop-blur-xl">
      <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2">
        <span className="tracking-[0.2em] text-[#9fe8dd]">VOLT ENGINE</span>
        <button onClick={() => experienceStore.setDebugOpen(false)} className="text-white/50 hover:text-white">
          ✕
        </button>
      </div>

      <Metrics engine={engine} />

      <div className="mt-3 border-t border-white/10 pt-3">
        <JumpControl value={jump} onChange={setJump} engine={engine} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button className="debug-btn" onClick={() => engine.debugPauseToggle()}>PAUSE / RESUME</button>
        <button className="debug-btn" onClick={() => qualityManager.cycle()}>{qualityLabel(qualityManager.get())} QUALITY</button>
        <button className="debug-btn" onClick={() => engine.setDebugWireframe(!engine.isWireframe())}>
          WIREFRAME {engine.isWireframe() ? "ON" : "OFF"}
        </button>
        <button className="debug-btn" onClick={() => engine.setDebugBounds(!engine.isBounds())}>
          BOUNDS {engine.isBounds() ? "ON" : "OFF"}
        </button>
        <button className="debug-btn" onClick={() => engine.setDebugCameraPath(!engine.isCameraPath())}>
          CAMERA PATH {engine.isCameraPath() ? "ON" : "OFF"}
        </button>
        <button className="debug-btn" onClick={() => engine.setDebugComponentNames(!engine.getDebugComponentNames())}>
          COMPONENTS {engine.getDebugComponentNames() ? "ON" : "OFF"}
        </button>
      </div>
    </div>
  );
}

const Metrics = ({ engine }: { engine: ExperienceEngine }) => {
  const ref = useRef<HTMLDListElement>(null);
  useDirectFrame((s) => {
    if (!ref.current) return;
    const stats = engine.getStats();
    const set = (k: string, v: string | number) => {
      (ref.current!.querySelector(`[data-m="${k}"]`) as HTMLElement | null)!.textContent = String(v);
    };
    set("fps", Math.round(s.fps));
    set("frame", s.frame);
    set("scroll", s.scrollVelocity.toFixed(2));
    set("progress", `${(s.progress * 100).toFixed(2)}%`);
    set("draw", stats.calls);
    set("tri", stats.triangles.toLocaleString());
    set("tex", stats.textures);
    set("part", getDeviceProfile().maxParticles);
    set("quality", qualityManager.get().level.toUpperCase());
    set("mem", stats.memoryUsed + "MB");
    set("scene", s.phase.toUpperCase());
    set("audio", audioController.isEnabled ? "ON" : "OFF");
  });
  return (
    <dl ref={ref} className="grid grid-cols-2 gap-x-5 gap-y-1">
      {(
        [
          ["FPS", "fps"],
          ["FRAME", "frame"],
          ["SCROLL", "scroll"],
          ["PROGRESS", "progress"],
          ["DRAW", "draw"],
          ["TRIANGLES", "tri"],
          ["TEXTURES", "tex"],
          ["PARTICLES", "part"],
          ["GPU QUALITY", "quality"],
          ["MEMORY", "mem"],
          ["ACTIVE SCENE", "scene"],
          ["AUDIO", "audio"],
        ] as Array<[string, string]>
      ).map(([label, key]) => (
        <div key={key} className="flex justify-between">
          <dt className="text-white/35">{label}</dt>
          <dd data-m={key} className="volt-mono text-white/80">
            0
          </dd>
        </div>
      ))}
    </dl>
  );
};

const JumpControl = ({
  value,
  onChange,
  engine,
}: {
  value: number;
  onChange: (v: number) => void;
  engine: ExperienceEngine;
}) => (
  <div className="flex items-center gap-3">
    <span className="text-white/40">JUMP</span>
    <input
      type="range"
      min={0}
      max={100}
      value={value}
      onChange={(e) => {
        const v = Number(e.target.value);
        onChange(v);
        engine.debugJumpTo(v / 100);
      }}
      className="h-1 flex-1 accent-[#9fe8dd]"
    />
    <span className="volt-mono text-white/80">{value}%</span>
  </div>
);
