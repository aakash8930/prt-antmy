import { MOBILE_PROOF_CARD_W } from "../constants/geometry";
import { ARCHITECTURE_LABEL, type Project } from "../data/projects";
import { wrapText } from "./ProjectColumnCard";

type MobileProjectCardProps = {
  /** Left edge — same convention as ProjectColumnCard's `x`. */
  x: number;
  y: number;
  project: Project;
  groupRef?: (el: SVGGElement | null) => void;
};

const DESC_MAX_CHARS = 46;
const DESC_START_OFFSET = 98;
const DESC_LINE_H = 17;

/**
 * Card height depends on how many lines the description wraps to — computed
 * here so BlueprintScene can lay out the mobile vertical sequence without
 * any card's tech line overflowing its own border. Never a fixed height:
 * see ProjectColumnCard.projectCardHeight, the desktop equivalent this
 * mirrors.
 */
export function mobileProjectCardHeight(project: Project): number {
  const lines = wrapText(project.description, DESC_MAX_CHARS).length;
  const dividerOffset = DESC_START_OFFSET + lines * DESC_LINE_H + 6;
  const techOffset = dividerOffset + 22;
  return techOffset + 18;
}

/**
 * PROOF-phase (60-70%) mobile project card — a mobile-specific layout, not
 * a shrunk ProjectColumnCard: bigger type sized for the tighter mobile
 * focus viewBox's zoom level, one project per row in a vertical sequence
 * below the architecture rather than a fixed side column. Priority order
 * top to bottom: name, category, description, architecture connection,
 * technologies — matching the brief's "secondary metadata can disappear"
 * (the desktop card's leading "NN / SYSTEM" index line is dropped here).
 */
export function MobileProjectCard({ x, y, project, groupRef }: MobileProjectCardProps) {
  const descLines = wrapText(project.description, DESC_MAX_CHARS);
  const descStartY = y + DESC_START_OFFSET;
  const dividerY = descStartY + descLines.length * DESC_LINE_H + 6;
  const height = mobileProjectCardHeight(project);

  return (
    <g ref={groupRef} className="bp-project-card bp-project-card-mobile">
      <rect x={x} y={y} width={MOBILE_PROOF_CARD_W} height={height} className="bp-project-card-border" />
      <text x={x + 18} y={y + 32} className="bp-project-name-mobile">{project.name}</text>
      <text x={x + 18} y={y + 52} className="bp-project-category-mobile">{project.category}</text>
      <line x1={x + 18} y1={y + 64} x2={x + MOBILE_PROOF_CARD_W - 18} y2={y + 64} className="bp-project-rule" />
      {descLines.map((line, i) => (
        <text key={i} x={x + 18} y={descStartY + i * DESC_LINE_H} className="bp-project-desc-mobile">
          {line}
        </text>
      ))}
      <line x1={x + 18} y1={dividerY} x2={x + MOBILE_PROOF_CARD_W - 18} y2={dividerY} className="bp-project-rule" />
      <text x={x + 18} y={dividerY + 19} className="bp-project-arch-mobile">
        {ARCHITECTURE_LABEL[project.architectureArea]} ARCHITECTURE
      </text>
      <text x={x + 18} y={dividerY + 36} className="bp-project-tech-mobile">
        {project.technologies.join(" · ")}
      </text>
    </g>
  );
}
