import {
  BAND_H,
  BAND_TOP,
  BACKEND_BOTTOM_ABS,
  DATA_TOP_ABS,
  ENVELOPE_H,
  ENVELOPE_TOP_Y,
  ENVELOPE_W,
  ENVELOPE_X,
  MASS_OUTLINE,
  MOBILE_VIEW_BOX,
  FLOOR_PLAN_ZONES,
  FLOOR_PLAN_ZONES_MOBILE,
  PROJECT_COLUMN_GAP,
  PROJECT_COLUMN_TOP,
  PROJECT_COLUMN_X,
  SEAM_GAP_DATA,
  SEAM_Y,
  VIEW_H,
  VIEW_W,
  insetRect,
  type PlateId,
} from "./constants/geometry";
import { RegistrationMark } from "./primitives/RegistrationMark";
import { ConnectorArrow } from "./primitives/ConnectorArrow";
import { DimensionLine } from "./primitives/DimensionLine";
import { TechAnnotation } from "./primitives/TechAnnotation";
import { EvidenceCallout } from "./primitives/EvidenceCallout";
import { ProjectColumnCard, projectCardHeight } from "./primitives/ProjectColumnCard";
import { FloorPlanZone } from "./primitives/FloorPlanZone";
import { DataPlateContent } from "./plates/DataPlateContent";
import { BackendPlateContent } from "./plates/BackendPlateContent";
import { ApisPlateContent } from "./plates/ApisPlateContent";
import { FrontendPlateContent } from "./plates/FrontendPlateContent";
import { InfraPlateContent } from "./plates/InfraPlateContent";
import { TECH_STACK } from "./data/techStack";
import { PROJECTS } from "./data/projects";
import type { NodeId, RegisterNode } from "./animation/types";

type Props = {
  registerNode: RegisterNode;
  isMobileLayout: boolean;
  navActive: boolean;
  /** Mobile only — see BlueprintCenterpiece's MOBILE_WIDE_VIEWBOX_PERCENT. */
  mobileWideViewBox: boolean;
};

const ZONE_GROUP_ID: Record<string, NodeId> = {
  about: "zoneAboutGroup",
  architecture: "zoneArchitectureGroup",
  projects: "zoneProjectsGroup",
  experience: "zoneExperienceGroup",
  skills: "zoneSkillsGroup",
  contact: "zoneContactGroup",
};

const INSPECT_SCRIM_ID: Record<PlateId, NodeId> = {
  infra: "infraInspectScrim",
  frontend: "frontendInspectScrim",
  apis: "apisInspectScrim",
  backend: "backendInspectScrim",
  data: "dataInspectScrim",
};
const INSPECT_MARK_ID: Record<PlateId, NodeId> = {
  infra: "infraInspectMark",
  frontend: "frontendInspectMark",
  apis: "apisInspectMark",
  backend: "backendInspectMark",
  data: "dataInspectMark",
};
const TECH_ANNOTATION_ID: Record<PlateId, NodeId> = {
  infra: "infraTechAnnotation",
  frontend: "frontendTechAnnotation",
  apis: "apisTechAnnotation",
  backend: "backendTechAnnotation",
  data: "dataTechAnnotation",
};
const TECH_VALUE_ID: Record<PlateId, NodeId> = {
  infra: "infraTechValue",
  frontend: "frontendTechValue",
  apis: "apisTechValue",
  backend: "backendTechValue",
  data: "dataTechValue",
};

const EVIDENCE_LEADER_ID: NodeId[] = [
  "evidenceLeader1",
  "evidenceLeader2",
  "evidenceLeader3",
  "evidenceLeader4",
  "evidenceLeader5",
];
const EVIDENCE_MARKER_ID: NodeId[] = [
  "evidenceMarker1",
  "evidenceMarker2",
  "evidenceMarker3",
  "evidenceMarker4",
  "evidenceMarker5",
];
const EVIDENCE_COMPACT_ID: NodeId[] = [
  "evidenceCompactCard1",
  "evidenceCompactCard2",
  "evidenceCompactCard3",
  "evidenceCompactCard4",
  "evidenceCompactCard5",
];
const EVIDENCE_FULL_ID: NodeId[] = [
  "evidenceFullCard1",
  "evidenceFullCard2",
  "evidenceFullCard3",
  "evidenceFullCard4",
  "evidenceFullCard5",
];

/** Cap at 5 — see the note in data/projects.ts. */
const EVIDENCE_PROJECTS = PROJECTS.slice(0, 5);

