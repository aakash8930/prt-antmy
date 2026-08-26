"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "@/lib/data";

gsap.registerPlugin(SplitText, ScrollTrigger);

export default function Overview() {
  const sectionRef = useRef<HTMLElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const split = new SplitText(pRef.current, {
        type: "words",
        wordsClass: "overview-word",
      });

      gsap.set(split.words, { color: "#8b8983" });

      gsap.to(split.words, {
        color: "#f2f0ea",
        stagger: 0.04,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "bottom 65%",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="overview"
      ref={sectionRef}
      className="mx-auto max-w-5xl px-6 py-32 md:px-10"
    >
      <span className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-fg-muted)]">
        Overview
      </span>
      <p
        ref={pRef}
        className="mt-8 font-[family-name:var(--font-display)] text-3xl italic leading-snug sm:text-4xl md:text-5xl"
      >
        {site.description}
      </p>
    </section>
  );
}
