"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useSpring, useTransform, MotionValue } from "framer-motion";

const FRAME_COUNT = 240;
const frameUrl = (index: number) => `/sequence/frame_${String(index).padStart(3, "0")}.webp`;

type Beat = {
  key: string;
  range: [number, number];
  align: "center" | "left" | "right";
  eyebrow: string;
  title: string[];
  subtitle: string;
  cta?: string;
};

const BEATS: Beat[] = [
  {
    key: "awaken",
    range: [0, 0.18],
    align: "center",
    eyebrow: "D-01 · Field record",
    title: ["THE DEEP", "AWAKENS"],
    subtitle: "A new generation of autonomous exploration.",
  },
  {
    key: "built",
    range: [0.18, 0.38],
    align: "left",
    eyebrow: "01 — Structure",
    title: ["BUILT FOR", "THE UNKNOWN"],
    subtitle: "Every layer is engineered for pressure, precision and endurance.",
  },
  {
    key: "systems",
    range: [0.38, 0.68],
    align: "right",
    eyebrow: "02 — Engineering",
    title: ["EVERY SYSTEM", "HAS A PURPOSE"],
    subtitle: "From energy systems to propulsion, thousands of components work as one.",
  },
  {
    key: "engineered",
    range: [0.68, 0.84],
    align: "left",
    eyebrow: "03 — Assembly",
    title: ["ENGINEERED", "AS ONE"],
    subtitle: "Precision becomes performance.",
  },
  {
    key: "deeper",
    range: [0.84, 1],
    align: "center",
    eyebrow: "04 — Departure",
    title: ["GO", "DEEPER"],
    subtitle: "The ocean is only the beginning.",
    cta: "EXPLORE THE SYSTEM",
  },
];

function BeatText({ progress, beat }: { progress: MotionValue<number>; beat: Beat }) {
  const [start, end] = beat.range;
  const pad = (end - start) * 0.08;
  const opacity = useTransform(progress, [start, start + pad, end - pad, end], [0, 1, 1, 0]);
  const y = useTransform(progress, [start, start + pad, end - pad, end], [20, 0, 0, -20]);

  const alignClass =
    beat.align === "center" ? "items-center text-center" : beat.align === "left" ? "items-start text-left" : "items-end text-right";
  const posClass =
    beat.align === "center"
      ? "left-1/2 -translate-x-1/2"
      : beat.align === "left"
        ? "left-[6vw] md:left-[8vw]"
        : "right-[6vw] md:right-[8vw]";

  return (
    <div
      className={`pointer-events-none absolute top-1/2 -translate-y-1/2 z-20 w-[92vw] max-w-xl md:w-[38vw] ${posClass}`}
    >
      <motion.div style={{ opacity, y }} className={`flex flex-col gap-4 ${alignClass}`}>
        <p className="text-[11px] tracking-[0.3em] text-abyss-cyan/80 uppercase font-medium">{beat.eyebrow}</p>
        <h2 className="text-4xl md:text-6xl leading-[0.95] font-serif tracking-tight text-white text-balance">
          {beat.title.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
        <p className="max-w-[34ch] text-sm md:text-base text-white/60 leading-relaxed">{beat.subtitle}</p>
        {beat.cta ? (
          <a
            href="#signal"
            className="pointer-events-auto mt-2 inline-flex w-fit items-center gap-3 border-b border-abyss-cyan/40 pb-1 text-xs tracking-[0.25em] text-abyss-softblue transition hover:border-abyss-cyan hover:text-white"
          >
            {beat.cta} <span aria-hidden>↓</span>
          </a>
        ) : null}
      </motion.div>
    </div>
  );
}

function Particles() {
  const particles = Array.from({ length: 26 }, (_, i) => i);
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {particles.map((i) => {
        const left = ((i * 53) % 100).toFixed(2);
        const size = 1 + (i % 3);
        const duration = 14 + (i % 7) * 2.5;
        const delay = -(i * 1.7) % duration;
        const driftX = ((i % 5) - 2) * 14;
        return (
          <span
            key={i}
            style={{
              left: `${left}%`,
              bottom: "-10%",
              width: size,
              height: size,
              // @ts-expect-error -- custom property for the drift keyframes
              "--drift-x": `${driftX}px`,
              animation: `driftParticle ${duration}s linear infinite`,
              animationDelay: `${delay}s`,
            }}
            className="absolute rounded-full bg-abyss-softblue/60 blur-[0.5px]"
          />
        );
      })}
    </div>
  );
}

