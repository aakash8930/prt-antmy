type ConnectorArrowProps = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  /** Bend the connector through an intermediate elbow point instead of a straight run. */
  elbow?: "horizontal-first" | "vertical-first";
  withArrowhead?: boolean;
  nodeRef?: (el: SVGPathElement | null) => void;
  className?: string;
};

/**
 * A single technical connector — used for dependency arrows between
 * disciplines and for in/out request lines crossing an API boundary.
 * Always a <path> (never <line>) so it has a stable `d` for anime.js's
 * SVG `draw` helper regardless of whether it bends.
 */
export function ConnectorArrow({
  x1,
  y1,
  x2,
  y2,
  elbow,
  withArrowhead = true,
  nodeRef,
  className,
}: ConnectorArrowProps) {
  let d = `M ${x1} ${y1} L ${x2} ${y2}`;
  if (elbow === "horizontal-first") {
    d = `M ${x1} ${y1} L ${x2} ${y1} L ${x2} ${y2}`;
  } else if (elbow === "vertical-first") {
    d = `M ${x1} ${y1} L ${x1} ${y2} L ${x2} ${y2}`;
  }

  return (
    <path
      ref={nodeRef}
      d={d}
      className={className}
      fill="none"
      markerEnd={withArrowhead ? "url(#bp-arrowhead)" : undefined}
    />
  );
}
