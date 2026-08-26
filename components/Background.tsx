"use client";

import { useEffect, useRef } from "react";
import { createTimeline } from "animejs";

// Generative automotive background: a perspective light-grid that reads like a
// road receding to the horizon. The road always cruises toward the viewer and
// accelerates with scroll; a warm pulse travels from the horizon to the
// foreground, embers drift upward, and a horizon glow breathes behind a
// vignette. Fine pointers get gentle parallax.
//
// The rAF loop owns all drawing; animejs only runs the one-shot intro fade.

type Dot = {
  row: number;
  x: number; // 0..1 across the road width at its row
  y: number; // 0..1 vertical position, 0 = horizon, 1 = bottom of screen
  size: number;
  phase: number;
};

type Ember = {
  x: number; // 0..1
  y: number; // 0..1
  size: number;
  drift: number;
  speed: number;
  twinkle: number;
};

type Row = {
  spread: number; // road half-width in viewport units at this row
};

const ROWS = 26;
const COLS = 15;
const DPR_CAP = 2;
const BASE_SPEED = 0.0011; // ambient cruise per frame
const SCROLL_SPEED = 0.006; // added at full scroll depth

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;

    // scroll factor 0..1, smoothed toward the raw target
    let target = 0;
    let current = 0;
    let time = 0; // frame counter, for waves and breathing

    const HORIZON_STOPS: [number, string][] = [
      [0, "rgba(255, 122, 26, 0.55)"],
      [0.4, "rgba(255, 77, 28, 0.24)"],
      [1, "rgba(255, 77, 28, 0)"],
    ];

    const dots: Dot[] = [];
    const embers: Ember[] = [];
    const rows: Row[] = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildDots();
    };

    // Rows near the horizon are dense and small; rows near the bottom are
    // sparse and large. Columns spread wider the closer the row is, so the
    // whole thing reads as a road receding to a vanishing point above center.
    const buildDots = () => {
      dots.length = 0;
      rows.length = 0;
      for (let row = 0; row < ROWS; row++) {
        const t = row / (ROWS - 1); // 0 horizon → 1 near
        const y = 0.42 + t * 0.56; // horizon sits above center
        const spread = 0.04 + t * 0.46; // road half-width in viewport units
        const count = Math.max(3, Math.round(COLS * (1 - t * 0.55)));
        rows.push({ spread });
        for (let c = 0; c < count; c++) {
          const u = count === 1 ? 0.5 : c / (count - 1);
          dots.push({
            row,
            x: 0.5 + (u - 0.5) * 2 * spread,
            y,
            size: (1 + t * 2.6) * (1 + (row % 3) * 0.18),
            phase: Math.random() * Math.PI * 2,
          });
        }
      }

      embers.length = 0;
      const emberCount = Math.round((width / 1600) * 30);
      for (let i = 0; i < emberCount; i++) {
        embers.push({
          x: Math.random(),
          y: Math.random(),
          size: 0.8 + Math.random() * 1.8,
          drift: Math.random() * Math.PI * 2,
          speed: 0.8 + Math.random() * 1.6,
          twinkle: Math.random() * Math.PI * 2,
        });
      }
    };

    // one frame
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = 1;

      // breathing horizon glow
      const breathe = 0.55 + 0.06 * Math.sin(time * 0.02);
      const glow = ctx.createLinearGradient(0, height * 0.2, 0, height * 0.62);
      for (const [stop, color] of HORIZON_STOPS) {
        const m = stop === 0 ? breathe : stop === 0.4 ? breathe * 0.9 : stop;
        glow.addColorStop(stop, color.replace(/0\.\d+\)$/, `${m.toFixed(2)})`));
      }
      ctx.fillStyle = glow;
      ctx.fillRect(0, height * 0.2, width, height * 0.42);

      // perspective dots — stream toward the viewer; speed grows with scroll
      // and with proximity, so near rows visibly overtake the horizon
      const speed = BASE_SPEED + current * SCROLL_SPEED;
      const pulseWave = time * 0.012;

      for (const dot of dots) {
        const near = (dot.y - 0.42) / 0.56;
        const k = 0.22 + Math.max(0, near) * 1.15;
        dot.phase += 0.015;
        let yy = dot.y - speed * k;
        yy = ((yy % 1) + 1) % 1;
        dot.y = yy;

        const px = dot.x * width;
        const py = yy * height;
        const size = Math.max(0.4, dot.size * (0.5 + Math.max(0, near)));
        // warm pulse traveling from horizon → viewer, plus per-dot shimmer
        const wave = Math.sin(pulseWave + (1 - near) * 5);
        const shimmer = 0.55 + 0.45 * Math.sin(dot.phase + current * 20);
        const a = (0.18 + Math.max(0, near) * 0.32) * (0.5 + 0.5 * wave) * shimmer;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(242, 240, 234, ${Math.max(0, Math.min(1, a))})`;
        ctx.fill();
      }

      // faint lane guide lines — one per row, spanning the road width
      ctx.lineWidth = 1;
      for (let r = 0; r < rows.length; r++) {
        const near = r / (ROWS - 1);
        // find this row's current yy from any dot of that row
        let rowY = -1;
        for (const dot of dots) {
          if (dot.row === r) {
            rowY = dot.y;
            break;
          }
        }
        if (rowY < 0) continue;
        const py = rowY * height;
        const spread = rows[r].spread;
        const alpha = 0.03 + near * 0.09;
        ctx.strokeStyle = `rgba(242, 240, 234, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo((0.5 - spread) * width, py);
        ctx.lineTo((0.5 + spread) * width, py);
        ctx.stroke();
      }

      // embers — slow upward drift, warm two-layer glow
      for (const ember of embers) {
        ember.y -= ember.speed * 0.0011 * (1 + current * 2.5);
        ember.x += Math.sin(ember.twinkle + ember.drift) * 0.0012;
        ember.twinkle += 0.01;
        if (ember.y < -0.05) {
          ember.y = 1.05;
          ember.x = Math.random();
        }
        const px = ember.x * width;
        const py = ember.y * height;
        const flicker = 0.35 + 0.3 * Math.sin(ember.twinkle + time * 0.03);
        // soft halo
        ctx.beginPath();
        ctx.arc(px, py, ember.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 122, 26, ${Math.max(0, flicker * 0.12)})`;
        ctx.fill();
        // bright core
        ctx.beginPath();
        ctx.arc(px, py, ember.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 148, 60, ${Math.max(0, flicker)})`;
        ctx.fill();
      }

      // vignette for depth
      const vig = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.2,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.75
      );
      vig.addColorStop(0, "rgba(10, 10, 12, 0)");
      vig.addColorStop(1, "rgba(10, 10, 12, 0.55)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, width, height);
    };

    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      target = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };

    const onPointer = (e: PointerEvent) => {
      const dx = (e.clientX / width - 0.5) * 2;
      const dy = (e.clientY / height - 0.5) * 2;
      ctx.setTransform(dpr, 0, 0, dpr, -dx * 16, -dy * 16);
    };

    let raf = 0;
    let last = 0;
    const loop = (t: number) => {
      const dt = Math.min(2, (t - last) / 16.667);
      last = t;
      time += dt;
      current += (target - current) * (1 - Math.pow(0.82, dt));
      draw();
      raf = requestAnimationFrame(loop);
    };

    resize();
    onScroll();

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduceListener = (e: MediaQueryListEvent) => {
      if (e.matches) {
        cancelAnimationFrame(raf);
      } else if (!raf) {
        last = 0;
        raf = requestAnimationFrame(loop);
      }
    };
    mq.addEventListener("change", reduceListener);

    // intro: fade the scene in once
    const intro = createTimeline({ autoplay: true });
    intro.add(
      { value: 0 },
      {
        value: 1,
        duration: 1400,
        ease: "outQuad",
        onUpdate: (self) => {
          ctx.globalAlpha = self.progress;
        },
      }
    );

    window.addEventListener("scroll", onScroll, { passive: true });
    if (!coarse) window.addEventListener("pointermove", onPointer);

    if (reduced) {
      draw();
    } else {
      last = 0;
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      intro.pause();
      window.removeEventListener("scroll", onScroll);
      if (!coarse) window.removeEventListener("pointermove", onPointer);
      mq.removeEventListener("change", reduceListener);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 z-0 h-full w-full"
    />
  );
}
