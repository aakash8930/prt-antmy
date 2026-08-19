type TechAnnotationProps = {
  x: number;
  y: number;
  heading: string;
  items: string[];
  groupRef?: (el: SVGGElement | null) => void;
  /** The technology/value line specifically — animated separately from the
   * rest of the group so stage 8 (RECONCILE) can fade it to nothing while
   * the heading above it only folds to a quiet trace. See
   * addRefinementStage in buildTimelines.ts. */
  valueRef?: (el: SVGTextElement | null) => void;
};

/**
 * A small engineering-annotation block — a heading and a rule-bounded value
 * line, e.g.:
 *   ────────────
 *   RUNTIME
 *   Node.js · NestJS
 *   ────────────
 * Deliberately not a pill/badge row: this is markup on the drawing, not a
 * skills section.
 */
export function TechAnnotation({ x, y, heading, items, groupRef, valueRef }: TechAnnotationProps) {
  const width = 132;
  return (
    <g ref={groupRef} className="bp-tech-annotation">
      <line x1={x} y1={y} x2={x + width} y2={y} />
      <text x={x} y={y + 14}>{heading}</text>
      <text ref={valueRef} x={x} y={y + 28}>{items.join(" · ")}</text>
      <line x1={x} y1={y + 36} x2={x + width} y2={y + 36} />
    </g>
  );
}
