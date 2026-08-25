"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, Preload } from "@react-three/drei";
import { useEffect } from "react";
import type { ExperienceEngine } from "@/experience/ExperienceEngine";
import { qualityManager } from "@/rendering/QualityManager";

function SceneDriver({ engine }: { engine: ExperienceEngine }) {
  const { size } = useThree();

  useEffect(() => {
    engine.setSize(size.width, size.height);
  }, [size.width, size.height, engine]);

  useFrame((_, delta) => {
    // Priority >= 1 disables R3F's automatic render; the engine drives the
    // composer (custom FX), so all rendering is centralized here.
    engine.update(delta, performance.now() / 1000);
  }, 1);

  return null;
}

/**
 * The WebGL viewport. Wraps a React-Three-Fiber Canvas around the plain-three
 * ExperienceEngine, so we get R3F's lifecycle/context for free while keeping
 * every 3D system in dedicated, testable classes.
 */
export default function ExperienceViewport({ engine }: { engine: ExperienceEngine }) {
  const q = qualityManager.get();

  return (
    <Canvas
      className="absolute inset-0"
      shadows
      dpr={[1, q.dpr]}
      gl={{
        antialias: q.antialias,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
      }}
      camera={{
        fov: 42,
        near: 0.1,
        far: 80,
        position: [3.7, 0.85, 6.2],
      }}
      onCreated={(state) => {
        engine.attach(state);
      }}
    >
      <SceneDriver engine={engine} />
      <AdaptiveDpr pixelated={false} />
      <Preload all />
    </Canvas>
  );
}
