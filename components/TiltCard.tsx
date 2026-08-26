"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || window.matchMedia("(pointer: coarse)").matches) return;

    const rotateX = gsap.quickTo(el, "rotateX", {
      duration: 0.5,
      ease: "power3.out",
    });
    const rotateY = gsap.quickTo(el, "rotateY", {
      duration: 0.5,
      ease: "power3.out",
    });

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      rotateY(px * 10);
      rotateX(py * -10);
    };

    const onLeave = () => {
      rotateX(0);
      rotateY(0);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className={`h-full ${className ?? ""}`} style={{ perspective: 800 }}>
      <div
        ref={innerRef}
        className="h-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        {children}
      </div>
    </div>
  );
}
