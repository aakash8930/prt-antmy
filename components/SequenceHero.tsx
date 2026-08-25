"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { profile, flagshipProjects } from "@/lib/data";

const FRAME_COUNT = 1200;
const FRAME_PATH = (i: number) =>
  `/sequence/frame_${String(i).padStart(4, "0")}.webp`;
const PRELOAD_CONCURRENCY = 6;

export default function SequenceHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const cache = useRef<Map<number, HTMLImageElement>>(new Map());
  const pending = useRef<Map<number, Promise<HTMLImageElement>>>(new Map());
  const lastDrawn = useRef<number>(-1);
  const activeIndexRef = useRef<number>(-1);

  const [ready, setReady] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [activeIndex, setActiveIndex] = useState(-1);

  const getImage = useCallback((i: number): Promise<HTMLImageElement> => {
    const cached = cache.current.get(i);
    if (cached) return Promise.resolve(cached);
    const inflight = pending.current.get(i);
    if (inflight) return inflight;

    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        cache.current.set(i, img);
        pending.current.delete(i);
        resolve(img);
      };
      img.onerror = reject;
      img.src = FRAME_PATH(i);
    });
    pending.current.set(i, promise);
    return promise;
  }, []);

  const draw = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const targetW = Math.round(w * dpr);
    const targetH = Math.round(h * dpr);
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
  }, []);

  const showFrame = useCallback(
    (index: number) => {
      const cached = cache.current.get(index);
      if (cached) {
        draw(cached);
        lastDrawn.current = index;
        return;
      }
      getImage(index).then((img) => {
        draw(img);
        lastDrawn.current = index;
      });
      // prefetch a small window ahead so scrubbing forward stays smooth
      for (let k = index + 1; k <= Math.min(index + 8, FRAME_COUNT - 1); k++) {
        if (!cache.current.has(k)) getImage(k).catch(() => {});
      }
    },
    [draw, getImage]
  );

  // initial frame + kick off full background preload
  useEffect(() => {
    let cancelled = false;

    getImage(0).then((img) => {
      if (cancelled) return;
      draw(img);
      lastDrawn.current = 0;
      setReady(true);
    });

    let next = 0;
    let inFlight = 0;
    let loaded = 0;

    const pump = () => {
      if (cancelled) return;
      while (inFlight < PRELOAD_CONCURRENCY && next < FRAME_COUNT) {
        const i = next++;
        inFlight++;
        getImage(i)
          .catch(() => {})
          .finally(() => {
            inFlight--;
            loaded++;
            if (loaded % 15 === 0 || loaded === FRAME_COUNT) {
              if (!cancelled) setLoadedCount(loaded);
            }
            pump();
          });
      }
    };
    pump();

    return () => {
      cancelled = true;
    };
  }, [draw, getImage]);

  // scroll-driven frame scrubbing
  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      const frameIndex = Math.min(
        FRAME_COUNT - 1,
        Math.floor(p * FRAME_COUNT)
      );

      if (frameIndex !== lastDrawn.current) {
        showFrame(frameIndex);
      }

      const fade = Math.max(0, 1 - p / 0.12);
      if (heroTextRef.current) heroTextRef.current.style.opacity = String(fade);
      if (scrollCueRef.current)
        scrollCueRef.current.style.opacity = String(Math.max(0, 1 - p / 0.05));

      const activeProject = flagshipProjects.findIndex(
        ({ frameRange }) => frameIndex >= frameRange[0] && frameIndex <= frameRange[1]
      );
      if (activeProject !== activeIndexRef.current) {
        activeIndexRef.current = activeProject;
        setActiveIndex(activeProject);
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    const onResize = () => {
      const img = cache.current.get(lastDrawn.current);
      if (img) draw(img);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [showFrame, draw]);

  useEffect(() => {
    if (progressBarRef.current) {
      const pct = (loadedCount / FRAME_COUNT) * 100;
      progressBarRef.current.style.width = `${pct}%`;
      progressBarRef.current.style.opacity = pct >= 100 ? "0" : "1";
    }
  }, [loadedCount]);

  return (
    <section ref={sectionRef} className="relative h-[700vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-background">
        <canvas
          ref={canvasRef}
          aria-hidden
          className="h-full w-full"
          style={{ opacity: ready ? 1 : 0, transition: "opacity 0.4s ease" }}
        />

        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm tracking-widest text-muted uppercase">
              Loading
            </span>
          </div>
        )}

        <div
          ref={heroTextRef}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        >
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-6xl md:text-7xl">
            {profile.name}
          </h1>
          <p className="mt-4 text-base text-muted sm:text-lg md:text-xl">
            {profile.title}
          </p>
        </div>

        <div
          ref={scrollCueRef}
          className="pointer-events-none absolute inset-x-0 bottom-8 flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-muted">
            Scroll
          </span>
          <div className="h-8 w-px bg-border" />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-10 flex justify-center px-6 sm:justify-end sm:pr-10">
          {flagshipProjects.map((p, i) => (
            <div
              key={p.slug}
              className="absolute text-center transition-opacity duration-500 sm:text-right"
              style={{ opacity: i === activeIndex ? 1 : 0 }}
            >
              <div className="text-xs uppercase tracking-[0.2em] text-muted">
                Featured work
              </div>
              <div className="mt-1 text-lg font-medium text-foreground">
                {p.name}
              </div>
              <div className="text-sm text-muted">{p.tagline}</div>
            </div>
          ))}
        </div>

        <div className="absolute inset-x-0 top-0 h-0.5 bg-transparent">
          <div
            ref={progressBarRef}
            className="h-full bg-accent transition-[opacity,width] duration-300 ease-out"
            style={{ width: 0 }}
          />
        </div>
      </div>
    </section>
  );
}
