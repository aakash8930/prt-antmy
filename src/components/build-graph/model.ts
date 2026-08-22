export type BuildGraphState =
  | "current"
  | "system-thinking"
  | "multi-surface"
  | "engineering-loop";

export type BuildGraphNodeType =
  | "idea"
  | "interface"
  | "api"
  | "service"
  | "data"
  | "external"
  | "decision"
  | "evidence"
  | "outcome";

export type GraphNodeId =
  | "interface"
  | "api"
  | "core"
  | "data"
  | "payment"
  | "location"
  | "customer"
  | "admin"
  | "partner"
  | "rider"
  | "problem"
  | "research"
  | "sources"
  | "decision"
  | "implement"
  | "test"
  | "working"
  | "accept"
  | "revise"
  | "reject"
  | "research-again";

export type GraphNode = {
  id: GraphNodeId;
  label: string;
  detail?: string;
  type: BuildGraphNodeType;
  x: number;
  y: number;
  width?: number;
  emphasis?: "primary" | "external" | "branch" | "resolved";
};

export type GraphEdge = {
  id: string;
  from: GraphNodeId;
  to: GraphNodeId;
  kind?: "primary" | "branch" | "feedback";
};

export type GraphEvent = {
  id: string;
  from: GraphNodeId;
  to: GraphNodeId;
  delay?: number;
};

export type BuildGraphDefinition = {
  state: BuildGraphState;
  index: string;
  name: string;
  shortName: string;
  thesis: string;
  description: string;
  annotation: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  events: GraphEvent[];
};

export type GraphViewport = "desktop" | "mobile";

type StateResolver = (viewport: GraphViewport) => BuildGraphDefinition;

const node = (
  id: GraphNodeId,
  label: string,
  type: BuildGraphNodeType,
  x: number,
  y: number,
  options: Pick<GraphNode, "detail" | "width" | "emphasis"> = {},
): GraphNode => ({ id, label, type, x, y, ...options });

const current: StateResolver = (viewport) => {
  const mobile = viewport === "mobile";
  const x = mobile ? 195 : 600;
  const ys = mobile ? [150, 350, 550, 750] : [110, 270, 430, 590];
  return {
    state: "current",
    index: "00",
    name: "Current system",
    shortName: "Current",
    thesis: "Simple connected software",
    description:
      "An interface crosses an API boundary, reaches service logic, and persists state in data.",
    annotation: "CURRENT CAPABILITY / CONNECTED PATH",
    nodes: [
      node("interface", "Interface", "interface", x, ys[0], { detail: "web · mobile" }),
      node("api", "API", "api", x, ys[1], { detail: "contract" }),
      node("core", "Service", "service", x, ys[2], { detail: "logic", emphasis: "primary" }),
      node("data", "Data", "data", x, ys[3], { detail: "state" }),
    ],
    edges: [
      { id: "current-interface-api", from: "interface", to: "api", kind: "primary" },
      { id: "current-api-core", from: "api", to: "core", kind: "primary" },
      { id: "current-core-data", from: "core", to: "data", kind: "primary" },
    ],
    events: [{ id: "request", from: "interface", to: "data" }],
  };
};

const systemThinking: StateResolver = (viewport) => {
  if (viewport === "mobile") {
    return {
      state: "system-thinking",
      index: "01",
      name: "First system thinking",
      shortName: "System",
      thesis: "A product gains connected responsibilities",
      description:
        "The primary application path grows into a backend that must coordinate payment, location, and stored data.",
      annotation: "APPLICATION → CONNECTED SYSTEM",
      nodes: [
        node("interface", "Interface", "interface", 195, 100),
        node("api", "API", "api", 195, 245),
        node("core", "Backend", "service", 195, 390, { emphasis: "primary" }),
        node("payment", "Payment", "external", 95, 555, { emphasis: "external" }),
        node("location", "Location", "external", 295, 555, { emphasis: "external" }),
        node("data", "Data", "data", 195, 735),
      ],
      edges: [
        { id: "system-interface-api", from: "interface", to: "api", kind: "primary" },
        { id: "system-api-core", from: "api", to: "core", kind: "primary" },
        { id: "system-core-payment", from: "core", to: "payment", kind: "branch" },
        { id: "system-core-location", from: "core", to: "location", kind: "branch" },
        { id: "system-core-data", from: "core", to: "data", kind: "primary" },
      ],
      events: [
        { id: "system-request", from: "interface", to: "core" },
        { id: "system-data", from: "core", to: "data", delay: 0.8 },
      ],
    };
  }

  return {
    state: "system-thinking",
    index: "01",
    name: "First system thinking",
    shortName: "System",
    thesis: "A product gains connected responsibilities",
    description:
      "The primary application path grows into a backend that must coordinate payment, location, and stored data.",
    annotation: "APPLICATION → CONNECTED SYSTEM",
    nodes: [
      node("interface", "Interface", "interface", 210, 350),
      node("api", "API", "api", 430, 350),
      node("core", "Backend", "service", 650, 350, { emphasis: "primary", width: 150 }),
      node("payment", "Payment", "external", 930, 160, { emphasis: "external" }),
      node("location", "Location", "external", 930, 350, { emphasis: "external" }),
      node("data", "Data", "data", 930, 540),
    ],
    edges: [
      { id: "system-interface-api", from: "interface", to: "api", kind: "primary" },
      { id: "system-api-core", from: "api", to: "core", kind: "primary" },
      { id: "system-core-payment", from: "core", to: "payment", kind: "branch" },
      { id: "system-core-location", from: "core", to: "location", kind: "branch" },
      { id: "system-core-data", from: "core", to: "data", kind: "primary" },
    ],
    events: [
      { id: "system-request", from: "interface", to: "core" },
      { id: "system-data", from: "core", to: "data", delay: 0.8 },
    ],
  };
};

