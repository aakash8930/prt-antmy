/**
 * Every element the animation driver ever touches has exactly one entry
 * here, and exactly one stage timeline is ever allowed to own a given
 * property on a given node (see buildTimelines.ts). That rule is what
 * keeps the whole thing scrub-safe: two timelines never fight over the
 * same value on the same frame.
 */
export type NodeId =
  | "crosshair"
  | "registrationGroup"
  | "constructionH"
  | "constructionV"
  | "envelopeOutline"
  | "envelopeInset"
  | "outerDimWLine"
  | "outerDimWDecor"
  | "outerDimHLine"
  | "outerDimHDecor"
  | "metadataGroup"
  | "divider1"
  | "divider2"
  | "divider3"
  | "divider4"
  | "interfaceGroup"
  | "dependency1"
  | "dependency2"
  | "massOutline"
  | "massOutlineInset"
  | "massWrapper"
  | "dataWrapper"
  | "dataRect"
  | "dataRectInset"
  | "dataContent"
  | "dataLeader"
  | "dataDimDecor"
  | "dataDimensionLine"
  | "seamCut1"
  | "seamCut2"
  | "seamCut3"
  | "seamCut4"
  | "plateInfraWrapper"
  | "plateInfraRect"
  | "plateInfraRectInset"
  | "plateInfraContent"
  | "plateInfraLeader"
  | "plateFrontendWrapper"
  | "plateFrontendRect"
  | "plateFrontendRectInset"
  | "plateFrontendContent"
  | "plateFrontendLeader"
  | "plateApisWrapper"
  | "plateApisRect"
  | "plateApisRectInset"
  | "plateApisContent"
  | "plateApisLeader"
  | "plateBackendWrapper"
  | "plateBackendRect"
  | "plateBackendRectInset"
  | "plateBackendContent"
  | "plateBackendLeader"
  // ---- stage 5 (INSPECTION, 40-50%) — one scrim/mark/annotation per plate,
  // pre-positioned at that plate's resting transform (see
  // geometry.plateRestingTransform) rather than nested inside its animated
  // wrapper, so none of the existing stage 3/4 elements are touched. ----
  | "blueprintRoot"
  | "infraInspectScrim"
  | "infraInspectMark"
  | "infraTechAnnotation"
  | "infraTechValue"
  | "frontendInspectScrim"
  | "frontendInspectMark"
  | "frontendTechAnnotation"
  | "frontendTechValue"
  | "apisInspectScrim"
  | "apisInspectMark"
  | "apisTechAnnotation"
  | "apisTechValue"
  | "backendInspectScrim"
  | "backendInspectMark"
  | "backendTechAnnotation"
  | "backendTechValue"
  | "dataInspectScrim"
  | "dataInspectMark"
  | "dataTechAnnotation"
  | "dataTechValue"
  // ---- stages 6-7 (EVIDENCE 50-60%, PROOF 60-70%) — up to 5 project
  // evidence slots. Each slot's leader/marker/compact-card lives inside
  // blueprintRoot (anchored to its architecture plate); its full-card lives
  // in the fixed, unscaled project column. Unused slots (PROJECTS.length <
  // 5) are simply never registered or animated. ----
  | "evidenceLeader1"
  | "evidenceMarker1"
  | "evidenceCompactCard1"
  | "evidenceFullCard1"
  | "evidenceLeader2"
  | "evidenceMarker2"
  | "evidenceCompactCard2"
  | "evidenceFullCard2"
  | "evidenceLeader3"
  | "evidenceMarker3"
  | "evidenceCompactCard3"
  | "evidenceFullCard3"
  | "evidenceLeader4"
  | "evidenceMarker4"
  | "evidenceCompactCard4"
  | "evidenceFullCard4"
  | "evidenceLeader5"
  | "evidenceMarker5"
  | "evidenceCompactCard5"
  | "evidenceFullCard5"
  // ---- stage 10 (FLOOR PLAN, 90-100%) — the site's navigation, drawn as
  // six rooms on a technical plan. A top-level group (siblings of
  // blueprintRoot, not children of it) so it's unaffected by
  // blueprintRoot's own fade-away. ----
  | "floorPlanGroup"
  | "zoneAboutGroup"
  | "zoneArchitectureGroup"
  | "zoneProjectsGroup"
  | "zoneExperienceGroup"
  | "zoneSkillsGroup"
  | "zoneContactGroup";

export type NodeRegistry = Partial<Record<NodeId, SVGElement | null>>;

export type RegisterNode = (id: NodeId, el: SVGElement | null) => void;
