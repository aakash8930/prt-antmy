import { BAND_H, ENVELOPE_X, ENVELOPE_W, insetRect } from "../constants/geometry";
import { PlateLabel } from "../primitives/PlateLabel";

type Props = {
  top: number;
  rectRef?: (el: SVGRectElement | null) => void;
  insetRef?: (el: SVGRectElement | null) => void;
  contentRef?: (el: SVGGElement | null) => void;
  leaderRef?: (el: SVGLineElement | null) => void;
};

const CONTAINER_X = [340, 440, 540];

/** INFRA — runnable containers networked to a single cluster node. */
export function InfraPlateContent({ top, rectRef, insetRef, contentRef, leaderRef }: Props) {
  const midY = top + BAND_H / 2;
  const boxY = top + 18;
  const boxH = 28;
  const boxW = 70;
  const hexCx = 645;
  const hexCy = midY;
  const hexPoints = [
    [hexCx - 9, hexCy - 16],
    [hexCx + 9, hexCy - 16],
    [hexCx + 18, hexCy],
    [hexCx + 9, hexCy + 16],
    [hexCx - 9, hexCy + 16],
    [hexCx - 18, hexCy],
  ]
    .map((p) => p.join(","))
    .join(" ");
  const inset = insetRect(ENVELOPE_X, top, ENVELOPE_W, BAND_H);

  return (
    <>
      <rect
        ref={rectRef}
        x={ENVELOPE_X}
        y={top}
        width={ENVELOPE_W}
        height={BAND_H}
        className="bp-plate-rect"
      />
      <rect
        ref={insetRef}
        x={inset.x}
        y={inset.y}
        width={inset.width}
        height={inset.height}
        className="bp-plate-inset"
      />
      <g ref={contentRef} className="bp-plate-content">
        {CONTAINER_X.map((x) => (
          <g key={x}>
            <rect x={x} y={boxY} width={boxW} height={boxH} className="bp-mini-shape" />
            <line x1={x} y1={boxY + boxH / 2} x2={x + boxW} y2={boxY + boxH / 2} />
            <line
              x1={x + boxW}
              y1={boxY + boxH / 2}
              x2={hexCx - 18}
              y2={hexCy}
              className="bp-network-line"
            />
          </g>
        ))}

        <polygon points={hexPoints} className="bp-boundary" />

        <PlateLabel
          fromX={ENVELOPE_X + ENVELOPE_W}
          y={midY}
          label="INFRA"
          annotation="DEPLOYMENT — CONTAINERS — NETWORK"
          leaderRef={leaderRef}
        />
      </g>
    </>
  );
}
