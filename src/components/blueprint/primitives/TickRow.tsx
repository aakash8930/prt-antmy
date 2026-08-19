type TickRowProps = {
  x1: number;
  x2: number;
  y: number;
  count: number;
  length?: number;
  /** Which side of the baseline the ticks point toward. */
  direction?: "up" | "down";
  className?: string;
};

/**
 * A row of evenly spaced perpendicular tick marks along a horizontal
 * baseline — used for API endpoint markers and dimension-line ticks.
 * Purely decorative geometry, so it renders as one static <g> and is
 * never an individual animation target; its parent group's opacity
 * carries the reveal.
 */
export function TickRow({
  x1,
  x2,
  y,
  count,
  length = 6,
  direction = "down",
  className,
}: TickRowProps) {
  const sign = direction === "down" ? 1 : -1;
  const step = count > 1 ? (x2 - x1) / (count - 1) : 0;

  return (
    <g className={className}>
      {Array.from({ length: count }, (_, i) => {
        const x = x1 + step * i;
        return (
          <line key={i} x1={x} y1={y} x2={x} y2={y + length * sign} />
        );
      })}
    </g>
  );
}
