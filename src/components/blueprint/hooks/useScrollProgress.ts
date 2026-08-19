import { useEffect, useRef, type RefObject } from "react";

function clamp01(n: number): number {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

type Options = {
  containerRef: RefObject<HTMLElement | null>;
  onProgress: (progress: number) => void;
  enabled?: boolean;
};

/**
 * Converts the scroll position of a tall spacer element into a 0-1
 * progress value, rAF-throttled and delivered through a callback rather
 * than React state — driving an SVG scene from state re-renders would mean
 * re-rendering (part of) the whole tree on every scroll pixel. This hook
 * never calls preventDefault or sets scroll position itself: the browser's
 * native scroll physics are always in full control.
 */
export function useScrollProgress({ containerRef, onProgress, enabled = true }: Options) {
  const rafId = useRef<number | null>(null);
  const onProgressRef = useRef(onProgress);

  useEffect(() => {
    onProgressRef.current = onProgress;
  });

  useEffect(() => {
    if (!enabled) return;
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      rafId.current = null;
      const rect = container.getBoundingClientRect();
      const scrollableDistance = rect.height - window.innerHeight;
      const progress =
        scrollableDistance <= 0 ? 0 : clamp01(-rect.top / scrollableDistance);
      onProgressRef.current(progress);
    };

    const schedule = () => {
      if (rafId.current !== null) return;
      rafId.current = requestAnimationFrame(measure);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      // Reset the guard, not just cancel the frame: React Strict Mode runs
      // this effect's mount -> cleanup -> mount in one tick during dev, and
      // without resetting to null here the second mount's schedule() would
      // see a stale non-null id and believe a frame is already pending,
      // permanently skipping every future rAF.
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };
  }, [containerRef, enabled]);
}
