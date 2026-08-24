"use client";

import { animate, onScroll, type JSAnimation } from "animejs";
import { useCallback, useEffect, useRef, useState } from "react";

const FRAME_COUNT = 240;
const FRAME_DURATION = 8000;
const frameUrl = (index: number) => `/sequence/frame_${String(index).padStart(3, "0")}.svg`;

type SequenceState = { frame: number };

export default function FrameSequence() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameRef = useRef(0);
  const renderedFrameRef = useRef(-1);
  const playbackRef = useRef<JSAnimation | null>(null);
  const [loaded, setLoaded] = useState(0);
  const [failed, setFailed] = useState(0);
  const [ready, setReady] = useState(false);

  const drawFrame = useCallback((requestedFrame: number) => {
    const canvas = canvasRef.current;
    if (!canvas || canvas.clientWidth === 0 || canvas.clientHeight === 0) return false;

    let image = imagesRef.current[requestedFrame];
    if (!image || !image.complete || image.naturalWidth === 0) {
      for (let distance = 1; distance < FRAME_COUNT; distance += 1) {
        const before = imagesRef.current[requestedFrame - distance];
        const after = imagesRef.current[requestedFrame + distance];
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

    // Cover the viewport for an immersive stage. The generated composition keeps its
    // focal point centered, so cropping on narrow screens is intentional.
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
    let cancelled = false;
    let completeCount = 0;
    let successCount = 0;
    let errorCount = 0;
    const settledFrames = new Uint8Array(FRAME_COUNT);
    const images = new Array<HTMLImageElement>(FRAME_COUNT);

    const settle = (index: number, success: boolean) => {
      if (cancelled || settledFrames[index]) return;
      settledFrames[index] = 1;
      completeCount += 1;
      if (success) successCount += 1;
      else errorCount += 1;
      setLoaded(successCount);
      setFailed(errorCount);
      if (completeCount === FRAME_COUNT) setReady(true);
      if (success && index === frameRef.current) renderedFrameRef.current = -1;
    };

    for (let index = 0; index < FRAME_COUNT; index += 1) {
      const image = new Image();
      image.decoding = "async";
      image.onload = () => settle(index, true);
      image.onerror = () => settle(index, false);
      image.src = frameUrl(index);
      images[index] = image;
    }
    imagesRef.current = images;

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let drawFrameId: number | null = null;
    const scheduleDraw = () => {
      if (drawFrameId !== null) return;
      drawFrameId = requestAnimationFrame(() => {
        drawFrameId = null;
        if (renderedFrameRef.current !== frameRef.current && drawFrame(frameRef.current)) {
          renderedFrameRef.current = frameRef.current;
        }
      });
    };

    const sequenceState: SequenceState = { frame: 0 };
    const playback = animate(sequenceState, {
      frame: FRAME_COUNT - 1,
      duration: FRAME_DURATION,
      ease: "linear",
      autoplay: false,
    });
    playbackRef.current = playback;

    const scrollObserver = onScroll({
      target: stage,
      sync: 0.2,
      onUpdate: (observer) => {
        playback.seek(observer.progress * playback.duration);
        frameRef.current = Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(sequenceState.frame)));
        scheduleDraw();
      },
    });

    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(scheduleDraw) : null;
    resizeObserver?.observe(stage);
    scheduleDraw();

    return () => {
      scrollObserver.revert();
      playback.cancel();
      playbackRef.current = null;
      resizeObserver?.disconnect();
      if (drawFrameId !== null) cancelAnimationFrame(drawFrameId);
    };
  }, [drawFrame]);

  const progress = Math.round(((loaded + failed) / FRAME_COUNT) * 100);

  return (
    <div ref={stageRef} className="relative h-[500vh]" aria-label="AI core motion sequence">
      <div className="sticky top-0 h-screen overflow-hidden bg-ink">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/ai-core-style-frame.jpg)" }}
          aria-hidden="true"
        />
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
        <div className="stage-vignette absolute inset-0" aria-hidden="true" />

        {!ready ? (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-5 bg-ink/90" role="status" aria-live="polite">
            <p className="eyebrow text-signal/80">Loading motion system</p>
            <div className="h-px w-56 bg-white/15" aria-hidden="true">
              <div className="h-full bg-acid transition-[width] duration-150" style={{ width: `${progress}%` }} />
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/45">
              Frame cache {String(progress).padStart(2, "0")} percent
            </p>
          </div>
        ) : null}

        <div className="absolute bottom-7 left-7 z-20 font-mono text-[10px] uppercase tracking-[0.22em] text-white/45 md:left-12">
          <span className="text-acid">SYS 01</span> / Neural field
        </div>
        <div className="absolute bottom-7 right-7 z-20 font-mono text-[10px] uppercase tracking-[0.22em] text-white/45 md:right-12">
          {failed > 0 ? `${loaded}/${FRAME_COUNT} frames` : "30 FPS / 08 SEC"}
        </div>
      </div>
    </div>
  );
}
