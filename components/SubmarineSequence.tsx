"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";

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

function BeatText({
  progress,
  beat,
  reducedMotion,
}: {
  progress: MotionValue<number>;
  beat: Beat;
  reducedMotion: boolean;
}) {
  const [start, end] = beat.range;
  const pad = (end - start) * 0.08;
  const opacity = useTransform(progress, [start, start + pad, end - pad, end], [0, 1, 1, 0]);
  const y = useTransform(
    progress,
    [start, start + pad, end - pad, end],
    reducedMotion ? [0, 0, 0, 0] : [20, 0, 0, -20],
  );

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
      className={`pointer-events-none absolute top-1/2 z-20 w-[92vw] max-w-xl -translate-y-1/2 ${posClass} ${
        reducedMotion ? "motion-reduce" : ""
      }`}
      aria-hidden="true"
    >
      <motion.div style={{ opacity, y }} className={`flex flex-col gap-4 ${alignClass}`}>
        <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-abyss-cyan/80">{beat.eyebrow}</p>
        <h2 className="text-balance font-serif text-4xl leading-[0.95] tracking-tight text-white md:text-6xl">
          {beat.title.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
        <p className="max-w-[34ch] text-sm leading-relaxed text-white/60 md:text-base">{beat.subtitle}</p>
        {beat.cta ? (
          <a
            href="#signal"
            className="pointer-events-auto mt-2 inline-flex w-fit items-center gap-3 border-b border-abyss-cyan/40 pb-1 text-xs tracking-[0.25em] text-abyss-softblue transition hover:border-abyss-cyan hover:text-white"
            tabIndex={-1}
          >
            {beat.cta} <span aria-hidden>↓</span>
          </a>
        ) : null}
      </motion.div>
    </div>
  );
}

type ParticleStyle = CSSProperties & { "--drift-x": string };

