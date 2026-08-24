"use client";

import { useRef, type CSSProperties } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";

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
      className={`pointer-events-none absolute top-1/2 z-20 w-[92vw] max-w-xl -translate-y-1/2 ${posClass}`}
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
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = prefersReducedMotion === true;
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 32, mass: 0.45 });
  const progress = reducedMotion ? scrollYProgress : smoothProgress;
  const scrollCueOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative h-[500vh]"
      aria-label="D-01 deep-sea submarine scroll story"
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
          style={{ backgroundImage: "url(/og-hero.jpg)" }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(180deg, rgba(2,7,11,0.42) 0%, rgba(2,7,11,0.12) 35%, rgba(2,7,11,0.72) 100%), radial-gradient(circle at 50% 45%, transparent 25%, rgba(2,7,11,0.62) 100%)",
          }}
          aria-hidden="true"
        />

        <Particles disabled={reducedMotion} />

        {BEATS.map((beat) => (
          <BeatText key={beat.key} progress={progress} beat={beat} reducedMotion={reducedMotion} />
        ))}

        <motion.div
          style={{ opacity: scrollCueOpacity }}
          className="pointer-events-none absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-3"
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">Scroll to explore</p>
          <span
            className="h-10 w-px origin-top bg-abyss-cyan/70"
            style={{ animation: reducedMotion ? undefined : "scrollLine 2.4s ease-in-out infinite" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
