import { useSyncExternalStore } from "react";

const BREAKPOINT_PX = 640;

// Never notifies — this intentionally only reads the viewport width once
// (during the client's first render, same "computed once per mount, a
// resize/orientation change won't re-scale an in-progress session" limit
// spreadScaleForWidth already accepts in BlueprintCenterpiece), not on every
// resize. BlueprintScene renders its SVG tree exactly once for performance,
// so reacting to later resizes here would mean re-rendering geometry a live
// animation timeline already holds direct node references into.
function subscribe(): () => void {
  return () => {};
}

function getSnapshot(): boolean {
  return window.innerWidth < BREAKPOINT_PX;
}

function getServerSnapshot(): boolean {
  return false;
}

/** SSR-safe: false (desktop floor-plan layout) on the server and until the
 * client's first render, matching usePrefersReducedMotion's convention. */
export function useIsMobileViewport(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
