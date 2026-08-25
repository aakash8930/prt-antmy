"use client";

import { useRef } from "react";
import { useDirectFrame, type ExperienceSnapshot } from "@/experience/ExperienceStore";
import { windowRange } from "@/animation/MasterTimeline";
import { explodeFor } from "@/experience/ExplodedViewController";
import { PART_LABELS } from "@/experience/Motorcycle";
import SequenceLayer from "./SequenceLayer";

type RefType = React.RefObject<HTMLElement | null>;

const setOpacity = (
  el: HTMLElement | null,
  value: number,
  translate = 26,
) => {
  if (!el) return;
  el.style.opacity = value.toFixed(3);
  el.style.transform = `translateY(${((1 - value) * translate).toFixed(1)}px)`;
};

const Headline = ({
  from,
  to,
  fullFrom = to,
  fullTo = from,
  className = "",
  children,
}: {
  from: number;
  to: number;
  fullFrom?: number;
  fullTo?: number;
  className?: string;
  children: React.ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useDirectFrame((s) => {
    const w = windowRange(s.progress, from, to, fullFrom, fullTo);
    setOpacity(ref.current, w);
  });
  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute inset-0 flex items-center px-6 opacity-0 sm:px-14 ${className}`}
    >
      {children}
    </div>
  );
};

const RevealLine = ({ children }: { children: React.ReactNode }) => (
  <div className="overflow-hidden">
    <div className="translate-y-[0.02em]">{children}</div>
  </div>
);

export default function ExperienceOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[40] overflow-hidden">
      <SequenceLayer />
      <BootSequence />
      <ProgressRail />
      <ActHeadlines />
      <Annotations />
      <PowerTelemetry />
      <PerformanceHud />
      <HumanSection />
      <FinalSection />
      <HoverLabel />
      <ReducedMotionFallback />
    </div>
  );
}

const BootSequence = () => {
  const ref = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLParagraphElement>(null);
  useDirectFrame((s) => {
    const w = windowRange(s.progress, 0, 0.09, 0.12, 0.16);
    setOpacity(ref.current, w, 6);
    if (text.current) {
      text.current.textContent =
        s.progress < 0.012 ? "SYSTEM // OFFLINE" : "SYSTEM // INITIALIZING";
    }
  });
  return (
    <div className="absolute inset-x-0 top-[24%] flex justify-center">
      <div ref={ref} className="text-center opacity-0">
        <p ref={text} className="font-tech text-[10px] uppercase tracking-[0.32em] text-[#9fe8dd]/70">
          SYSTEM // OFFLINE
        </p>
        <div className="mx-auto mt-3 h-px w-24 bg-gradient-to-r from-transparent via-[#9fe8dd]/50 to-transparent" />
      </div>
    </div>
  );
};

const ActHeadlines = () => (
  <>
    <Headline from={0.005} to={0.03} fullFrom={0.035} fullTo={0.055} className="justify-center text-center">
      <h1 className="volt-headline text-[clamp(36px,6.3vw,112px)]">
        <RevealLine>Power should be felt</RevealLine>
        <RevealLine>
          <span className="text-white/70">before it is seen.</span>
        </RevealLine>
      </h1>
    </Headline>

    <Headline from={0.09} to={0.15} fullFrom={0.16} fullTo={0.2} className="items-end">
      <div className="pb-6 sm:pb-12">
        <div className="volt-label mb-4">01 / FORM</div>
        <h2 className="volt-headline text-[clamp(30px,5vw,84px)]">
          <RevealLine>Every line</RevealLine>
          <RevealLine>has a purpose.</RevealLine>
        </h2>
      </div>
    </Headline>

    <Headline from={0.245} to={0.275} fullFrom={0.285} fullTo={0.315} className="items-start">
      <div className="pt-6 sm:pt-16">
        <div className="volt-label mb-4">02 / MATERIAL</div>
        <h2 className="volt-headline text-[clamp(30px,5vw,84px)]">
          <RevealLine>Designed around</RevealLine>
          <RevealLine>motion.</RevealLine>
        </h2>
      </div>
    </Headline>

    <Headline from={0.37} to={0.43} fullFrom={0.44} fullTo={0.5} className="items-center justify-end text-right">
      <div>
        <div className="volt-label mb-4 justify-end">03 / STRUCTURE</div>
        <h2 className="volt-headline text-[clamp(30px,5vw,88px)]">
          <RevealLine>Deconstruction</RevealLine>
          <RevealLine>The machine,</RevealLine>
          <RevealLine>exposed.</RevealLine>
        </h2>
      </div>
    </Headline>

    <Headline from={0.54} to={0.58} fullFrom={0.59} fullTo={0.64} className="items-start">
      <div className="pt-14">
        <div className="volt-label mb-4">04 / POWER SYSTEM</div>
        <h2 className="volt-headline text-[clamp(30px,5vw,84px)]">
          <RevealLine>Energy,</RevealLine>
          <RevealLine>controlled.</RevealLine>
        </h2>
      </div>
    </Headline>

    <Headline from={0.68} to={0.71} fullFrom={0.72} fullTo={0.76} className="justify-center text-center">
      <div>
        <div className="volt-label mb-4">05 / THE CORE</div>
        <h2 className="volt-headline text-[clamp(30px,5vw,88px)]">
          <RevealLine>Turning energy</RevealLine>
          <RevealLine>into motion.</RevealLine>
        </h2>
      </div>
    </Headline>

    <Headline from={0.905} to={0.925} fullFrom={0.935} fullTo={0.955} className="items-start">
      <div className="pt-16">
        <div className="volt-label mb-4">07 / HUMAN + MACHINE</div>
        <h2 className="volt-headline text-[clamp(26px,4.6vw,76px)]">
          <RevealLine>Technology should</RevealLine>
          <RevealLine>disappear when the</RevealLine>
          <RevealLine>experience begins.</RevealLine>
        </h2>
      </div>
    </Headline>
  </>
);

const ANNOTATIONS: Array<{
  n: string;
  title: string;
  className: string;
}> = [
  { n: "01", title: "POWER", className: "left-[34%] top-[26%]" },
  { n: "02", title: "CONTROL", className: "left-[46%] top-[16%]" },
  { n: "03", title: "STRUCTURE", className: "left-[48%] top-[46%]" },
  { n: "04", title: "THERMAL", className: "left-[62%] top-[30%]" },
  { n: "05", title: "DRIVE", className: "left-[60%] top-[58%]" },
];

const Annotations = () => {
  return (
    <>
      {ANNOTATIONS.map((a) => (
        <AnnotationItem key={a.n} {...a} />
      ))}
    </>
  );
};

const AnnotationItem = ({
  n,
  title,
  className,
}: {
  n: string;
  title: string;
  className: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useDirectFrame((s) => {
    const w =
      windowRange(s.progress, 0.38, 0.44, 0.47, 0.55) *
      (explodeFor(s.progress) * 0.9 + 0.1);
    setOpacity(ref.current, w, 12);
  });
  return (
    <div
      ref={ref}
      className={`absolute flex items-center gap-3 opacity-0 ${className}`}
    >
      <span className="outline-number font-tech text-[34px] leading-none">
        {n}
      </span>
      <div className="w-6">
        <div className="leader-line" />
      </div>
      <span className="font-tech text-[11px] uppercase tracking-[0.22em] text-white/80">
        {title}
      </span>
    </div>
  );
};

const TEL = [
  { label: "VOLTAGE", unit: "V", calc: (p: number, t: number) => 683 + Math.sin(t * 0.2) * 6 + p * 40 },
  { label: "CURRENT", unit: "A", calc: (p: number, t: number) => 44 + Math.sin(t * 1.1) * 4 + p * 18 },
  { label: "TEMP", unit: "°C", calc: (p: number, t: number) => 31 + Math.sin(t * 0.4) * 2 + p * 6 },
  { label: "POWER", unit: "kW", calc: (p: number, t: number) => 118 + Math.sin(t * 0.7) * 8 + p * 60 },
  { label: "EFF", unit: "%", calc: () => 91.4 },
];

const PowerTelemetry = () => {
  const ref = useRef<HTMLDivElement>(null);
  useDirectFrame((s) => {
    const w = windowRange(s.progress, 0.55, 0.59, 0.61, 0.645);
    setOpacity(ref.current, w, 18);
  });
  return (
    <div className="absolute inset-x-0 bottom-[8vh] flex justify-center">
      <div
        ref={ref}
        className="flex gap-5 opacity-0 sm:gap-8"
      >
        {TEL.map((t) => (
          <TelemetryCell key={t.label} {...t} />
        ))}
      </div>
    </div>
  );
};

const TelemetryCell = ({
  label,
  unit,
  calc,
}: {
  label: string;
  unit: string;
  calc: (p: number, t: number) => number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useDirectFrame((s) => {
    if (!ref.current) return;
    const v = calc(s.progress, (s.frame % 600) / 60);
    ref.current.textContent = String(Math.round(v)).padStart(unit === "%" ? 4 : 3, "0");
  });
  return (
    <div className="text-center">
      <div className="volt-label !text-[8px]">{label}</div>
      <div className="mt-1 flex items-baseline justify-center gap-1">
        <span ref={ref as RefType} className="volt-mono text-[clamp(14px,1.8vw,24px)] text-white/90">
          000
        </span>
        <span className="volt-label !text-[8px]">{unit}</span>
      </div>
    </div>
  );
};

const PerformanceHud = () => {
  const speedRef = useRef<HTMLSpanElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const gearRef = useRef<HTMLSpanElement>(null);

  useDirectFrame((s) => {
    const w = windowRange(s.progress, 0.79, 0.84, 0.86, 0.9);
    setOpacity(wrapRef.current, w, 10);
    if (speedRef.current) {
      const speed = Math.max(0, Math.min(220, Math.round(s.motorSpeed)));
      speedRef.current.textContent = String(speed).padStart(3, "0");
    }
    if (gearRef.current) {
      const speed = s.motorSpeed;
      gearRef.current.textContent = speed > 160 ? "P4" : speed > 120 ? "P3" : speed > 80 ? "P2" : speed > 20 ? "P1" : "N";
    }
  });

  return (
    <div
      ref={wrapRef}
      className="absolute bottom-[7vh] right-[6vw] text-right opacity-0"
    >
      <div className="volt-label mb-2 !text-[9px]">SPEED</div>
      <div className="flex items-baseline justify-end gap-2">
        <span
          ref={speedRef}
          className="volt-mono text-[clamp(48px,9vw,132px)] font-light leading-none text-white/94"
        >
          000
        </span>
        <span className="font-tech text-[12px] text-white/40">KM/H</span>
      </div>
      <div className="mt-3 flex items-center justify-end gap-1.5">
        <span ref={gearRef} className="font-tech text-[10px] tracking-[0.2em] text-[#9fe8dd]/80">
          P0
        </span>
        <div className="flex w-24 items-end justify-end gap-[3px]">
          {[1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              className="hud-tick"
              data-i={i}
              style={{ transform: `scaleX(${0.5 + i * 0.1})` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const HumanSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  useDirectFrame((s) => {
    const v = windowRange(s.progress, 0.9, 0.925, 0.935, 0.955);
    setOpacity(ref.current, v, 14);
  });
  return (
    <div className="absolute inset-x-0 bottom-[9vh] flex justify-center">
      <div ref={ref} className="text-center opacity-0">
        <div className="volt-label mb-2">PROXIMITY SENSOR — ACTIVE</div>
        <div className="font-tech text-[10px] uppercase tracking-[0.22em] text-white/50">
          PILOT APPROACHING / SYSTEMS WAKING
        </div>
      </div>
    </div>
  );
};

const FinalSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const cta = useRef<HTMLButtonElement>(null);
  useDirectFrame((s) => {
    const v = windowRange(s.progress, 0.965, 0.985, 0.99, 1.0);
    setOpacity(ref.current, v, 22);
    if (cta.current) cta.current.style.visibility = v > 0.5 ? "visible" : "hidden";
  });
  return (
    <div ref={ref} className="absolute inset-0 flex flex-col items-center justify-center text-center opacity-0">
      <div className="text-[clamp(64px,13vw,220px)] font-semibold leading-none tracking-[0.16em]">
        VOLT
      </div>
      <div className="volt-label mt-5 !text-[11px]">ENGINEERED TO MOVE</div>
      <div className="mt-10">
        <button
          ref={cta}
          onClick={() => window.dispatchEvent(new CustomEvent("volt:jump", { detail: 1 }))}
          className="pointer-events-auto flex items-center gap-3 border border-white/15 bg-black/20 px-5 py-3 font-tech text-[10px] uppercase tracking-[0.24em] text-white/70 backdrop-blur-sm transition hover:border-[#9fe8dd]/50 hover:text-white"
        >
          EXPLORE THE MACHINE <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
};

const ProgressRail = () => {
  const fill = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  useDirectFrame((s) => {
    const p = s.progress * 100;
    if (fill.current) fill.current.style.transform = `scaleY(${s.progress.toFixed(4)})`;
    if (dot.current) dot.current.style.bottom = `${p}%`;
    if (label.current) label.current.textContent = `0${s.phaseIndex + 1}`;
  });
  return (
    <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col items-end gap-3 sm:flex">
      <span ref={label} className="volt-mono text-[10px] text-white/50">01</span>
      <div className="relative h-[180px] w-px bg-white/10">
        <div
          ref={fill}
          className="absolute inset-0 origin-top bg-[#9fe8dd]/70"
          style={{ transform: "scaleY(0)" }}
        />
        <div
          ref={dot}
          className="absolute h-1.5 w-1.5 -translate-y-1/2 translate-x-[-2.5px] rounded-full bg-[#9fe8dd]"
          style={{ bottom: "0%" }}
        />
      </div>
      <span className="font-tech text-[9px] text-white/35">09</span>
    </div>
  );
};

const HoverLabel = () => {
  const box = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLSpanElement>(null);
  useDirectFrame((s) => {
    const show =
      s.hoveredPart && PART_LABELS[s.hoveredPart as keyof typeof PART_LABELS]
        ? 1
        : 0;
    setOpacity(box.current, show, 8);
    if (text.current && s.hoveredPart && PART_LABELS[s.hoveredPart as keyof typeof PART_LABELS]) {
      text.current.textContent = PART_LABELS[s.hoveredPart as keyof typeof PART_LABELS];
    }
  });
  return (
    <div
      ref={box}
      className="pointer-events-none absolute bottom-7 left-6 flex items-center gap-3 opacity-0 sm:left-10"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[#9fe8dd]" />
      <span ref={text} className="font-tech text-[10px] uppercase tracking-[0.24em] text-white/80">
        COMPONENT
      </span>
      <button
        onClick={() => window.dispatchEvent(new CustomEvent("volt:return"))}
        className="pointer-events-auto ml-2 border border-white/12 px-2 py-1 font-tech text-[9px] uppercase tracking-[0.18em] text-white/50 transition hover:text-white"
      >
        RETURN TO EXPERIENCE
      </button>
    </div>
  );
};

const ReducedMotionFallback = () => {
  const ref = useRef<HTMLDivElement>(null);
  useDirectFrame((s: ExperienceSnapshot) => {
    if (!ref.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced) return;
    const content = ref.current;
    content.style.opacity = s.progress > 0.94 ? "1" : "0";
  });
  return (
    <div ref={ref} className="absolute inset-0 flex items-center justify-center opacity-0">
      <div className="text-center">
        <div className="text-[clamp(52px,10vw,170px)] font-semibold tracking-[0.16em]">VOLT</div>
        <div className="volt-label mt-4">ENGINEERED TO MOVE</div>
      </div>
    </div>
  );
};