function Particles({ disabled }: { disabled: boolean }) {
  if (disabled) return null;

  const particles = Array.from({ length: 26 }, (_, i) => i);
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden="true">
      {particles.map((i) => {
        const left = ((i * 53) % 100).toFixed(2);
        const size = 1 + (i % 3);
        const duration = 14 + (i % 7) * 2.5;
        const delay = -(i * 1.7) % duration;
        const driftX = ((i % 5) - 2) * 14;
        const style: ParticleStyle = {
          left: `${left}%`,
          bottom: "-10%",
          width: size,
          height: size,
          "--drift-x": `${driftX}px`,
          animation: `driftParticle ${duration}s linear infinite`,
          animationDelay: `${delay}s`,
        };

        return <span key={i} style={style} className="absolute rounded-full bg-abyss-softblue/60 blur-[0.5px]" />;
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

  const [settled, setSettled] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [failed, setFailed] = useState(0);
  const [ready, setReady] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = prefersReducedMotion === true;

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 32, mass: 0.45 });
  const progress = reducedMotion ? scrollYProgress : smoothProgress;
  const scrollCueOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  // Load the sequence before revealing it. Failed local assets are counted as settled,
  // but the renderer falls back to the closest frame instead of leaving a blank canvas.
  useEffect(() => {
    if (reducedMotion) return;

    let cancelled = false;
    const images: HTMLImageElement[] = new Array(FRAME_COUNT);
    const settledFrames = new Uint8Array(FRAME_COUNT);
    let settledCount = 0;
    let loadedCount = 0;
    let failedCount = 0;

    const settleFrame = (index: number, success: boolean) => {
      if (cancelled || settledFrames[index]) return;
      settledFrames[index] = 1;
      settledCount += 1;

      if (success) loadedCount += 1;
      else failedCount += 1;

      setSettled(settledCount);
      setLoaded(loadedCount);
      setFailed(failedCount);
      if (settledCount === FRAME_COUNT) setReady(true);

      // If the current frame loaded after the first render tick, force a repaint.
      if (success && index === frameRef.current) drawnRef.current = -1;
    };

    for (let i = 0; i < FRAME_COUNT; i += 1) {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => settleFrame(i, true);
      img.onerror = () => settleFrame(i, false);
      img.src = frameUrl(i);
      images[i] = img;
    }
    imagesRef.current = images;

    return () => {
      cancelled = true;
    };
  }, [reducedMotion]);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas || canvas.clientWidth === 0 || canvas.clientHeight === 0) return false;

    // During a partial load, use the nearest decoded frame so scrolling never exposes
    // an empty canvas. This also makes a single missing asset non-fatal.
    let img = imagesRef.current[index];
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let distance = 1; distance < FRAME_COUNT; distance += 1) {
        const before = imagesRef.current[index - distance];
        const after = imagesRef.current[index + distance];
        if (before?.complete && before.naturalWidth > 0) {
          img = before;
          break;
        }
        if (after?.complete && after.naturalWidth > 0) {
          img = after;
          break;
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return false;

    const ctx = canvas.getContext("2d");
    if (!ctx) return false;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssWidth = canvas.clientWidth;
    const cssHeight = canvas.clientHeight;
    const pixelWidth = Math.max(1, Math.ceil(cssWidth * dpr));
    const pixelHeight = Math.max(1, Math.ceil(cssHeight * dpr));

    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssWidth, cssHeight);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Contain fit preserves the 16:9 artwork without stretching or cropping it.
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
    return true;
  }, []);

  // Repaint only when the requested frame changes. If an image finishes loading after
  // the first tick, settleFrame() invalidates drawnRef so frame zero is not missed.
  useEffect(() => {
    if (reducedMotion) return;

    const unsubscribe = smoothProgress.on("change", (value) => {
      frameRef.current = Math.min(FRAME_COUNT - 1, Math.max(0, Math.floor(value * (FRAME_COUNT - 1))));
    });

    const tick = () => {
      if (drawnRef.current !== frameRef.current && drawFrame(frameRef.current)) {
        drawnRef.current = frameRef.current;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      unsubscribe();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [drawFrame, reducedMotion, smoothProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const invalidate = () => {
      drawnRef.current = -1;
    };
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(invalidate) : null;
    observer?.observe(canvas);
    window.addEventListener("resize", invalidate);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", invalidate);
    };
  }, []);

  const progressPct = Math.round((settled / FRAME_COUNT) * 100);

  return (
    <section
      ref={containerRef}
      className="relative h-[500vh]"
      aria-label="D-01 deep-sea submarine scroll sequence"
    >
      <div className="sr-only">
        <h1>D-01 — Deep Ocean Expedition</h1>
        <p>
          Explore a fictional autonomous submarine as it descends, comes apart into its engineered systems, and
          reassembles for departure.
        </p>
        <ol>
          {BEATS.map((beat) => (
            <li key={beat.key}>
              {beat.eyebrow}: {beat.title.join(" ")} — {beat.subtitle}
            </li>
          ))}
        </ol>
        <a href="#signal">Explore the system</a>
      </div>

      <div className="sticky top-0 h-screen w-full overflow-hidden bg-gradient-to-b from-[#062638] via-[#031018] to-[#02070b]">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/sequence/frame_000.webp)" }}
          aria-hidden="true"
        />

        {!ready && !reducedMotion && (
          <div
            className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(2,7,11,0.86), rgba(2,7,11,0.94)), url(/og-hero.jpg)`,
            }}
            role="status"
            aria-live="polite"
          >
            <p className="text-[11px] uppercase tracking-[0.35em] text-abyss-softblue/80">Initializing deep-sea system</p>
            <div className="h-px w-64 overflow-hidden bg-white/10" aria-hidden="true">
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

        <Particles disabled={reducedMotion} />

        <canvas ref={canvasRef} className="absolute inset-0 z-0 h-full w-full" aria-hidden="true" />

        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{ background: "radial-gradient(circle at 50% 45%, transparent 35%, rgba(2,7,11,0.55) 100%)" }}
          aria-hidden="true"
        />

        {BEATS.map((beat) => (
          <BeatText key={beat.key} progress={progress} beat={beat} reducedMotion={reducedMotion} />
        ))}

        <motion.div
          style={{ opacity: scrollCueOpacity }}
          className="pointer-events-none absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-3"
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">Scroll to descend</p>
          <span
            className="h-10 w-px origin-top bg-abyss-cyan/70"
            style={{ animation: reducedMotion ? undefined : "scrollLine 2.4s ease-in-out infinite" }}
          />
        </motion.div>

        {ready && failed > 0 && !reducedMotion ? (
          <p className="pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2 text-[9px] uppercase tracking-[0.18em] text-white/30">
            {loaded} of {FRAME_COUNT} sequence frames available
          </p>
        ) : null}
      </div>
    </section>
  );
}
