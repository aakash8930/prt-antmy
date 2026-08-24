"use client";

import { animate, stagger } from "animejs";
import { useEffect } from "react";
import FrameSequence from "@/components/FrameSequence";

const capabilities = [
  {
    number: "01",
    title: "PERCEIVE",
    body: "Signals become context. The core maps the noise before it makes a move.",
    accent: "text-signal",
  },
  {
    number: "02",
    title: "REASON",
    body: "Distributed models converge in real time, turning possibility into direction.",
    accent: "text-acid",
  },
  {
    number: "03",
    title: "RESPOND",
    body: "Every output is a new input. Intelligence stays in motion after the decision.",
    accent: "text-signal",
  },
];

function useIntroAnimation() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const entrance = animate(".intro-reveal", {
      opacity: [0, 1],
      translateY: [28, 0],
      delay: stagger(100),
      duration: 850,
      ease: "out(4)",
    });
    const orbit = animate(".hero-orbit", {
      rotate: 360,
      duration: 18000,
      loop: true,
      ease: "linear",
    });
    const pulse = animate(".hero-pulse", {
      scale: [0.94, 1.06],
      opacity: [0.35, 0.8],
      duration: 2600,
      alternate: true,
      loop: true,
      ease: "inOut(2)",
    });

    return () => {
      entrance.cancel();
      orbit.cancel();
      pulse.cancel();
    };
  }, []);
}

export default function NexusExperience() {
  useIntroAnimation();

  return (
    <main className="overflow-clip bg-ink text-white">
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-6 mix-blend-difference md:px-12 md:py-8">
        <a href="#top" className="group flex items-center gap-3" aria-label="Nexus home">
          <span className="grid h-7 w-7 place-items-center border border-white/70 text-[9px] font-bold text-acid transition group-hover:rotate-45">
            N
          </span>
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.28em]">Nexus</span>
        </a>
        <nav className="hidden items-center gap-8 font-mono text-[10px] uppercase tracking-[0.2em] text-white/65 md:flex">
          <a className="transition hover:text-acid" href="#motion">
            Motion study
          </a>
          <a className="transition hover:text-acid" href="#system">
            The system
          </a>
          <a className="transition hover:text-acid" href="#contact">
            Connect
          </a>
        </nav>
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">
          <span className="h-1.5 w-1.5 rounded-full bg-acid shadow-[0_0_12px_#d9ff5f]" />
          Online
        </span>
      </header>

      <section id="top" className="hero-stage relative flex min-h-screen items-end overflow-hidden px-6 pb-14 pt-32 md:px-12 md:pb-20">
        <div className="hero-image absolute inset-0" aria-hidden="true" />
        <div className="hero-grid absolute inset-0" aria-hidden="true" />
        <div className="hero-glow absolute inset-0" aria-hidden="true" />

        <div className="relative z-10 max-w-5xl">
          <p className="intro-reveal eyebrow mb-7 text-signal/75">Artificial intelligence / motion study 01</p>
          <h1 className="intro-reveal max-w-5xl font-display text-[clamp(3.5rem,10vw,10rem)] font-black uppercase leading-[0.82] tracking-[-0.08em] text-white">
            Intelligence
            <br />
            <span className="text-acid">in motion.</span>
          </h1>
          <div className="mt-10 flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
            <p className="intro-reveal max-w-sm text-sm leading-relaxed text-white/60 md:text-base">
              A living interface for systems that learn, adapt, and move beyond the expected.
            </p>
            <a className="intro-reveal enter-button group" href="#motion">
              <span>Enter the core</span>
              <span className="enter-arrow transition-transform group-hover:translate-x-1">↗</span>
            </a>
          </div>
        </div>

        <div className="pointer-events-none absolute right-[7vw] top-[18vh] hidden h-[38vw] max-h-[580px] w-[38vw] max-w-[580px] place-items-center lg:grid" aria-hidden="true">
          <div className="hero-pulse absolute h-2/3 w-2/3 rounded-full bg-signal/10 blur-3xl" />
          <div className="hero-orbit absolute h-full w-full rounded-full border border-signal/25 border-dashed" />
          <div className="hero-orbit absolute h-3/4 w-3/4 rounded-full border border-acid/30" style={{ animationDirection: "reverse" }} />
          <div className="relative h-28 w-28 rounded-full border border-white/70 bg-white/10 shadow-glow backdrop-blur-sm">
            <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-acid shadow-[0_0_28px_8px_rgba(217,255,95,0.4)]" />
          </div>
        </div>

        <div className="absolute bottom-7 right-6 z-10 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35 md:right-12">
          Scroll / 00—01
        </div>
      </section>

      <section id="motion" className="relative">
        <div className="pointer-events-none absolute left-6 top-8 z-30 font-mono text-[10px] uppercase tracking-[0.22em] text-white/40 md:left-12 md:top-12">
          <span className="text-acid">02</span> / Motion study
        </div>
        <FrameSequence />
      </section>

      <section id="system" className="relative border-t border-white/10 px-6 py-24 md:px-12 md:py-36">
        <div className="mx-auto grid max-w-[1500px] gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-28">
          <div>
            <p className="eyebrow text-signal/75">The system / 03</p>
            <h2 className="mt-7 max-w-lg font-display text-[clamp(2.7rem,5.5vw,6rem)] font-black uppercase leading-[0.86] tracking-[-0.065em]">
              Think<br /><span className="text-acid">forward.</span>
            </h2>
            <p className="mt-8 max-w-sm text-sm leading-relaxed text-white/50 md:text-base">
              NEXUS is built for the distance between an idea and its impact. Three layers, one continuous loop.
            </p>
          </div>

          <div className="grid gap-0 border-t border-white/15">
            {capabilities.map((capability) => (
              <article key={capability.number} className="group grid gap-5 border-b border-white/15 py-7 md:grid-cols-[60px_0.7fr_1fr] md:items-start md:gap-8 md:py-9">
                <span className={`font-mono text-[11px] ${capability.accent}`}>{capability.number}</span>
                <h3 className="font-display text-2xl font-bold uppercase tracking-[-0.04em] transition group-hover:text-acid md:text-4xl">{capability.title}</h3>
                <p className="max-w-xs text-sm leading-relaxed text-white/45">{capability.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="relative overflow-hidden border-t border-white/10 px-6 py-28 md:px-12 md:py-44">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full border border-acid/15" aria-hidden="true" />
        <div className="absolute -right-12 -top-12 h-72 w-72 rounded-full border border-signal/20" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-[1500px]">
          <p className="eyebrow text-acid/80">Next / 04</p>
          <h2 className="mt-8 max-w-4xl font-display text-[clamp(3.5rem,9vw,9rem)] font-black uppercase leading-[0.8] tracking-[-0.08em]">
            Make<br />
            <span className="text-signal">something</span><br />
            move.
          </h2>
          <a href="mailto:hello@nexus.systems" className="enter-button mt-12">
            <span>Start a conversation</span>
            <span>↗</span>
          </a>
        </div>
        <footer className="relative z-10 mx-auto mt-32 flex max-w-[1500px] flex-col justify-between gap-4 border-t border-white/10 pt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35 md:flex-row">
          <span>Nexus / artificial intelligence</span>
          <span>Designed for the unknown</span>
          <span>© {new Date().getFullYear()}</span>
        </footer>
      </section>
    </main>
  );
}
