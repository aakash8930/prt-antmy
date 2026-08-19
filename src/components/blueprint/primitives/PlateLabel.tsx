type PlateLabelProps = {
  /** Right edge of the plate this label leads off of. */
  fromX: number;
  /** Vertical center of the plate. */
  y: number;
  label: string;
  annotation: string;
  /** The leader line itself — a drawable target, drawn toward the label. */
  leaderRef?: (el: SVGLineElement | null) => void;
  className?: string;
};

/**
 * The discipline name plus its redline annotation, connected to the plate
 * by a short leader line — a real drafting callout, not a floating caption.
 * The annotation is the one place pure text carries the reserved accent
 * color: it is, literally, a markup note on the drawing.
 */
export function PlateLabel({
  fromX,
  y,
  label,
  annotation,
  leaderRef,
  className,
}: PlateLabelProps) {
  const leaderEndX = fromX + 26;
  const textX = leaderEndX + 8;

  return (
    <g className={className}>
      <line ref={leaderRef} x1={fromX} y1={y} x2={leaderEndX} y2={y} className="bp-leader" />
      <circle cx={fromX} cy={y} r={2.5} className="bp-leader-dot" />
      <text x={textX} y={y - 6} className="bp-plate-label">
        {label}
      </text>
      <text x={textX} y={y + 12} className="bp-plate-annotation">
        {annotation}
      </text>
    </g>
  );
}
