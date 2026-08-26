"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { site, navLinks } from "@/lib/data";
import Magnetic from "./Magnetic";
import { getLenis } from "@/lib/smooth-scroll";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<HTMLAnchorElement[]>([]);

  const goTo = (id: string) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(el, { offset: -20, duration: 1.4 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    if (open) {
      gsap.set(overlay, { display: "flex" });
      gsap
        .timeline()
        .fromTo(
          overlay,
          { clipPath: "circle(2% at 100% 0%)" },
          { clipPath: "circle(150% at 100% 0%)", duration: 0.9, ease: "power4.inOut" }
        )
        .fromTo(
          linkRefs.current,
          { yPercent: 120, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.07, ease: "power3.out" },
          "-=0.45"
        );
    } else if (overlay.style.display === "flex") {
      gsap
        .timeline({ onComplete: () => gsap.set(overlay, { display: "none" }) })
        .to(overlay, {
          clipPath: "circle(2% at 100% 0%)",
          duration: 0.6,
          ease: "power3.inOut",
        });
    }
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[110] flex items-center justify-between px-6 py-6 md:px-10">
        <button
          onClick={() => goTo("top")}
          data-cursor="hover"
          className="font-[family-name:var(--font-display)] text-lg italic"
        >
          {site.name}
        </button>

        <Magnetic>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="relative z-[110] flex h-14 w-14 items-center justify-center rounded-full border border-[var(--color-line)]"
          >
            <span className="relative flex h-3.5 w-5 flex-col justify-between">
              <span
                className={`h-px w-full bg-[var(--color-fg)] transition-transform duration-300 ${
                  open ? "translate-y-[6.5px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-px w-full bg-[var(--color-fg)] transition-opacity duration-200 ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`h-px w-full bg-[var(--color-fg)] transition-transform duration-300 ${
                  open ? "-translate-y-[6.5px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </Magnetic>
      </header>

      <div
        ref={overlayRef}
        className="fixed inset-0 z-[100] hidden flex-col items-center justify-center gap-4 bg-[var(--color-bg)]"
        style={{ clipPath: "circle(2% at 100% 0%)" }}
      >
        {navLinks.map((link, i) => (
          <div key={link.href} className="overflow-hidden">
            <a
              ref={(el) => {
                if (el) linkRefs.current[i] = el;
              }}
              href={`#${link.href}`}
              data-cursor="hover"
              onClick={(e) => {
                e.preventDefault();
                goTo(link.href);
              }}
              className="block font-[family-name:var(--font-display)] text-6xl italic text-[var(--color-fg)] transition-colors hover:text-[var(--color-accent)] sm:text-8xl"
            >
              {link.label}
            </a>
          </div>
        ))}
      </div>
    </>
  );
}