/**
 * Column Y positions are cumulative, not evenly spaced — each card's real
 * description-wrap height (2-4 lines depending on the project) determines
 * how much room the next card needs, so no card's content can ever overflow
 * into the one below it.
 */
const PROJECT_COLUMN_LAYOUT = (() => {
  let cursorY = PROJECT_COLUMN_TOP;
  return EVIDENCE_PROJECTS.map((project) => {
    const y = cursorY;
    cursorY += projectCardHeight(project) + PROJECT_COLUMN_GAP;
    return y;
  });
})();

const CX = ENVELOPE_X + ENVELOPE_W / 2;
const CY = ENVELOPE_TOP_Y + ENVELOPE_H / 2;
const DIVIDER_X1 = ENVELOPE_X;
const DIVIDER_X2 = ENVELOPE_X + ENVELOPE_W;
const ENVELOPE_INSET = insetRect(ENVELOPE_X, ENVELOPE_TOP_Y, ENVELOPE_W, ENVELOPE_H);
const MASS_INSET = insetRect(
  MASS_OUTLINE.x,
  MASS_OUTLINE.y,
  MASS_OUTLINE.width,
  MASS_OUTLINE.height,
);

/**
 * The scrim/inspection-bracket/tech-annotation trio for one plate, plus its
 * evidence callout if a project points here — rendered as PLAIN children of
 * that plate's own wrapper `<g>` (no separate transform of their own) so
 * they inherit the wrapper's live animated position through ordinary SVG
 * parent/child composition. This is load-bearing, not cosmetic: stage 8
 * (RECONCILE) animates the wrapper back toward its original, unexploded
 * position, so anything positioned by a one-time-computed static transform
 * (as these used to be) would desync from the plate the moment it moves
 * again.
 */
function PlateOverlay({
  plateId,
  registerNode,
}: {
  plateId: PlateId;
  registerNode: RegisterNode;
}) {
  const top = BAND_TOP[plateId];
  const tech = TECH_STACK[plateId];
  const evidenceIndex = EVIDENCE_PROJECTS.findIndex((p) => p.architectureArea === plateId);
  const project = evidenceIndex >= 0 ? EVIDENCE_PROJECTS[evidenceIndex] : null;

  return (
    <>
      <rect
        ref={(el) => registerNode(INSPECT_SCRIM_ID[plateId], el)}
        x={ENVELOPE_X}
        y={top}
        width={ENVELOPE_W}
        height={BAND_H}
        className="bp-inspect-scrim"
      />
      <rect
        ref={(el) => registerNode(INSPECT_MARK_ID[plateId], el)}
        x={ENVELOPE_X - 6}
        y={top - 6}
        width={ENVELOPE_W + 12}
        height={BAND_H + 12}
        className="bp-inspect-mark"
      />
      <TechAnnotation
        x={ENVELOPE_X + ENVELOPE_W + 34}
        y={top + BAND_H / 2 + 26}
        heading={tech.heading}
        items={tech.items}
        groupRef={(el) => registerNode(TECH_ANNOTATION_ID[plateId], el)}
        valueRef={(el) => registerNode(TECH_VALUE_ID[plateId], el)}
      />
      {project && (
        <EvidenceCallout
          anchorX={ENVELOPE_X}
          anchorY={top + BAND_H / 2}
          detailLabel={`DETAIL ${String.fromCharCode(65 + evidenceIndex)}`}
          project={project}
          leaderRef={(el) => registerNode(EVIDENCE_LEADER_ID[evidenceIndex], el)}
          markerRef={(el) => registerNode(EVIDENCE_MARKER_ID[evidenceIndex], el)}
          cardRef={(el) => registerNode(EVIDENCE_COMPACT_ID[evidenceIndex], el)}
        />
      )}
    </>
  );
}

/**
 * The complete, static SVG geometry for the Blueprint centerpiece. Nothing
 * in this file animates itself — every element that moves is handed to
 * `registerNode` so an external, imperative driver (see animation/) can
 * seek it deterministically from scroll position. That split is what keeps
 * scrubbing cheap: React renders this tree exactly once.
 */
