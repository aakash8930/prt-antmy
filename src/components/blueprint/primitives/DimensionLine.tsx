type DimensionLineProps = {
  x1: number;
  x2: number;
  y: number;
  label: string;
  side?: "above" | "below";
  /** The measurement run itself — a drawable target, revealed first. */
  lineRef?: (el: SVGLineElement | null) => void;
  /** End-ticks + numeral label, revealed once the line finishes drawing. */
  decorRef?: (el: SVGGElement | null) => void;
  className?: string;
};

/**
 * A real engineering dimension: the measurement line draws itself across
 * the span first, then the end-ticks and tabular-numeral label confirm the
 * reading — never all four parts popping in at once.
 */
export function DimensionLine({
  x1,
  x2,
  y,
  label,
  side = "below",
  lineRef,
  decorRef,
  className,
}: DimensionLineProps) {
  const tick = 5;
  const labelY = side === "below" ? y + 16 : y - 10;

  return (
    <g className={className}>
      <line ref={lineRef} x1={x1} y1={y} x2={x2} y2={y} />
      <g ref={decorRef} className="bp-dim-decor">
        <line x1={x1} y1={y - tick} x2={x1} y2={y + tick} />
        <line x1={x2} y1={y - tick} x2={x2} y2={y + tick} />
        <text x={(x1 + x2) / 2} y={labelY} textAnchor="middle">
          {label}
        </text>
      </g>
    </g>
  );
}
