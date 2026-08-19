import { BAND_H, ENVELOPE_X, ENVELOPE_W, insetRect } from "../constants/geometry";
import { ConnectorArrow } from "../primitives/ConnectorArrow";
import { PlateLabel } from "../primitives/PlateLabel";

type Props = {
  top: number;
  rectRef?: (el: SVGRectElement | null) => void;
  insetRef?: (el: SVGRectElement | null) => void;
  contentRef?: (el: SVGGElement | null) => void;
  leaderRef?: (el: SVGLineElement | null) => void;
};

const CHILD_X = [345, 470, 595];

/** FRONTEND — a route shell above a row of mounted components, tree-connected. */
export function FrontendPlateContent({ top, rectRef, insetRef, contentRef, leaderRef }: Props) {
  const midY = top + BAND_H / 2;
  const routeY = top + 10;
  const routeH = 10;
  const boxY = top + 30;
  const boxH = 20;
  const boxW = 80;
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
        <rect x={330} y={routeY} width={320} height={routeH} className="bp-boundary" />
        {[365, 490, 615].map((x) => (
          <rect key={x} x={x} y={routeY + 3} width={4} height={4} className="bp-route-tick" />
        ))}

        {/* shared state, threading the mounted components together */}
        <line x1={425} y1={boxY + boxH / 2} x2={470} y2={boxY + boxH / 2} className="bp-state-line" />
        <line x1={550} y1={boxY + boxH / 2} x2={595} y2={boxY + boxH / 2} className="bp-state-line" />

        {CHILD_X.map((x) => (
          <g key={x}>
            <ConnectorArrow
              x1={x + boxW / 2}
              y1={routeY + routeH}
              x2={x + boxW / 2}
              y2={boxY}
              withArrowhead={false}
            />
            <rect x={x} y={boxY} width={boxW} height={boxH} className="bp-mini-shape" />
          </g>
        ))}

        <PlateLabel
          fromX={ENVELOPE_X + ENVELOPE_W}
          y={midY}
          label="FRONTEND"
          annotation="COMPONENTS — ROUTES — STATE"
          leaderRef={leaderRef}
        />
      </g>
    </>
  );
}