export default function SubmarineSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameRef = useRef(0);
  const drawnRef = useRef(-1);
  const rafRef = useRef<number | null>(null);

  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, mass: 0.5 });
  const scrollCueOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  // Preload every frame before revealing the experience, so scrubbing never stutters.
  useEffect(() => {
    let cancelled = false;
    const images: HTMLImageElement[] = new Array(FRAME_COUNT);
    let count = 0;

    for (let i = 0; i < FRAME_COUNT; i += 1) {
      const img = new Image();
      img.decoding = "async";
      img.src = frameUrl(i);
      const bump = () => {
        if (cancelled) return;
        count += 1;
        setLoaded(count);
        if (count >= FRAME_COUNT) setReady(true);
      };
      img.onload = bump;
      img.onerror = bump;
      images[i] = img;
    }
    imagesRef.current = images;

    return () => {
      cancelled = true;
    };
  }, []);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssWidth = canvas.clientWidth;
    const cssHeight = canvas.clientHeight;
    if (canvas.width !== cssWidth * dpr || canvas.height !== cssHeight * dpr) {
      canvas.width = cssWidth * dpr;
      canvas.height = cssHeight * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssWidth, cssHeight);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // "contain" fit: preserve aspect ratio, no cropping, no stretching.
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const boxRatio = cssWidth / cssHeight;
    let drawWidth: number;
    let drawHeight: number;
    if (imgRatio > boxRatio) {
      drawWidth = cssWidth;
      drawHeight = cssWidth / imgRatio;
    } else {
      drawHeight = cssHeight;
      drawWidth = cssHeight * imgRatio;
    }
    const dx = (cssWidth - drawWidth) / 2;
    const dy = (cssHeight - drawHeight) / 2;
    ctx.drawImage(img, dx, dy, drawWidth, drawHeight);
  }, []);

  // Render loop: canvas only repaints when the target frame index actually changes.
  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (v) => {
      const idx = Math.min(FRAME_COUNT - 1, Math.max(0, Math.floor(v * (FRAME_COUNT - 1))));
      frameRef.current = idx;
    });

    const tick = () => {
      if (drawnRef.current !== frameRef.current) {
        drawFrame(frameRef.current);
        drawnRef.current = frameRef.current;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      unsubscribe();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [drawFrame, smoothProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleResize = () => {
      drawnRef.current = -1;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const progressPct = Math.round((loaded / FRAME_COUNT) * 100);

  return (
    <section ref={containerRef} className="relative h-[500vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-gradient-to-b from-[#062638] via-[#031018] to-[#02070b]">
        {!ready && (
          <div
            className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(2,7,11,0.86), rgba(2,7,11,0.94)), url(/og-hero.jpg)`,
            }}
          >
            <p className="text-[11px] tracking-[0.35em] text-abyss-softblue/80 uppercase">Initializing deep-sea system</p>
            <div className="h-px w-64 overflow-hidden bg-white/10">
              <div
                className="h-full bg-abyss-cyan transition-[width] duration-200 ease-out"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="font-mono text-xs text-white/50">
              LOADING SUBMARINE SYSTEMS — {String(progressPct).padStart(2, "0")}%
            </p>
          </div>
        )}

        <Particles />

        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-0 h-full w-full"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{ background: "radial-gradient(circle at 50% 45%, transparent 35%, rgba(2,7,11,0.55) 100%)" }}
        />

        {BEATS.map((beat) => (
          <BeatText key={beat.key} progress={smoothProgress} beat={beat} />
        ))}

        <motion.div
          style={{ opacity: scrollCueOpacity }}
          className="pointer-events-none absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-3"
        >
          <p className="text-[10px] tracking-[0.3em] text-white/50 uppercase">Scroll to descend</p>
          <span className="h-10 w-px origin-top bg-abyss-cyan/70" style={{ animation: "scrollLine 2.4s ease-in-out infinite" }} />
        </motion.div>
      </div>
    </section>
  );
}
