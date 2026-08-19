type RegistrationMarkProps = {
  x: number;
  y: number;
  size?: number;
  className?: string;
};

/** A small corner crosshair, the drafting-sheet convention for "this is a plotted page." */
export function RegistrationMark({
  x,
  y,
  size = 14,
  className,
}: RegistrationMarkProps) {
  const r = size / 2;
  return (
    <g className={className}>
      <line x1={x - r} y1={y} x2={x + r} y2={y} />
      <line x1={x} y1={y - r} x2={x} y2={y + r} />
    </g>
  );
}
