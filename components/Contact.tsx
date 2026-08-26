"use client";

import { useRef } from "react";
import { site } from "@/lib/data";
import Reveal from "./Reveal";

export default function Contact() {
  const wrapRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    wrapRef.current!.style.setProperty("--x", `${e.clientX - rect.left}px`);
    wrapRef.current!.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  return (
    <section
      id="contact"
      className="mx-auto max-w-6xl px-6 py-28 md:px-10"
    >
      <Reveal>
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-fg-muted)]">
          Contact
        </span>

        <div
          ref={wrapRef}
          onMouseMove={onMove}
          className="relative mt-6 max-w-3xl"
          style={{ "--x": "50%", "--y": "50%" } as React.CSSProperties}
        >
          <p className="font-[family-name:var(--font-display)] text-4xl italic leading-snug text-[var(--color-fg)]/35 sm:text-6xl">
            Have an idea worth driving? Let&apos;s take it for a spin.
          </p>
          <p
            aria-hidden
            className="pointer-events-none absolute inset-0 font-[family-name:var(--font-display)] text-4xl italic leading-snug sm:text-6xl"
            style={{
              backgroundImage:
                "radial-gradient(220px circle at var(--x) var(--y), var(--color-fg) 0%, transparent 70%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Have an idea worth driving? Let&apos;s take it for a spin.
          </p>
        </div>

        <a
          href={`mailto:${site.email}`}
          data-cursor="hover"
          className="mt-8 inline-block text-xl font-medium underline decoration-[var(--color-line)] underline-offset-8 transition-colors hover:decoration-[var(--color-accent)] sm:text-2xl"
        >
          {site.email}
        </a>
      </Reveal>

      <div className="mt-20 flex flex-col items-start justify-between gap-6 border-t border-[var(--color-line)] pt-8 sm:flex-row sm:items-center">
        <p className="max-w-md font-mono text-xs leading-relaxed text-[var(--color-fg-muted)]">
          {site.footer}
        </p>
        <p className="font-mono text-sm text-[var(--color-fg-muted)]">
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </section>
  );
}
