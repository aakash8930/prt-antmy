"use client";

import { useEffect, useRef, useState } from "react";
import { site, chapters } from "@/lib/data";

// Scroll-story hero. No video frames: a 700vh track whose progress drives the
// chapter crossfades, the intro fade, and a scroll-progress bar. The animated
// background (components/Background.tsx) renders behind this fixed layer.

const CHAPTER_COUNT = chapters.length;

export default function SequenceHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const chapterWrapRef = useRef<HTMLDivElement>(null);

  const activeIndexRef = useRef<number>(-1);
  const [activeIndex, setActiveIndex] = useState(-1);

  // scroll progress → chapter index + overlay fades
  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;

      // intro title + scroll cue fade in the first stretch
      const fade = Math.max(0, 1 - p / 0.12);
      if (heroTextRef.current) heroTextRef.current.style.opacity = String(fade);
      if (scrollCueRef.current)
        scrollCueRef.current.style.opacity = String(Math.max(0, 1 - p / 0.05));

      // fade the whole chapter overlay out for the final stretch so the
      // animated background becomes the page background below
      if (chapterWrapRef.current) {
        const endFade = Math.max(0, 1 - (p - 0.92) / 0.08);
        chapterWrapRef.current.style.opacity = String(endFade);
      }

      // progress bar (chapter progress through the sequence)
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${p * 100}%`;
      }

      const active = chapters.findIndex(
        ({ frameRange }) => p >= frameRange[0] / 600 && p < (frameRange[1] + 1) / 600
      );
      if (active !== activeIndexRef.current) {
        activeIndexRef.current = active;
        setActiveIndex(active);
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section id="top" ref={sectionRef} className="relative h-[700vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* vignette scrim so chapters stay legible over the background */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-transparent to-[var(--color-bg)]/30" />

        {/* intro title */}
        <div
          ref={heroTextRef}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        >
          <h1 className="font-[family-name:var(--font-display)] text-6xl italic text-[var(--color-fg)] sm:text-8xl md:text-9xl">
            {site.name}
          </h1>
          <p className="mt-5 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] sm:text-sm">
            {site.tagline}
          </p>
        </div>

        {/* chapter content — each sits in its own 100vh scroll window and
            crossfades as you scrub through the sequence */}
        <div ref={chapterWrapRef} className="absolute inset-0">
          {chapters.map((chapter, i) => {
            const start = chapter.frameRange[0] / 600;
            const end = (chapter.frameRange[1] + 1) / 600;
            return (
              <div
                key={chapter.slug}
                className="absolute inset-x-0 top-0 h-screen"
                style={{ height: `${(end - start) * 100}%` }}
              >
                <div
                  className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 pt-24 sm:pt-28"
                  style={{
                    opacity:
                      activeIndex === i ? "var(--cs-active-opacity, 1)" : 0,
                    transition:
                      activeIndex === i
                        ? "opacity 0.5s ease"
                        : "opacity 0.4s ease",
                  }}
                >
                  <div className="max-w-xl text-center">
                    <div className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-fg-muted)]">
                      {chapter.kicker}
                    </div>
                    <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl italic leading-tight text-[var(--color-fg)] sm:text-5xl md:text-6xl">
                      {chapter.title}
                    </h2>
                    <p className="mt-5 text-[var(--color-fg-muted)]">
                      {chapter.body}
                    </p>
                    <p className="mt-4 font-[family-name:var(--font-display)] text-lg italic text-[var(--color-fg)]/70">
                      {chapter.quote}
                    </p>
                    <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-line)] sm:grid-cols-3">
                      {chapter.stats.map((stat) => (
                        <div
                          key={stat.label}
                          className="flex flex-col gap-1 bg-[var(--color-bg)]/70 px-4 py-4 backdrop-blur-sm"
                        >
                          <span className="font-[family-name:var(--font-display)] text-2xl italic text-[var(--color-fg)]">
                            {stat.value}
                          </span>
                          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
                            {stat.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div
          ref={scrollCueRef}
          className="pointer-events-none absolute inset-x-0 bottom-8 flex flex-col items-center gap-2"
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
            Scroll
          </span>
          <div className="h-8 w-px bg-[var(--color-line)]" />
        </div>

        {/* chapter index, bottom-left */}
        <div className="pointer-events-none absolute bottom-8 left-6 hidden flex-col gap-1.5 sm:flex md:left-10">
          {chapters.map((chapter, i) => (
            <div
              key={chapter.slug}
              className="flex items-center gap-3"
              style={{ opacity: i === activeIndex ? 1 : 0.35 }}
            >
              <span
                className={`font-mono text-xs transition-colors ${
                  i === activeIndex ? "text-[var(--color-accent)]" : ""
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-fg)]">
                {chapter.label}
              </span>
            </div>
          ))}
        </div>

        {/* scroll progress bar */}
        <div className="absolute inset-x-0 top-0 h-0.5 bg-transparent">
          <div
            ref={progressBarRef}
            className="h-full bg-[var(--color-accent)] transition-[opacity,width] duration-300 ease-out"
            style={{ width: 0 }}
          />
        </div>
      </div>
    </section>
  );
}
