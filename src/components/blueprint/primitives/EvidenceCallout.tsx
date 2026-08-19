import { ConnectorArrow } from "./ConnectorArrow";
import type { Project } from "../data/projects";

type EvidenceCalloutProps = {
  anchorX: number;
  anchorY: number;
  detailLabel: string;
  project: Project;
  leaderRef?: (el: SVGPathElement | null) => void;
  markerRef?: (el: SVGGElement | null) => void;
  cardRef?: (el: SVGGElement | null) => void;
};

/**
 * The EVIDENCE-phase (50-60%) callout: a leader line off the originating
 * plate, a numbered "DETAIL" marker, and a small compact card carrying just
 * the project name + category — a pointer into the drawing, not a preview.
 * The leader + marker persist (unanimated by this component) into PROOF and
 * only retract at the 70% reconvergence cue; the compact card fades out as
 * PROOF's full column card takes over. See buildTimelines.ts.
 *
 * Anchored off the plate's LEFT edge (mirroring the plate's own name/
 * annotation leader, which lives on the right) — the right side is already
 * spoken for by that label plus the INSPECTION-phase tech annotation below
 * it, and the left margin (0..ENVELOPE_X) is otherwise empty.
 */
export function EvidenceCallout({
  anchorX,
  anchorY,
  detailLabel,
  project,
  leaderRef,
  markerRef,
  cardRef,
}: EvidenceCalloutProps) {
  const elbowX = anchorX - 40;
  const cardW = 190;
  const cardH = 34;
  const cardX = elbowX - cardW;
  const cardY = anchorY + 6;

  return (
    <>
      <ConnectorArrow
        nodeRef={leaderRef}
        x1={anchorX}
        y1={anchorY}
        x2={elbowX}
        y2={anchorY}
        withArrowhead={false}
        className="bp-evidence-leader"
      />
      <g ref={markerRef} className="bp-evidence-marker">
        <circle cx={anchorX} cy={anchorY} r={3} />
        <text x={elbowX - 8} y={anchorY - 8} textAnchor="end">{detailLabel}</text>
      </g>
      <g ref={cardRef} className="bp-evidence-compact">
        <rect x={cardX} y={cardY} width={cardW} height={cardH} className="bp-evidence-compact-border" />
        <text x={cardX + 8} y={cardY + 15} className="bp-evidence-compact-name">
          {project.name.toUpperCase()}
        </text>
        <text x={cardX + 8} y={cardY + 28} className="bp-evidence-compact-category">
          {project.category}
        </text>
      </g>
    </>
  );
}