const multiSurface: StateResolver = (viewport) => {
  if (viewport === "mobile") {
    return {
      state: "multi-surface",
      index: "02",
      name: "Multiple surfaces",
      shortName: "Surfaces",
      thesis: "Four experiences depend on one shared system",
      description:
        "Customer, admin, partner, and rider remain distinct surfaces while converging on one shared backend and data layer.",
      annotation: "FOUR SURFACES / ONE SYSTEM",
      nodes: [
        node("customer", "Customer", "interface", 100, 105),
        node("admin", "Admin", "interface", 290, 105),
        node("partner", "Partner", "interface", 100, 270),
        node("rider", "Rider", "interface", 290, 270),
        node("core", "Shared backend", "service", 195, 505, {
          emphasis: "primary",
          width: 190,
        }),
        node("data", "Data", "data", 195, 735),
      ],
      edges: [
        { id: "surface-customer-core", from: "customer", to: "core", kind: "branch" },
        { id: "surface-admin-core", from: "admin", to: "core", kind: "branch" },
        { id: "surface-partner-core", from: "partner", to: "core", kind: "branch" },
        { id: "surface-rider-core", from: "rider", to: "core", kind: "branch" },
        { id: "surface-core-data", from: "core", to: "data", kind: "primary" },
      ],
      events: [
        { id: "customer-event", from: "customer", to: "core" },
        { id: "admin-event", from: "admin", to: "core", delay: 0.45 },
        { id: "partner-event", from: "partner", to: "core", delay: 0.9 },
        { id: "rider-event", from: "rider", to: "core", delay: 1.35 },
      ],
    };
  }

  return {
    state: "multi-surface",
    index: "02",
    name: "Multiple surfaces",
    shortName: "Surfaces",
    thesis: "Four experiences depend on one shared system",
    description:
      "Customer, admin, partner, and rider remain distinct surfaces while converging on one shared backend and data layer.",
    annotation: "FOUR SURFACES / ONE SYSTEM",
    nodes: [
      node("customer", "Customer", "interface", 170, 115),
      node("admin", "Admin", "interface", 170, 270),
      node("partner", "Partner", "interface", 170, 425),
      node("rider", "Rider", "interface", 170, 580),
      node("core", "Shared backend", "service", 650, 350, {
        emphasis: "primary",
        width: 190,
      }),
      node("data", "Data", "data", 1020, 350),
    ],
    edges: [
      { id: "surface-customer-core", from: "customer", to: "core", kind: "branch" },
      { id: "surface-admin-core", from: "admin", to: "core", kind: "branch" },
      { id: "surface-partner-core", from: "partner", to: "core", kind: "branch" },
      { id: "surface-rider-core", from: "rider", to: "core", kind: "branch" },
      { id: "surface-core-data", from: "core", to: "data", kind: "primary" },
    ],
    events: [
      { id: "customer-event", from: "customer", to: "core" },
      { id: "admin-event", from: "admin", to: "core", delay: 0.45 },
      { id: "partner-event", from: "partner", to: "core", delay: 0.9 },
      { id: "rider-event", from: "rider", to: "core", delay: 1.35 },
    ],
  };
};

