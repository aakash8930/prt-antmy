"use client";

import { useEffect, useRef, useState } from "react";
import { createTimeline } from "animejs";
import { getLenis } from "@/lib/smooth-scroll";
import { site } from "@/lib/data";

export default function Preloader() {
  const [done, setDone] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const stopRaf = requestAnimationFrame(() => getLenis()?.stop());

    const counter = { value: 0 };
    const tl = createTimeline({
      onComplete: () => {
        window.dispatchEvent(new Event("site:ready"));
        getLenis()?.start();
        setDone(true);
      },
    });

    tl.add(nameRef.current!, {
      opacity: [0, 1],
      scale: [1.04, 1],
      duration: 800,
      ease: "outQuad",
    })
      .add(
        counter,
        {
          value: 100,
          duration: 1400,
          ease: "inOutQuad",
          onUpdate: () => {
            if (barRef.current) barRef.current.style.width = `${counter.value}%`;
            if (countRef.current)
              countRef.current.textContent = String(Math.round(counter.value)).padStart(
                3,
                "0"
              );
          },
        },
        "-=200"
      )
      .add(
        wrapRef.current!,
        { opacity: 0, duration: 500, ease: "outQuad" },
        "+=150"
      );

    return () => {
      cancelAnimationFrame(stopRaf);
      tl.pause();
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={wrapRef}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-6 bg-[var(--color-bg)]"
    >
      <div
        ref={nameRef}
        className="font-[family-name:var(--font-display)] text-4xl italic text-[var(--color-fg)] opacity-0 sm:text-5xl"
      >
        {site.name}
      </div>

      <div className="flex items-center gap-3 font-mono text-xs text-[var(--color-fg-muted)]">
        <div className="h-px w-32 overflow-hidden bg-[var(--color-line)] sm:w-48">
          <div ref={barRef} className="h-full w-0 bg-[var(--color-accent)]" />
        </div>
        <span ref={countRef}>000</span>
      </div>
    </div>
  );
}