export function BlueprintScene({
  registerNode,
  isMobileLayout,
  navActive,
  mobileWideViewBox,
}: Props) {
  const zones = isMobileLayout ? FLOOR_PLAN_ZONES_MOBILE : FLOOR_PLAN_ZONES;
  const viewBox =
    isMobileLayout && !mobileWideViewBox
      ? `${MOBILE_VIEW_BOX.x} ${MOBILE_VIEW_BOX.y} ${MOBILE_VIEW_BOX.width} ${MOBILE_VIEW_BOX.height}`
      : `0 0 ${VIEW_W} ${VIEW_H}`;
  return (
    <svg
      viewBox={viewBox}
      className="bp-svg"
      role="img"
      aria-label="A technical drawing of a software system, progressively exploding into five labeled architecture plates — data, backend, APIs, frontend, and infrastructure — then inspecting each plate in turn and revealing the real projects built with it."
    >
      <defs>
        <marker
          id="bp-arrowhead"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" className="bp-arrowhead-fill" />
        </marker>
        <pattern
          id="bp-hatch"
          width="6"
          height="6"
          patternTransform="rotate(45)"
          patternUnits="userSpaceOnUse"
        >
          <line x1="0" y1="0" x2="0" y2="6" className="bp-hatch-line" />
        </pattern>
      </defs>

      {/* ---- everything stages 1-4 built, plus the stage 5-7 elements that
           are visually part of the drawing (inspection overlays, evidence
           markers). Wrapped in one group so stage 7 (PROOF) can shift/scale
           the whole assembly as a unit without touching any individual
           element's own animated properties. The wrap itself changes
           nothing about how stages 1-4 render. ---- */}
      <g ref={(el) => registerNode("blueprintRoot", el)} className="bp-blueprint-root">
      {/* ---- stage 1 : reference point, registration, construction, envelope ---- */}
      <g ref={(el) => registerNode("crosshair", el)} className="bp-crosshair">
        <RegistrationMark x={CX} y={CY} size={22} />
      </g>

      <g ref={(el) => registerNode("registrationGroup", el)} className="bp-registration">
        <RegistrationMark x={270} y={120} />
        <RegistrationMark x={730} y={120} />
        <RegistrationMark x={270} y={650} />
        <RegistrationMark x={730} y={650} />
      </g>

      <line
        ref={(el) => registerNode("constructionH", el)}
        x1={150}
        y1={CY}
        x2={850}
        y2={CY}
        className="bp-construction"
      />
      <line
        ref={(el) => registerNode("constructionV", el)}
        x1={CX}
        y1={80}
        x2={CX}
        y2={620}
        className="bp-construction"
      />

      <rect
        ref={(el) => registerNode("envelopeOutline", el)}
        x={ENVELOPE_X}
        y={ENVELOPE_TOP_Y}
        width={ENVELOPE_W}
        height={ENVELOPE_H}
        className="bp-envelope"
      />
      <rect
        ref={(el) => registerNode("envelopeInset", el)}
        x={ENVELOPE_INSET.x}
        y={ENVELOPE_INSET.y}
        width={ENVELOPE_INSET.width}
        height={ENVELOPE_INSET.height}
        className="bp-envelope-inset"
      />

      <DimensionLine
        x1={ENVELOPE_X}
        x2={ENVELOPE_X + ENVELOPE_W}
        y={130}
        side="above"
        label={`W ${ENVELOPE_W}`}
        className="bp-dim-style"
        lineRef={(el) => registerNode("outerDimWLine", el)}
        decorRef={(el) => registerNode("outerDimWDecor", el)}
      />

      <line
        ref={(el) => registerNode("outerDimHLine", el)}
        x1={258}
        y1={ENVELOPE_TOP_Y}
        x2={258}
        y2={ENVELOPE_TOP_Y + ENVELOPE_H}
        className="bp-dim-style"
      />
      <g ref={(el) => registerNode("outerDimHDecor", el)} className="bp-dim-decor bp-dim-style">
        <line x1={252} y1={ENVELOPE_TOP_Y} x2={264} y2={ENVELOPE_TOP_Y} />
        <line x1={252} y1={ENVELOPE_TOP_Y + ENVELOPE_H} x2={264} y2={ENVELOPE_TOP_Y + ENVELOPE_H} />
        <text
          x={238}
          y={CY}
          textAnchor="middle"
          transform={`rotate(-90 238 ${CY})`}
        >
          H {ENVELOPE_H}
        </text>
      </g>

      <g ref={(el) => registerNode("metadataGroup", el)} className="bp-metadata">
        <text x={330} y={664}>FIG. 01 — SYSTEM VOLUME</text>
        <text x={330} y={680}>SCALE 1:1 · PROJECTION ORTHOGRAPHIC</text>
      </g>

      {/* ---- stage 2 : internal structure (interfaceGroup only — see massWrapper
           below for divider1-4 and dependency1-2, which must share massWrapper's
           lift once stage 3 begins, so they're parented there directly rather
           than animated as independent top-level copies) ---- */}
      <g ref={(el) => registerNode("interfaceGroup", el)} className="bp-interfaces">
        {[SEAM_Y.infraFrontend, SEAM_Y.frontendApis, SEAM_Y.apisBackend, SEAM_Y.backendData].map((y) => (
          <circle key={y} cx={CX} cy={y} r={4} />
        ))}
      </g>

      <g ref={(el) => registerNode("dataWrapper", el)} className="bp-plate-wrapper">
        <DataPlateContent
          top={BAND_TOP.data}
          rectRef={(el) => registerNode("dataRect", el)}
          insetRef={(el) => registerNode("dataRectInset", el)}
          contentRef={(el) => registerNode("dataContent", el)}
          leaderRef={(el) => registerNode("dataLeader", el)}
        />
        <PlateOverlay plateId="data" registerNode={registerNode} />
      </g>

      <g className="bp-data-dim-group">
        <DimensionLine
          x1={ENVELOPE_X}
          x2={ENVELOPE_X + ENVELOPE_W}
          y={(BACKEND_BOTTOM_ABS + DATA_TOP_ABS) / 2}
          label={`SEAM 01 · GAP ${Math.round(SEAM_GAP_DATA)}`}
          className="bp-dim-style bp-dim-flagged"
          lineRef={(el) => registerNode("dataDimensionLine", el)}
          decorRef={(el) => registerNode("dataDimDecor", el)}
        />
      </g>

      {/* ---- stage 3 & 4 : the merged mass. Everything that visually belongs to
           "infra+frontend+apis+backend before/while it lifts" — the internal
           dividers, the dependency arrows, the mass's own outline, and the
           redline cut where it parted from DATA — is nested inside massWrapper
           so it inherits massWrapper's translateY through ordinary SVG parent/
           child transform composition. That's the single source of truth: one
           transform, applied once, structurally inherited, rather than a value
           independently duplicated onto each element. ---- */}
      <g ref={(el) => registerNode("massWrapper", el)}>
        <line ref={(el) => registerNode("divider1", el)} x1={DIVIDER_X1} y1={SEAM_Y.infraFrontend} x2={DIVIDER_X2} y2={SEAM_Y.infraFrontend} className="bp-divider" />
        <line ref={(el) => registerNode("divider2", el)} x1={DIVIDER_X1} y1={SEAM_Y.frontendApis} x2={DIVIDER_X2} y2={SEAM_Y.frontendApis} className="bp-divider" />
        <line ref={(el) => registerNode("divider3", el)} x1={DIVIDER_X1} y1={SEAM_Y.apisBackend} x2={DIVIDER_X2} y2={SEAM_Y.apisBackend} className="bp-divider" />
        <line ref={(el) => registerNode("divider4", el)} x1={DIVIDER_X1} y1={SEAM_Y.backendData} x2={DIVIDER_X2} y2={SEAM_Y.backendData} className="bp-divider" />

        <ConnectorArrow
          nodeRef={(el) => registerNode("dependency1", el)}
          x1={540}
          y1={SEAM_Y.frontendApis}
          x2={540}
          y2={SEAM_Y.apisBackend}
          className="bp-dependency"
        />
        <ConnectorArrow
          nodeRef={(el) => registerNode("dependency2", el)}
          x1={460}
          y1={SEAM_Y.apisBackend}
          x2={460}
          y2={SEAM_Y.backendData}
          className="bp-dependency"
        />

        <rect
          ref={(el) => registerNode("massOutline", el)}
          x={MASS_OUTLINE.x}
          y={MASS_OUTLINE.y}
          width={MASS_OUTLINE.width}
          height={MASS_OUTLINE.height}
          className="bp-envelope"
        />
        <rect
          ref={(el) => registerNode("massOutlineInset", el)}
          x={MASS_INSET.x}
          y={MASS_INSET.y}
          width={MASS_INSET.width}
          height={MASS_INSET.height}
          className="bp-envelope-inset"
        />

        <line
          ref={(el) => registerNode("seamCut4", el)}
          x1={DIVIDER_X1}
          y1={SEAM_Y.backendData}
          x2={DIVIDER_X2}
          y2={SEAM_Y.backendData}
          className="bp-seam-cut"
        />

        <line
          ref={(el) => registerNode("seamCut1", el)}
          x1={DIVIDER_X1}
          y1={SEAM_Y.infraFrontend}
          x2={DIVIDER_X2}
          y2={SEAM_Y.infraFrontend}
          className="bp-seam-cut"
        />
        <line
          ref={(el) => registerNode("seamCut2", el)}
          x1={DIVIDER_X1}
          y1={SEAM_Y.frontendApis}
          x2={DIVIDER_X2}
          y2={SEAM_Y.frontendApis}
          className="bp-seam-cut"
        />
        <line
          ref={(el) => registerNode("seamCut3", el)}
          x1={DIVIDER_X1}
          y1={SEAM_Y.apisBackend}
          x2={DIVIDER_X2}
          y2={SEAM_Y.apisBackend}
          className="bp-seam-cut"
        />

        <g ref={(el) => registerNode("plateInfraWrapper", el)} className="bp-plate-wrapper">
          <InfraPlateContent
            top={BAND_TOP.infra}
            rectRef={(el) => registerNode("plateInfraRect", el)}
            insetRef={(el) => registerNode("plateInfraRectInset", el)}
            contentRef={(el) => registerNode("plateInfraContent", el)}
            leaderRef={(el) => registerNode("plateInfraLeader", el)}
          />
          <PlateOverlay plateId="infra" registerNode={registerNode} />
        </g>
        <g ref={(el) => registerNode("plateFrontendWrapper", el)} className="bp-plate-wrapper">
          <FrontendPlateContent
            top={BAND_TOP.frontend}
            rectRef={(el) => registerNode("plateFrontendRect", el)}
            insetRef={(el) => registerNode("plateFrontendRectInset", el)}
            contentRef={(el) => registerNode("plateFrontendContent", el)}
            leaderRef={(el) => registerNode("plateFrontendLeader", el)}
          />
          <PlateOverlay plateId="frontend" registerNode={registerNode} />
        </g>
        <g ref={(el) => registerNode("plateApisWrapper", el)} className="bp-plate-wrapper">
          <ApisPlateContent
            top={BAND_TOP.apis}
            rectRef={(el) => registerNode("plateApisRect", el)}
            insetRef={(el) => registerNode("plateApisRectInset", el)}
            contentRef={(el) => registerNode("plateApisContent", el)}
            leaderRef={(el) => registerNode("plateApisLeader", el)}
          />
          <PlateOverlay plateId="apis" registerNode={registerNode} />
        </g>
        <g ref={(el) => registerNode("plateBackendWrapper", el)} className="bp-plate-wrapper">
          <BackendPlateContent
            top={BAND_TOP.backend}
            rectRef={(el) => registerNode("plateBackendRect", el)}
            insetRef={(el) => registerNode("plateBackendRectInset", el)}
            contentRef={(el) => registerNode("plateBackendContent", el)}
            leaderRef={(el) => registerNode("plateBackendLeader", el)}
          />
          <PlateOverlay plateId="backend" registerNode={registerNode} />
        </g>
      </g>
      </g>

      {/* ---- stage 7 : PROOF (60-70%), the readable half. Fixed in the
           report column — deliberately NOT inside blueprintRoot, so it
           stays full-size and legible while the drawing shrinks to make
           room for it. ---- */}
      {EVIDENCE_PROJECTS.map((project, i) => (
        <ProjectColumnCard
          key={project.id}
          x={PROJECT_COLUMN_X}
          y={PROJECT_COLUMN_LAYOUT[i]}
          project={project}
          groupRef={(el) => registerNode(EVIDENCE_FULL_ID[i], el)}
        />
      ))}

      {/* ---- stage 10 : FLOOR PLAN (90-100%). The site's navigation, drawn
           as six rooms on a technical plan. A top-level sibling of
           blueprintRoot (not a child) so it's unaffected by blueprintRoot's
           own fade-away as the elevated view flattens. Always real <a>
           links regardless of animated state — see FloorPlanZone. ---- */}
      <g ref={(el) => registerNode("floorPlanGroup", el)} className="bp-floorplan">
        {zones.map((zone) => (
          <FloorPlanZone
            key={zone.id}
            zone={zone}
            navActive={navActive}
            showRect={zone.originPlate === null}
            groupRef={(el) => registerNode(ZONE_GROUP_ID[zone.id], el)}
          />
        ))}
      </g>
    </svg>
  );
}
