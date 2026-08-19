import { BAND_H, ENVELOPE_X, ENVELOPE_W, insetRect } from "../constants/geometry";
import { PlateLabel } from "../primitives/PlateLabel";

type Props = {
  top: number;
  rectRef?: (el: SVGRectElement | null) => void;
  insetRef?: (el: SVGRectElement | null) => void;
  contentRef?: (el: SVGGElement | null) => void;
  leaderRef?: (el: SVGLineElement | null) => void;
};

/**
 * DATA — schema and persistence, drawn as two related record tables and a
 * dense-storage hatch swatch. Deliberately not a database-logo silhouette.
 */
export function DataPlateContent({ top, rectRef, insetRef, contentRef, leaderRef }: Props) {
  const midY = top + BAND_H / 2;
  const tableTop = top + 12;
  const rowH = 12;
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
        {/* table A */}
        <rect x={330} y={tableTop} width={90} height={36} className="bp-mini-shape" />
        <line x1={330} y1={tableTop + rowH} x2={420} y2={tableTop + rowH} />
        <line x1={330} y1={tableTop + rowH * 2} x2={420} y2={tableTop + rowH * 2} />
        <rect x={334} y={tableTop + 4} width={4} height={4} className="bp-key-tick" />

        {/* table B */}
        <rect x={470} y={tableTop} width={90} height={36} className="bp-mini-shape" />
        <line x1={470} y1={tableTop + rowH} x2={560} y2={tableTop + rowH} />
        <line x1={470} y1={tableTop + rowH * 2} x2={560} y2={tableTop + rowH * 2} />
        <rect x={474} y={tableTop + 4} width={4} height={4} className="bp-key-tick" />

        {/* relation between the two schemas */}
        <line x1={420} y1={tableTop + 18} x2={470} y2={tableTop + 18} className="bp-relation" />
        <rect
          x={417}
          y={tableTop + 15}
          width={6}
          height={6}
          transform={`rotate(45 420 ${tableTop + 18})`}
          className="bp-relation-marker"
        />
        <rect
          x={467}
          y={tableTop + 15}
          width={6}
          height={6}
          transform={`rotate(45 470 ${tableTop + 18})`}
          className="bp-relation-marker"
        />

        {/* dense-storage swatch */}
        <rect x={600} y={tableTop} width={50} height={36} className="bp-hatch-swatch" />

        <PlateLabel
          fromX={ENVELOPE_X + ENVELOPE_W}
          y={midY}
          label="DATA"
          annotation="FOUNDATION — DATA LAYER"
          leaderRef={leaderRef}
        />
      </g>
    </>
  );
}
