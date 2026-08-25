"use client";

import { animate, stagger } from "animejs";
import { useEffect } from "react";
import FrameSequence from "@/components/FrameSequence";

const capabilities = [
  {
    number: "01",
    title: "Full-stack development",
    description: "Interfaces with intent, APIs with a point of view, and the architecture to keep both moving.",
    tags: "React / Next.js / TypeScript",
  },
  {
    number: "02",
    title: "Backend systems",
    description: "Reliable services for data, authentication, and the invisible details that make a product feel simple.",
    tags: "Node / PostgreSQL / Cloud",
  },
  {
    number: "03",
    title: "AI + intelligent systems",
    description: "Practical intelligence shaped into tools, automations, and experiences people can trust.",
    tags: "LLMs / Agents / Automation",
  },
];

function usePageMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const intro = animate(".hero-reveal", {
      opacity: [0, 1],
      translateY: [36, 0],
      delay: stagger(110),
      duration: 950,
      ease: "out(4)",
    });
    const orbit = animate(".hero-orbit", {
      rotate: 360,
      duration: 22000,
      loop: true,
      ease: "linear",
    });
    const pulse = animate(".hero-pulse", {
      scale: [0.88, 1.08],
      opacity: [0.25, 0.8],
      duration: 2800,
      alternate: true,
      loop: true,
      ease: "inOut(2)",
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animate(entry.target, {
            opacity: [0, 1],
            translateY: [28, 0],
            duration: 800,
            ease: "out(4)",
          });
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.18 },
    );
    document.querySelectorAll(".reveal-on-view").forEach((element) => observer.observe(element));

    return () => {
      intro.cancel();
      orbit.cancel();
      pulse.cancel();
      observer.disconnect();
    };
  }, []);
}

