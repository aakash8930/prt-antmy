"use client";

import { useEffect, useRef } from "react";
import { SequenceRenderer } from "@/rendering/SequenceRenderer";
import { useDirectFrame } from "@/experience/ExperienceStore";
import { windowRange } from "@/animation/MasterTimeline";

/**
 * SequenceLayer — the reusable Canvas image-sequence engine. In production it
 * streams `/sequences/road/seq_XXXX.webp`; in this repo those frames are not
 * committed, so the renderer uses its motion-safe procedural fallback. Either
 * way the Canvas (never hundreds of <img> tags) stays locked to scroll.
 */
export default function SequenceLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<SequenceRenderer | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = new SequenceRenderer({
      canvas,
      base: undefined,
      totalFrames: 216,
      drawFallback: drawRoadFallback,
    });
    rendererRef.current = renderer;
    return () => {
      renderer.dispose();
      rendererRef.current = null;
    };
  }, []);

  useDirectFrame((s) => {
    const w = windowRange(s.progress, 0.785, 0.84, 0.86, 0.895);
    rendererRef.current?.draw(s.progress);
    if (wrapRef.current) {
      wrapRef.current.style.opacity = String(w * 0.9);
      wrapRef.current.style.visibility = w > 0.01 ? "visible" : "hidden";
    }
  });

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none absolute inset-0 opacity-0"
      style={{ visibility: "hidden" }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}

const drawRoadFallback = (
  ctx: CanvasRenderingContext2D,
  progress: number,
) => {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  const t = progress * 12;
  const speed = 0.25 + Math.min(1, (progress - 0.77) / 0.1) * 1.2;

  ctx.clearRect(0, 0, w, h);
  // Asphalt base.
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, "#050607");
  grad.addColorStop(1, "#0c0f10");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Horizon light.
  const horizon = h * 0.44;
  const hg = ctx.createLinearGradient(0, horizon - 160, 0, h);
  hg.addColorStop(0, "rgba(159,232,221,0.12)");
  hg.addColorStop(1, "rgba(159,232,221,0)");
  ctx.fillStyle = hg;
  ctx.fillRect(0, horizon - 160, w, h);

  // Streaking road lines.
  ctx.lineCap = "round";
  const count = Math.round(16 * (0.6 + speed));
  for (let i = 0; i < count; i++) {
    const seed = (i * 47.31) % 1;
    const x = seed * w;
    const y = horizon + ((i * 13.7 + t * 160 * speed) % (h - horizon));
    const len = 40 + seed * (180 * speed);
    const alpha = (1 - (y - horizon) / (h - horizon + 1)) * 0.35 * speed;
    ctx.strokeStyle = `rgba(${210 + Math.floor(seed * 30)},${240},${230},${Math.max(0, alpha)})`;
    ctx.lineWidth = 1 + seed * 2.4;
    ctx.beginPath();
    ctx.moveTo(x - len / 2, y);
    ctx.lineTo(x + len / 2, y);
    ctx.stroke();
  }

  // Center lane marker streaks.
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(w * 0.5, h);
  ctx.lineTo(w * 0.5 + Math.sin(t * 0.4) * 30, horizon);
  ctx.stroke();
};