const engineeringLoop: StateResolver = (viewport) => {
  if (viewport === "mobile") {
    return {
      state: "engineering-loop",
      index: "03",
      name: "Engineering loop",
      shortName: "Judgment",
      thesis: "Possibilities become software through engineering judgment",
      description:
        "A problem moves through research and external inputs before engineering judgment decides what to implement, test, revise, or reject.",
      annotation: "POSSIBILITY ≠ DECISION",
      nodes: [
        node("problem", "Problem", "idea", 195, 80),
        node("research", "Research", "evidence", 195, 200),
        node("sources", "AI · docs · code", "external", 195, 320, {
          emphasis: "external",
          width: 190,
        }),
        node("decision", "Engineering decision", "decision", 195, 455, {
          emphasis: "primary",
          width: 210,
        }),
        node("accept", "Accept", "outcome", 65, 585, { emphasis: "resolved" }),
        node("revise", "Revise", "outcome", 195, 585, { emphasis: "branch" }),
        node("reject", "Reject", "outcome", 325, 585, { emphasis: "branch" }),
        node("implement", "Implement", "service", 110, 720),
        node("test", "Test", "evidence", 280, 720),
        node("working", "Working system", "outcome", 100, 850, {
          emphasis: "resolved",
          width: 150,
        }),
        node("research-again", "Research again", "evidence", 290, 850, {
          emphasis: "branch",
          width: 140,
        }),
      ],
      edges: [
        { id: "loop-problem-research", from: "problem", to: "research", kind: "primary" },
        { id: "loop-research-sources", from: "research", to: "sources", kind: "primary" },
        { id: "loop-sources-decision", from: "sources", to: "decision", kind: "primary" },
        { id: "loop-decision-accept", from: "decision", to: "accept", kind: "branch" },
        { id: "loop-decision-revise", from: "decision", to: "revise", kind: "branch" },
        { id: "loop-decision-reject", from: "decision", to: "reject", kind: "branch" },
        { id: "loop-accept-implement", from: "accept", to: "implement", kind: "primary" },
        { id: "loop-implement-test", from: "implement", to: "test", kind: "primary" },
        { id: "loop-test-working", from: "test", to: "working", kind: "primary" },
        { id: "loop-revise-research", from: "revise", to: "research-again", kind: "feedback" },
        { id: "loop-reject-research", from: "reject", to: "research-again", kind: "feedback" },
      ],
      events: [{ id: "decision-flow", from: "problem", to: "decision" }],
    };
  }

  return {
    state: "engineering-loop",
    index: "03",
    name: "Engineering loop",
    shortName: "Judgment",
    thesis: "Possibilities become software through engineering judgment",
    description:
      "A problem moves through research and external inputs before engineering judgment decides what to implement, test, revise, or reject.",
    annotation: "POSSIBILITY ≠ DECISION",
    nodes: [
      node("problem", "Problem", "idea", 110, 220),
      node("research", "Research", "evidence", 300, 220),
      node("sources", "AI · docs · code", "external", 500, 220, {
        emphasis: "external",
        width: 180,
      }),
      node("decision", "Engineering decision", "decision", 735, 220, {
        emphasis: "primary",
        width: 200,
      }),
      node("accept", "Accept", "outcome", 995, 95, { emphasis: "resolved" }),
      node("revise", "Revise", "outcome", 995, 220, { emphasis: "branch" }),
      node("reject", "Reject", "outcome", 995, 345, { emphasis: "branch" }),
      node("implement", "Implement", "service", 735, 500),
      node("test", "Test", "evidence", 930, 500),
      node("working", "Working system", "outcome", 1100, 500, {
        emphasis: "resolved",
        width: 160,
      }),
      node("research-again", "Research again", "evidence", 500, 500, {
        emphasis: "branch",
        width: 150,
      }),
    ],
    edges: [
      { id: "loop-problem-research", from: "problem", to: "research", kind: "primary" },
      { id: "loop-research-sources", from: "research", to: "sources", kind: "primary" },
      { id: "loop-sources-decision", from: "sources", to: "decision", kind: "primary" },
      { id: "loop-decision-accept", from: "decision", to: "accept", kind: "branch" },
      { id: "loop-decision-revise", from: "decision", to: "revise", kind: "branch" },
      { id: "loop-decision-reject", from: "decision", to: "reject", kind: "branch" },
      { id: "loop-accept-implement", from: "accept", to: "implement", kind: "primary" },
      { id: "loop-implement-test", from: "implement", to: "test", kind: "primary" },
      { id: "loop-test-working", from: "test", to: "working", kind: "primary" },
      { id: "loop-revise-research", from: "revise", to: "research-again", kind: "feedback" },
      { id: "loop-reject-research", from: "reject", to: "research-again", kind: "feedback" },
    ],
    events: [{ id: "decision-flow", from: "problem", to: "decision" }],
  };
};

const resolvers: Record<BuildGraphState, StateResolver> = {
  current,
  "system-thinking": systemThinking,
  "multi-surface": multiSurface,
  "engineering-loop": engineeringLoop,
};

export const BUILD_GRAPH_STATES: BuildGraphState[] = [
  "current",
  "system-thinking",
  "multi-surface",
  "engineering-loop",
];

export function resolveBuildGraph(
  state: BuildGraphState,
  viewport: GraphViewport,
): BuildGraphDefinition {
  return resolvers[state](viewport);
}

export const BUILD_GRAPH_STATE_GUIDE = BUILD_GRAPH_STATES.map((state) => {
  const definition = resolveBuildGraph(state, "desktop");
  return {
    state,
    index: definition.index,
    name: definition.name,
    shortName: definition.shortName,
    thesis: definition.thesis,
    description: definition.description,
  };
});
