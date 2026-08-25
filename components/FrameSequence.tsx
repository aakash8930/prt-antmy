"use client";

import { animate, onScroll, type JSAnimation } from "animejs";
import { useCallback, useEffect, useRef, useState } from "react";

const FRAME_COUNT = 1200;
const FRAME_RATE = 30;
const SEQUENCE_DURATION = 40000;
const INITIAL_BATCH = 36;
const PREFETCH_AHEAD = 42;
const PREFETCH_BEHIND = 8;
const MAX_CACHED_FRAMES = 110;
const frameUrl = (index: number) => `/sequence/frame_${String(index).padStart(4, "0")}.webp`;

const phases = [
  {
    eyebrow: "01 / Full-stack development",
    title: "Build from the signal.",
    body: "Interfaces, APIs, and the quiet architecture that makes products feel effortless.",
  },
  {
    eyebrow: "02 / Backend systems",
    title: "Make it hold.",
    body: "Reliable foundations for data, authentication, and every interaction behind the screen.",
  },
  {
    eyebrow: "03 / Engineered to scale",
    title: "Design for distance.",
    body: "Systems that stay clear under pressure, from the first user to the millionth request.",
  },
  {
    eyebrow: "04 / AI + intelligent systems",
    title: "Let it think.",
    body: "Automation and intelligence, shaped into tools people can actually use.",
  },
];

type SequenceState = { progress: number };

