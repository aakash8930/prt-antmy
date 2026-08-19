import { BAND_H, ENVELOPE_X, ENVELOPE_W, insetRect } from "../constants/geometry";
import { ConnectorArrow } from "../primitives/ConnectorArrow";
import { TickRow } from "../primitives/TickRow";
import { PlateLabel } from "../primitives/PlateLabel";

type Props = {
  top: number;
  rectRef?: (el: SVGRectElement | null) => void;
  insetRef?: (el: SVGRectElement | null) => void;
  contentRef?: (el: SVGGElement | null) => void;
  leaderRef?: (el: SVGLineElement | null) => void;
};

/** APIS — the contract boundary: endpoints along its edge, requests crossing it. */
export function ApisPlateContent({ top, rectRef, insetRef, contentRef, leaderRef }: Props) {
  const midY = top + BAND_H / 2;
  const boundaryTop = top + 14;
  const boundaryH = 36;
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
        <rect
          x={320}
          y={boundaryTop}
          width={360}
          height={boundaryH}
          className="bp-boundary"
        />
        <TickRow x1={340} x2={660} y={boundaryTop} count={7} length={5} direction="up" />
        <TickRow
          x1={340}
          x2={660}
          y={boundaryTop + boundaryH}
          count={7}
          length={5}
          direction="down"
        />

        <ConnectorArrow x1={302} y1={midY} x2={342} y2={midY} />
        <ConnectorArrow x1={658} y1={midY} x2={698} y2={midY} />

        <PlateLabel
          fromX={ENVELOPE_X + ENVELOPE_W}
          y={midY}
          label="APIS"
          annotation="CONTRACTS — ENDPOINTS"
          leaderRef={leaderRef}
        />
      </g>
    </>
  );
}
