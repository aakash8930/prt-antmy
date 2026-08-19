import { ConnectorArrow } from "./ConnectorArrow";
import type { Project } from "../data/projects";

type MobileEvidenceCalloutProps = {
  anchorX: number;
  anchorY: number;
  detailLabel: string;
  project: Project;
  leaderRef?: (el: SVGPathElement | null) => void;
  markerRef?: (el: SVGGElement | null) => void;
  cardRef?: (el: SVGGElement | null) => void;
};

/**
 * Mobile's EVIDENCE-phase (50-60%) callout — the same leader + numbered
 * marker + compact card lifecycle EvidenceCallout drives (identical
 * opacity/draw NodeIds, see buildTimelines.ts's addEvidenceProofStage,
 * which is geometry-agnostic and untouched by this component), but
 * anchored off the plate's BOTTOM edge instead of its left edge: the
 * callout visibly emerges FROM the active plate and resolves BELOW it,
 * matching the vertical stack mobile keeps for INSPECTION rather than
 * reaching sideways into the desktop right-column composition.
 */
export function MobileEvidenceCallout({
  anchorX,
  anchorY,
  detailLabel,
  project,
  leaderRef,
  markerRef,
  cardRef,
}: MobileEvidenceCalloutProps) {
  const elbowY = anchorY + 34;
  const cardW = 280;
  const cardH = 44;
  const cardX = anchorX - cardW / 2;
  const cardY = elbowY + 14;
  const midY = (anchorY + elbowY) / 2;

  return (
    <>
      <ConnectorArrow
        nodeRef={leaderRef}
        x1={anchorX}
        y1={anchorY}
        x2={anchorX}
        y2={elbowY}
        withArrowhead={false}
        className="bp-evidence-leader"
      />
      <g ref={markerRef} className="bp-evidence-marker">
        <circle cx={anchorX} cy={anchorY} r={3.5} />
        <text x={anchorX + 8} y={midY + 3} textAnchor="start">
          {detailLabel}
        </text>
      </g>
      <g ref={cardRef} className="bp-evidence-compact bp-evidence-compact-mobile">
        <rect x={cardX} y={cardY} width={cardW} height={cardH} className="bp-evidence-compact-border" />
        <text x={anchorX} y={cardY + 19} textAnchor="middle" className="bp-evidence-compact-name-mobile">
          {project.name.toUpperCase()}
        </text>
        <text x={anchorX} y={cardY + 35} textAnchor="middle" className="bp-evidence-compact-category-mobile">
          {project.category}
        </text>
      </g>
    </>
  );
}