export default function FrameSequence() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef(new Map<number, HTMLImageElement>());
  const pendingRef = useRef(new Set<number>());
  const currentFrameRef = useRef(0);
  const renderedFrameRef = useRef(-1);
  const [loaded, setLoaded] = useState(0);
  const [failed, setFailed] = useState(0);
  const [ready, setReady] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);

  const drawFrame = useCallback((requestedFrame: number) => {
    const canvas = canvasRef.current;
    if (!canvas || canvas.clientWidth === 0 || canvas.clientHeight === 0) return false;

    let image = imagesRef.current.get(requestedFrame);
    if (!image || !image.complete || image.naturalWidth === 0) {
      for (let distance = 1; distance < FRAME_COUNT; distance += 1) {
        const before = imagesRef.current.get(requestedFrame - distance);
        const after = imagesRef.current.get(requestedFrame + distance);
        if (before?.complete && before.naturalWidth > 0) {
          image = before;
          break;
        }
        if (after?.complete && after.naturalWidth > 0) {
          image = after;
          break;
        }
      }
    }

    if (!image || !image.complete || image.naturalWidth === 0) return false;

    const context = canvas.getContext("2d");
    if (!context) return false;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const pixelWidth = Math.max(1, Math.ceil(width * dpr));
    const pixelHeight = Math.max(1, Math.ceil(height * dpr));

    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }

    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    const imageRatio = image.naturalWidth / image.naturalHeight;
    const viewportRatio = width / height;
    const drawWidth = imageRatio > viewportRatio ? height * imageRatio : width;
    const drawHeight = imageRatio > viewportRatio ? height : width / imageRatio;
    const x = (width - drawWidth) / 2;
    const y = (height - drawHeight) / 2;
    context.drawImage(image, x, y, drawWidth, drawHeight);
    return true;
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let cancelled = false;
    let drawFrameId: number | null = null;
    const initialSettled = new Set<number>();

    const scheduleDraw = () => {
      if (drawFrameId !== null) return;
      drawFrameId = requestAnimationFrame(() => {
        drawFrameId = null;
        if (renderedFrameRef.current !== currentFrameRef.current && drawFrame(currentFrameRef.current)) {
          renderedFrameRef.current = currentFrameRef.current;
        }
      });
    };

    const pruneCache = () => {
      const cache = imagesRef.current;
      if (cache.size <= MAX_CACHED_FRAMES) return;
      const removable = [...cache.keys()]
        .filter((index) => index !== currentFrameRef.current)
        .sort((a, b) => Math.abs(b - currentFrameRef.current) - Math.abs(a - currentFrameRef.current));
      while (cache.size > MAX_CACHED_FRAMES && removable.length > 0) {
        cache.delete(removable.shift()!);
      }
    };

    const loadFrame = (index: number) => {
      if (cancelled || index < 0 || index >= FRAME_COUNT || imagesRef.current.has(index) || pendingRef.current.has(index)) return;
      pendingRef.current.add(index);
      const image = new Image();
      image.decoding = "async";
      image.onload = () => {
        pendingRef.current.delete(index);
        if (cancelled) return;
        imagesRef.current.set(index, image);
        setLoaded((count) => count + 1);
        if (index < INITIAL_BATCH) {
          initialSettled.add(index);
          if (initialSettled.size >= INITIAL_BATCH) setReady(true);
        }
        if (index === currentFrameRef.current) renderedFrameRef.current = -1;
        pruneCache();
        scheduleDraw();
      };
      image.onerror = () => {
        pendingRef.current.delete(index);
        if (cancelled) return;
        setFailed((count) => count + 1);
        if (index < INITIAL_BATCH) {
          initialSettled.add(index);
          if (initialSettled.size >= INITIAL_BATCH) setReady(true);
        }
        scheduleDraw();
      };
      image.src = frameUrl(index);
    };

    const queueAround = (index: number, direction: number) => {
      loadFrame(index);
      for (let offset = 1; offset <= PREFETCH_AHEAD; offset += 1) {
        loadFrame(index + offset * direction);
      }
      for (let offset = 1; offset <= PREFETCH_BEHIND; offset += 1) {
        loadFrame(index - offset * direction);
      }
    };

    for (let index = 0; index < INITIAL_BATCH; index += 1) loadFrame(index);

    const sequenceState: SequenceState = { progress: 0 };
    const playback: JSAnimation = animate(sequenceState, {
      progress: 1,
      duration: SEQUENCE_DURATION,
      ease: "linear",
      autoplay: false,
    });
    let previousProgress = 0;

    const scrollObserver = onScroll({
      target: stage,
      sync: 0.2,
      onUpdate: (observer) => {
        const direction = observer.progress >= previousProgress ? 1 : -1;
        previousProgress = observer.progress;
        playback.seek(observer.progress * playback.duration);
        const frame = Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(sequenceState.progress * (FRAME_COUNT - 1))));
        currentFrameRef.current = frame;
        const nextPhase = Math.min(phases.length - 1, Math.floor(observer.progress * phases.length));
        setPhaseIndex((value) => (value === nextPhase ? value : nextPhase));
        queueAround(frame, direction);
        scheduleDraw();
      },
    });

    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(scheduleDraw) : null;
    resizeObserver?.observe(stage);
    scheduleDraw();

    return () => {
      cancelled = true;
      scrollObserver.revert();
      playback.cancel();
      resizeObserver?.disconnect();
      if (drawFrameId !== null) cancelAnimationFrame(drawFrameId);
    };
  }, [drawFrame]);

  const phase = phases[phaseIndex];
  const progressPercent = Math.min(100, Math.round(((loaded + failed) / INITIAL_BATCH) * 100));

  return (
    <section ref={stageRef} className="relative h-[520vh]" aria-label="Aakash Singh portfolio motion study">
      <div className="sticky top-0 h-screen overflow-hidden bg-ink">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/sequence/frame_0000.webp)" }}
          aria-hidden="true"
        />
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
        <div className="stage-vignette absolute inset-0" aria-hidden="true" />
        <div className="grid-overlay pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />

        {!ready ? (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-5 bg-ink/85" role="status" aria-live="polite">
            <p className="eyebrow text-cyan/75">Loading motion study</p>
            <div className="h-px w-64 bg-white/15" aria-hidden="true">
              <div className="h-full bg-lime transition-[width] duration-150" style={{ width: `${progressPercent}%` }} />
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/40">
              {failed > 0 ? `${failed} unavailable / using nearest frame` : `Caching ${INITIAL_BATCH} key frames`}
            </p>
          </div>
        ) : null}

        <div className="absolute inset-x-6 top-1/2 z-20 -translate-y-1/2 md:left-12 md:right-auto md:max-w-sm">
          <div key={phase.eyebrow} className="phase-copy">
            <p className="eyebrow text-cyan/75">{phase.eyebrow}</p>
            <h2 className="mt-5 max-w-sm font-display text-[clamp(2.7rem,6vw,6rem)] font-black uppercase leading-[0.84] tracking-[-0.075em] text-white">
              {phase.title}
            </h2>
            <p className="mt-7 max-w-xs text-sm leading-relaxed text-white/55 md:text-base">{phase.body}</p>
          </div>
        </div>

        <div className="absolute bottom-7 left-6 z-20 font-mono text-[10px] uppercase tracking-[0.22em] text-white/40 md:left-12">
          <span className="text-lime">02</span> / Scroll to compose
        </div>
        <div className="absolute bottom-7 right-6 z-20 text-right font-mono text-[10px] uppercase tracking-[0.22em] text-white/40 md:right-12">
          {String(phaseIndex + 1).padStart(2, "0")} / 04
          <br />
          {FRAME_RATE} FPS / 40 SEC
        </div>
      </div>
    </section>
  );
}
