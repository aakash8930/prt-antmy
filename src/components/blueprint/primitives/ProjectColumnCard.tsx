import { PROJECT_CARD_W } from "../constants/geometry";
import { ARCHITECTURE_LABEL, type Project } from "../data/projects";

type ProjectColumnCardProps = {
  x: number;
  y: number;
  project: Project;
  groupRef?: (el: SVGGElement | null) => void;
};

const DESC_MAX_CHARS = 37;
const DESC_START_OFFSET = 100; // from card top to first description line's baseline
const DESC_LINE_H = 12;

export function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * Card height depends on how many lines the description wraps to (real
 * project descriptions run 2-4 lines at DESC_MAX_CHARS) — computed here so
 * BlueprintScene can lay out the column without any card's tech line
 * overflowing its own border.
 */
export function projectCardHeight(project: Project): number {
  const lines = wrapText(project.description, DESC_MAX_CHARS).length;
  const dividerOffset = DESC_START_OFFSET + lines * DESC_LINE_H + 4;
  const techOffset = dividerOffset + 16;
  return techOffset + 14; // bottom padding below the tech line
}

/**
 * PROOF-phase (60-70%) readable project preview, fixed in the right-hand
 * report column (unaffected by blueprintRoot's scale-down). Reads top to
 * bottom: number/system, name, architecture connection, category,
 * description, technologies — the "technical report attached to the
 * drawing" the brief asks for.
 */
export function ProjectColumnCard({ x, y, project, groupRef }: ProjectColumnCardProps) {
  const descLines = wrapText(project.description, DESC_MAX_CHARS);
  const descStartY = y + DESC_START_OFFSET;
  const dividerY = descStartY + descLines.length * DESC_LINE_H + 4;
  const height = projectCardHeight(project);

  return (
    <g ref={groupRef} className="bp-project-card">
      <rect x={x} y={y} width={PROJECT_CARD_W} height={height} className="bp-project-card-border" />
      <text x={x + 14} y={y + 22} className="bp-project-number">{project.number} / SYSTEM</text>
      <text x={x + 14} y={y + 42} className="bp-project-name">{project.name}</text>
      <line x1={x + 14} y1={y + 54} x2={x + PROJECT_CARD_W - 14} y2={y + 54} className="bp-project-rule" />
      <text x={x + 14} y={y + 70} className="bp-project-arch">
        {ARCHITECTURE_LABEL[project.architectureArea]} ARCHITECTURE
      </text>
      <text x={x + 14} y={y + 84} className="bp-project-category">{project.category}</text>
      {descLines.map((line, i) => (
        <text key={i} x={x + 14} y={descStartY + i * DESC_LINE_H} className="bp-project-desc">
          {line}
        </text>
      ))}
      <line x1={x + 14} y1={dividerY} x2={x + PROJECT_CARD_W - 14} y2={dividerY} className="bp-project-rule" />
      <text x={x + 14} y={dividerY + 16} className="bp-project-tech">
        {project.technologies.join(" · ")}
      </text>
    </g>
  );
}
