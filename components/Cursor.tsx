"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const dotVisualRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const ringVisualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const dotVisual = dotVisualRef.current;
    const ringVisual = ringVisualRef.current;
    if (!dot || !ring || !dotVisual || !ringVisual) return;

    const ringPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let target = { x: ringPos.x, y: ringPos.y };
    let raf: number;

    // Position lives on the outer wrapper's transform (written every
    // frame). Scale pulses animate the inner "-visual" element instead —
    // keeping them off the same `transform` property is what keeps this a
    // clean circle instead of snapping/skewing mid-animation.
    const loop = () => {
      ringPos.x += (target.x - ringPos.x) * 0.18;
      ringPos.y += (target.y - ringPos.y) * 0.18;
      ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onMove = (e: PointerEvent) => {
      target = { x: e.clientX, y: e.clientY };
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    };

    const onOver = (e: Event) => {
      const el = (e.target as HTMLElement)?.closest?.(
        'a, button, [data-cursor="hover"]'
      );
      if (el) animate(ringVisual, { scale: 2.2, duration: 350, ease: "outExpo" });
    };

    const onOut = (e: Event) => {
      const el = (e.target as HTMLElement)?.closest?.(
        'a, button, [data-cursor="hover"]'
      );
      if (el) animate(ringVisual, { scale: 1, duration: 350, ease: "outExpo" });
    };

    const onDown = () =>
      animate(dotVisual, { scale: 0.5, duration: 200, ease: "outQuad" });
    const onUp = () =>
      animate(dotVisual, { scale: 1, duration: 200, ease: "outQuad" });

    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot">
        <div ref={dotVisualRef} className="cursor-dot-visual" />
      </div>
      <div ref={ringRef} className="cursor-ring">
        <div ref={ringVisualRef} className="cursor-ring-visual" />
      </div>
    </>
  );
}
