export type BuildGraphState =
  | "current"
  | "system-thinking"
  | "multi-surface"
  | "engineering-loop"
  | "spotify-limited"
  | "inherited-rebuild"
  | "capability-compression";

export type BuildGraphComposition =
  | "typography-integrated"
  | "full-width"
  | "embedded";

export type BuildGraphNodeType =
  | "idea"
  | "interface"
  | "api"
  | "service"
  | "data"
  | "external"
  | "component"
  | "decision"
  | "diagnosis"
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
  | "research-again"
  | "browser"
  | "player"
  | "assets"
  | "track-a"
  | "track-b"
  | "track-c"
  | "legacy-flutter"
  | "legacy-php"
  | "inspection"
  | "bellybasket-project"
  | "cravecart-project"
  | "genko-project"
  | "quantx-project"
  | "connected-capability"
  | "shared-capability"
  | "learning-capability"
  | "experiment-capability";

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
  kind?: "primary" | "branch" | "feedback" | "transition" | "compression";
};

export type GraphEvent = {
  id: string;
  from: GraphNodeId;
  to: GraphNodeId;
  delay?: number;
};

export type GraphGroup = {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  tone?: "frontend" | "legacy" | "rebuilt" | "capability";
};

export type GraphCallout = {
  id: string;
  text: string;
  x: number;
  y: number;
  tone?: "redline" | "success" | "muted";
};

