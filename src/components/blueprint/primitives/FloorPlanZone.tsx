import type { FloorPlanZone } from "../constants/geometry";

type FloorPlanZoneProps = {
  zone: FloorPlanZone;
  navActive: boolean;
  groupRef?: (el: SVGGElement | null) => void;
  /** False for the five zones with an architectural origin — their room
   * border IS that plate's own rect, physically arrived at these exact
   * bounds (see buildTimelines.ts's addFloorPlanTransformStage), so a
   * second rect drawn on top would be a redundant duplicate. True for
   * CONTACT, which has no plate to supply one. */
  showRect?: boolean;
};

/**
 * One room on the closing floor plan (stage 10, 90-100%) — a real link,
 * styled as a zone on a technical drawing rather than a nav-bar button.
 * Always a genuine `<a href>` in the DOM (not conditionally rendered), so
 * it's reachable by keyboard/screen reader and under prefers-reduced-motion
 * regardless of the SVG's current animated opacity/scale — the animation is
 * never required to discover it, only to arrive at it with ceremony.
 *
 * `navActive` (true only in the closing ~4% of scroll — see
 * BlueprintCenterpiece's NAV_ACTIVE_PERCENT) is a plain CSS-class swap so
 * the "this is actually clickable" affordance itself doesn't need to be
 * modeled as another animation-timeline property.
 */
export function FloorPlanZone({ zone, navActive, groupRef, showRect = true }: FloorPlanZoneProps) {
  const cx = zone.x + zone.w / 2;
  const cy = zone.y + zone.h / 2;

  return (
    <a href={zone.href} className="bp-zone-link" aria-label={`Go to ${zone.label}`}>
      <g ref={groupRef} className={navActive ? "bp-zone bp-zone-active" : "bp-zone"}>
        {showRect && (
          <rect x={zone.x} y={zone.y} width={zone.w} height={zone.h} className="bp-zone-rect" />
        )}
        <line x1={zone.x + 10} y1={zone.y + 10} x2={zone.x + 22} y2={zone.y + 10} className="bp-zone-tick" />
        <line x1={zone.x + 10} y1={zone.y + 10} x2={zone.x + 10} y2={zone.y + 22} className="bp-zone-tick" />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" className="bp-zone-label">
          {zone.label}
        </text>
      </g>
    </a>
  );
}