export default function PortfolioExperience() {
  usePageMotion();

  return (
    <main className="overflow-clip bg-ink text-white">
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-6 md:px-12 md:py-8">
        <a href="#top" className="group flex items-center gap-3" aria-label="Aakash Singh home">
          <span className="grid h-8 w-8 place-items-center border border-white/70 font-display text-xs font-bold text-lime transition duration-500 group-hover:rotate-45">
            AS
          </span>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-white/90">Aakash Singh</span>
        </a>
        <nav className="hidden items-center gap-9 font-mono text-[10px] uppercase tracking-[0.2em] text-white/55 md:flex">
          <a href="#motion" className="transition hover:text-lime">Motion</a>
          <a href="#capabilities" className="transition hover:text-lime">Capabilities</a>
          <a href="#contact" className="transition hover:text-lime">Contact</a>
        </nav>
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
          <span className="h-1.5 w-1.5 rounded-full bg-lime shadow-[0_0_14px_rgba(212,245,106,0.8)]" />
          Available
        </span>
      </header>

      <section id="top" className="hero-section relative flex min-h-screen items-end overflow-hidden px-6 pb-14 pt-36 md:px-12 md:pb-20">
        <div className="hero-field absolute inset-0" aria-hidden="true" />
        <div className="grid-overlay absolute inset-0" aria-hidden="true" />
        <div className="hero-noise absolute inset-0" aria-hidden="true" />

        <div className="relative z-10 w-full max-w-[1500px]">
          <div className="mb-16 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
            <p className="hero-reveal">Portfolio / 2026</p>
            <p className="hero-reveal hidden md:block">Panipat, India / 29°23&apos;N</p>
          </div>
          <div className="grid gap-12 lg:grid-cols-[1fr_0.46fr] lg:items-end">
            <div>
              <p className="hero-reveal eyebrow text-cyan/75">Full-stack developer / digital systems</p>
              <h1 className="hero-reveal mt-7 max-w-5xl font-display text-[clamp(4.3rem,11.2vw,11.5rem)] font-black uppercase leading-[0.76] tracking-[-0.095em] text-white">
                Build the
                <br />
                <span className="text-lime">unseen.</span>
              </h1>
            </div>
            <div className="hero-reveal max-w-xs lg:pb-2">
              <p className="text-sm leading-relaxed text-white/55 md:text-base">
                I turn ambitious ideas into clear, resilient products — from the first interface to the last service.
              </p>
              <a className="outline-button mt-8" href="#motion">
                <span>Enter the motion study</span>
                <span className="text-lg leading-none transition-transform duration-300 group-hover:translate-x-1">↘</span>
              </a>
            </div>
          </div>
          <div className="mt-20 flex flex-col justify-between gap-6 border-t border-white/15 pt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/35 md:flex-row">
            <span className="hero-reveal">01 / Systems that feel simple</span>
            <span className="hero-reveal">Scroll to explore ↓</span>
            <span className="hero-reveal">React · Node · AI</span>
          </div>
        </div>

        <div className="pointer-events-none absolute right-[8vw] top-[18vh] hidden h-[34vw] max-h-[500px] w-[34vw] max-w-[500px] place-items-center lg:grid" aria-hidden="true">
          <div className="hero-pulse absolute h-2/3 w-2/3 rounded-full bg-cyan/10 blur-3xl" />
          <div className="hero-orbit absolute h-full w-full rounded-full border border-cyan/20 border-dashed" />
          <div className="hero-orbit absolute h-3/4 w-3/4 rounded-full border border-violet/25" style={{ animationDirection: "reverse" }} />
          <div className="relative h-20 w-20 rounded-full border border-white/60 bg-white/10 shadow-halo backdrop-blur-sm">
            <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime shadow-[0_0_28px_8px_rgba(212,245,106,0.38)]" />
          </div>
        </div>
      </section>

      <section id="motion" className="relative">
        <FrameSequence />
      </section>

      <section id="capabilities" className="relative border-t hairline px-6 py-28 md:px-12 md:py-40">
        <div className="mx-auto grid max-w-[1500px] gap-20 lg:grid-cols-[0.75fr_1.25fr] lg:gap-28">
          <div className="reveal-on-view opacity-0">
            <p className="eyebrow text-cyan/70">Capabilities / 03</p>
            <h2 className="mt-8 max-w-xl font-display text-[clamp(3.4rem,7vw,7.4rem)] font-black uppercase leading-[0.78] tracking-[-0.085em]">
              Clear<br />
              <span className="text-lime">thinking.</span>
            </h2>
            <p className="mt-9 max-w-sm text-sm leading-relaxed text-white/50 md:text-base">
              Good technology disappears into the experience. The craft is in making the complex feel obvious.
            </p>
          </div>

          <div className="grid border-t hairline">
            {capabilities.map((capability) => (
              <article key={capability.number} className="reveal-on-view group grid gap-5 border-b hairline py-8 opacity-0 md:grid-cols-[54px_0.9fr_1fr] md:items-start md:gap-8 md:py-10">
                <span className="font-mono text-[11px] text-lime">{capability.number}</span>
                <div>
                  <h3 className="font-display text-2xl font-bold uppercase leading-none tracking-[-0.04em] transition group-hover:text-lime md:text-4xl">{capability.title}</h3>
                  <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.16em] text-cyan/55">{capability.tags}</p>
                </div>
                <p className="max-w-xs text-sm leading-relaxed text-white/45">{capability.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="relative overflow-hidden border-t hairline px-6 py-32 md:px-12 md:py-48">
        <div className="absolute -right-28 -top-28 h-[520px] w-[520px] rounded-full border border-cyan/15" aria-hidden="true" />
        <div className="absolute -right-4 top-0 h-[330px] w-[330px] rounded-full border border-lime/15" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-[1500px]">
          <p className="eyebrow text-lime/80">Next / 04 — Let&apos;s build</p>
          <h2 className="mt-9 max-w-5xl font-display text-[clamp(4rem,11vw,11rem)] font-black uppercase leading-[0.75] tracking-[-0.095em]">
            Make<br />
            <span className="text-cyan">something</span><br />
            matter.
          </h2>
          <div className="mt-12 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <p className="max-w-xs text-sm leading-relaxed text-white/45">Available for product work, ambitious builds, and systems worth making.</p>
            <a className="outline-button" href="mailto:hello@aakashsingh.dev">
              <span>Start a conversation</span>
              <span className="text-lg leading-none">↗</span>
            </a>
          </div>
        </div>
        <footer className="relative z-10 mx-auto mt-36 flex max-w-[1500px] flex-col gap-4 border-t hairline pt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-white/30 md:flex-row md:justify-between">
          <span>AS / Full-stack developer</span>
          <span>Crafting digital systems</span>
          <span>© {new Date().getFullYear()}</span>
        </footer>
      </section>
    </main>
  );
}