export type BuildGraphDefinition = {
  state: BuildGraphState;
  index: string;
  name: string;
  shortName: string;
  thesis: string;
  description: string;
  annotation: string;
  preferredComposition: BuildGraphComposition;
  canvasHeight?: number;
  nodes: GraphNode[];
  edges: GraphEdge[];
  events: GraphEvent[];
  groups?: GraphGroup[];
  callouts?: GraphCallout[];
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
    preferredComposition: "typography-integrated",
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
      preferredComposition: "full-width",
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
    preferredComposition: "full-width",
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
      preferredComposition: "full-width",
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
    preferredComposition: "full-width",
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
      preferredComposition: "full-width",
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
    preferredComposition: "full-width",
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

const spotifyLimited: StateResolver = (viewport) => {
  if (viewport === "mobile") {
    return {
      state: "spotify-limited",
      index: "04",
      name: "Spotify / limited frontend",
      shortName: "Spotify",
      thesis: "The project worked inside the limit of the model I understood",
      description:
        "A browser player reads music directly from an oversized bundled asset folder. There is deliberately no API, server, or database boundary.",
      annotation: "WORKED / MODEL WAS LIMITED",
      preferredComposition: "embedded",
      canvasHeight: 980,
      groups: [
        { id: "spotify-frontend", label: "FRONTEND BUILD", x: 20, y: 82, width: 350, height: 790, tone: "frontend" },
        { id: "spotify-assets", label: "/ASSETS · BUNDLED CONTENT", x: 58, y: 440, width: 274, height: 380, tone: "legacy" },
      ],
      nodes: [
        node("browser", "Browser", "interface", 195, 155),
        node("player", "Audio player", "component", 195, 330, { emphasis: "resolved", width: 170 }),
        node("assets", "/assets", "evidence", 195, 515, { emphasis: "primary", width: 220, detail: "inside frontend project" }),
        node("track-a", "Track 01", "evidence", 105, 655),
        node("track-b", "Track 02", "evidence", 285, 655),
        node("track-c", "Track 03", "evidence", 195, 765),
      ],
      edges: [
        { id: "spotify-browser-player", from: "browser", to: "player", kind: "primary" },
        { id: "spotify-assets-player", from: "assets", to: "player", kind: "transition" },
        { id: "spotify-assets-track-a", from: "assets", to: "track-a", kind: "branch" },
        { id: "spotify-assets-track-b", from: "assets", to: "track-b", kind: "branch" },
        { id: "spotify-assets-track-c", from: "assets", to: "track-c", kind: "branch" },
      ],
      events: [{ id: "spotify-playback", from: "assets", to: "player" }],
      callouts: [
        { id: "spotify-worked", text: "WORKED", x: 72, y: 900, tone: "success" },
        { id: "spotify-limited", text: "NO BACKEND BOUNDARY", x: 318, y: 900, tone: "redline" },
      ],
    };
  }

  return {
    state: "spotify-limited",
    index: "04",
    name: "Spotify / limited frontend",
    shortName: "Spotify",
    thesis: "The project worked inside the limit of the model I understood",
    description:
      "A browser player reads music directly from an oversized bundled asset folder. There is deliberately no API, server, or database boundary.",
    annotation: "WORKED / MODEL WAS LIMITED",
    preferredComposition: "embedded",
    groups: [
      { id: "spotify-frontend", label: "BROWSER / FRONTEND BUILD", x: 70, y: 95, width: 1060, height: 500, tone: "frontend" },
      { id: "spotify-assets", label: "/ASSETS · COUPLED TO FRONTEND", x: 620, y: 145, width: 430, height: 390, tone: "legacy" },
    ],
    nodes: [
      node("browser", "Browser", "interface", 220, 310),
      node("player", "Audio player", "component", 455, 310, { emphasis: "resolved", width: 170 }),
      node("assets", "/assets", "evidence", 820, 235, { emphasis: "primary", width: 250, detail: "inside frontend project" }),
      node("track-a", "Track 01", "evidence", 720, 405),
      node("track-b", "Track 02", "evidence", 870, 405),
      node("track-c", "Track 03", "evidence", 795, 500),
    ],
    edges: [
      { id: "spotify-browser-player", from: "browser", to: "player", kind: "primary" },
      { id: "spotify-assets-player", from: "assets", to: "player", kind: "transition" },
      { id: "spotify-assets-track-a", from: "assets", to: "track-a", kind: "branch" },
      { id: "spotify-assets-track-b", from: "assets", to: "track-b", kind: "branch" },
      { id: "spotify-assets-track-c", from: "assets", to: "track-c", kind: "branch" },
    ],
    events: [{ id: "spotify-playback", from: "assets", to: "player" }],
    callouts: [
      { id: "spotify-worked", text: "WORKED", x: 92, y: 635, tone: "success" },
      { id: "spotify-limited", text: "MODEL WAS LIMITED / NO BACKEND BOUNDARY", x: 1105, y: 635, tone: "redline" },
    ],
  };
};

const inheritedRebuild: StateResolver = (viewport) => {
  if (viewport === "mobile") {
    return {
      state: "inherited-rebuild",
      index: "05",
      name: "DapiGO → CraveCart rebuild",
      shortName: "Rebuild",
      thesis: "First understand the inherited system. Then decide whether the model should change.",
      description:
        "Flutter and PHP/Laravel remain visible as the inherited DapiGO layer while inspection leads into a rebuilt React and React Native surface model around one shared Node.js backend.",
      annotation: "INHERIT → INSPECT → REBUILD",
      preferredComposition: "full-width",
      canvasHeight: 1120,
      groups: [
        { id: "legacy-layer", label: "INHERITED / DAPIGO", x: 28, y: 78, width: 334, height: 295, tone: "legacy" },
        { id: "rebuilt-layer", label: "REBUILT / CRAVECART", x: 20, y: 510, width: 350, height: 530, tone: "rebuilt" },
      ],
      nodes: [
        node("legacy-flutter", "Flutter", "interface", 195, 155, { emphasis: "branch" }),
        node("legacy-php", "PHP / Laravel", "service", 195, 290, { emphasis: "branch", width: 170 }),
        node("inspection", "Inspection", "diagnosis", 195, 435, { emphasis: "primary", detail: "understand · debug" }),
        node("customer", "Customer", "interface", 105, 590),
        node("admin", "Admin", "interface", 285, 590),
        node("partner", "Partner", "interface", 105, 705),
        node("rider", "Rider", "interface", 285, 705),
        node("core", "Shared Node backend", "service", 195, 845, { emphasis: "primary", width: 215 }),
        node("data", "Data", "data", 195, 975),
      ],
      edges: [
        { id: "rebuild-flutter-php", from: "legacy-flutter", to: "legacy-php", kind: "primary" },
        { id: "rebuild-php-inspection", from: "legacy-php", to: "inspection", kind: "transition" },
        { id: "rebuild-inspection-core", from: "inspection", to: "core", kind: "transition" },
        { id: "rebuild-customer-core", from: "customer", to: "core", kind: "branch" },
        { id: "rebuild-admin-core", from: "admin", to: "core", kind: "branch" },
        { id: "rebuild-partner-core", from: "partner", to: "core", kind: "branch" },
        { id: "rebuild-rider-core", from: "rider", to: "core", kind: "branch" },
        { id: "rebuild-core-data", from: "core", to: "data", kind: "primary" },
      ],
      events: [
        { id: "inspect-inherited", from: "legacy-flutter", to: "inspection" },
        { id: "coordinate-surface", from: "customer", to: "core", delay: 1.1 },
      ],
      callouts: [
        { id: "initial-work", text: "INITIAL WORK / BUG FIXING", x: 195, y: 395, tone: "muted" },
        { id: "surface-stack", text: "REACT / REACT NATIVE", x: 195, y: 1052, tone: "success" },
      ],
    };
  }

  return {
    state: "inherited-rebuild",
    index: "05",
    name: "DapiGO → CraveCart rebuild",
    shortName: "Rebuild",
    thesis: "First understand the inherited system. Then decide whether the model should change.",
    description:
      "Flutter and PHP/Laravel remain visible as the inherited DapiGO layer while inspection leads into a rebuilt React and React Native surface model around one shared Node.js backend.",
    annotation: "INHERIT → INSPECT → REBUILD",
    preferredComposition: "full-width",
    groups: [
      { id: "legacy-layer", label: "INHERITED SYSTEM / DAPIGO", x: 45, y: 95, width: 300, height: 510, tone: "legacy" },
      { id: "rebuilt-layer", label: "REBUILT SYSTEM / CRAVECART", x: 525, y: 72, width: 630, height: 555, tone: "rebuilt" },
    ],
    nodes: [
      node("legacy-flutter", "Flutter", "interface", 195, 230, { emphasis: "branch" }),
      node("legacy-php", "PHP / Laravel", "service", 195, 455, { emphasis: "branch", width: 170 }),
      node("inspection", "Inspection", "diagnosis", 425, 350, { emphasis: "primary", detail: "understand · debug" }),
      node("customer", "Customer", "interface", 640, 135),
      node("admin", "Admin", "interface", 640, 275),
      node("partner", "Partner", "interface", 640, 425),
      node("rider", "Rider", "interface", 640, 565),
      node("core", "Shared Node backend", "service", 895, 350, { emphasis: "primary", width: 215 }),
      node("data", "Data", "data", 1085, 350),
    ],
    edges: [
      { id: "rebuild-flutter-php", from: "legacy-flutter", to: "legacy-php", kind: "primary" },
      { id: "rebuild-php-inspection", from: "legacy-php", to: "inspection", kind: "transition" },
      { id: "rebuild-inspection-core", from: "inspection", to: "core", kind: "transition" },
      { id: "rebuild-customer-core", from: "customer", to: "core", kind: "branch" },
      { id: "rebuild-admin-core", from: "admin", to: "core", kind: "branch" },
      { id: "rebuild-partner-core", from: "partner", to: "core", kind: "branch" },
      { id: "rebuild-rider-core", from: "rider", to: "core", kind: "branch" },
      { id: "rebuild-core-data", from: "core", to: "data", kind: "primary" },
    ],
    events: [
      { id: "inspect-inherited", from: "legacy-flutter", to: "inspection" },
      { id: "coordinate-surface", from: "customer", to: "core", delay: 1.1 },
    ],
    callouts: [
      { id: "initial-work", text: "INITIAL WORK / BUG FIXING", x: 195, y: 635, tone: "muted" },
      { id: "surface-stack", text: "REACT / REACT NATIVE", x: 840, y: 635, tone: "success" },
    ],
  };
};

const capabilityCompression: StateResolver = (viewport) => {
  const projects = [
    ["bellybasket-project", "BellyBasket", "connected-capability", "Connected product system", "backend · payments · location · tracking"],
    ["cravecart-project", "CraveCart", "shared-capability", "Shared architecture", "shared backend · shared state"],
    ["genko-project", "GENKŌ", "learning-capability", "Product research", "learning loop · AI-assisted development"],
    ["quantx-project", "QuantX", "experiment-capability", "Decision systems", "ML · risk · experimentation"],
  ] as const;

  if (viewport === "mobile") {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];
    const events: GraphEvent[] = [];
    const groups: GraphGroup[] = [];
    projects.forEach(([projectId, projectLabel, capabilityId, capabilityLabel, detail], index) => {
      const top = 82 + index * 260;
      groups.push({
        id: `compression-${index}`,
        label: `PROJECT ${String(index + 1).padStart(2, "0")} → PERSISTENT CAPABILITY`,
        x: 20,
        y: top,
        width: 350,
        height: 220,
        tone: "capability",
      });
      nodes.push(
        node(projectId, projectLabel, "evidence", 195, top + 62, { emphasis: "branch", width: 165 }),
        node(capabilityId, capabilityLabel, "outcome", 195, top + 162, {
          emphasis: "resolved",
          width: 265,
          detail,
        }),
      );
      edges.push({ id: `compress-${index}`, from: projectId, to: capabilityId, kind: "compression" });
      events.push({ id: `compress-event-${index}`, from: projectId, to: capabilityId, delay: index * 0.35 });
    });

    return {
      state: "capability-compression",
      index: "06",
      name: "Capability compression",
      shortName: "Compression",
      thesis: "The project topology is temporary. The capability it develops persists.",
      description:
        "Each completed or continuing project is reduced to the reusable capability it added, preventing the developer graph from accumulating every historical component.",
      annotation: "PROJECT DETAIL → PERSISTENT CAPABILITY",
      preferredComposition: "typography-integrated",
      canvasHeight: 1180,
      nodes,
      edges,
      events,
      groups,
      callouts: [
        { id: "compression-rule", text: "KEEP THE CAPABILITY / RELEASE THE CLUTTER", x: 195, y: 1110, tone: "redline" },
      ],
    };
  }

  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const events: GraphEvent[] = [];
  const groups: GraphGroup[] = [];
  projects.forEach(([projectId, projectLabel, capabilityId, capabilityLabel, detail], index) => {
    const y = 135 + index * 145;
    groups.push({
      id: `compression-${index}`,
      label: `CAPABILITY RECORD ${String(index + 1).padStart(2, "0")}`,
      x: 55,
      y: y - 55,
      width: 1090,
      height: 112,
      tone: "capability",
    });
    nodes.push(
      node(projectId, projectLabel, "evidence", 255, y, { emphasis: "branch", width: 190 }),
      node(capabilityId, capabilityLabel, "outcome", 820, y, {
        emphasis: "resolved",
        width: 300,
        detail,
      }),
    );
    edges.push({ id: `compress-${index}`, from: projectId, to: capabilityId, kind: "compression" });
    events.push({ id: `compress-event-${index}`, from: projectId, to: capabilityId, delay: index * 0.35 });
  });

  return {
    state: "capability-compression",
    index: "06",
    name: "Capability compression",
    shortName: "Compression",
    thesis: "The project topology is temporary. The capability it develops persists.",
    description:
      "Each completed or continuing project is reduced to the reusable capability it added, preventing the developer graph from accumulating every historical component.",
    annotation: "PROJECT DETAIL → PERSISTENT CAPABILITY",
    preferredComposition: "typography-integrated",
    nodes,
    edges,
    events,
    groups,
    callouts: [
      { id: "compression-rule", text: "KEEP THE CAPABILITY / RELEASE THE CLUTTER", x: 1115, y: 640, tone: "redline" },
    ],
  };
};

const resolvers: Record<BuildGraphState, StateResolver> = {
  current,
  "system-thinking": systemThinking,
  "multi-surface": multiSurface,
  "engineering-loop": engineeringLoop,
  "spotify-limited": spotifyLimited,
  "inherited-rebuild": inheritedRebuild,
  "capability-compression": capabilityCompression,
};

export const BUILD_GRAPH_STATES: BuildGraphState[] = [
  "current",
  "system-thinking",
  "multi-surface",
  "engineering-loop",
  "spotify-limited",
  "inherited-rebuild",
  "capability-compression",
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
    annotation: definition.annotation,
    preferredComposition: definition.preferredComposition,
  };
});
