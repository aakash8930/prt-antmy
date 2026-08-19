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

/** BACKEND — services and business logic, one of them a worker with a queue. */
export function BackendPlateContent({ top, rectRef, insetRef, contentRef, leaderRef }: Props) {
  const midY = top + BAND_H / 2;
  const boxTop = top + 16;
  const boxH = 32;
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
        <rect x={330} y={boxTop} width={70} height={boxH} className="bp-mini-shape" />
        <rect x={460} y={boxTop} width={70} height={boxH} className="bp-mini-shape" />
        <rect x={590} y={boxTop} width={60} height={boxH} className="bp-mini-shape" />

        {/* worker queue ticks inside the third service */}
        <line x1={600} y1={boxTop + 8} x2={640} y2={boxTop + 8} className="bp-queue-tick" />
        <line x1={600} y1={boxTop + 16} x2={640} y2={boxTop + 16} className="bp-queue-tick" />
        <line x1={600} y1={boxTop + 24} x2={640} y2={boxTop + 24} className="bp-queue-tick" />

        <ConnectorArrow x1={400} y1={midY} x2={460} y2={midY} />
        <ConnectorArrow x1={530} y1={midY} x2={590} y2={midY} />

        <PlateLabel
          fromX={ENVELOPE_X + ENVELOPE_W}
          y={midY}
          label="BACKEND"
          annotation="SERVICES — BUSINESS LOGIC"
          leaderRef={leaderRef}
        />
      </g>
    </>
  );
}
