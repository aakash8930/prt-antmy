export type BuildGraphState =
  | "current"
  | "system-thinking"
  | "multi-surface"
  | "engineering-loop"
  | "capability-peelback"
  | "beginner-tools"
  | "spotify-player"
  | "bellybasket-foundation"
  | "bellybasket-system"
  | "client-workbench"
  | "client-constraints"
  | "client-delivery"
  | "dapigo-inherited"
  | "dapigo-inspection"
  | "cravecart-growing"
  | "shared-architecture"
  | "genko-problem"
  | "genko-loop"
  | "genko-ai-product"
  | "genko-capability"
  | "ai-workbench"
  | "ai-proposals"
  | "ai-evaluation"
  | "ai-workflow"
  | "ai-capability"
  | "quantx-problem"
  | "market-pipeline"
  | "model-branching"
  | "decision-gates"
  | "quantx-capability"
  | "accumulated-system"
  | "capability-provenance"
  | "open-frontier"
  | "contact-handoff"
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
  | "experiment-capability"
  | "deployment"
  | "models"
  | "html"
  | "css"
  | "javascript"
  | "todo"
  | "tic-tac-toe"
  | "basic-sites"
  | "audio"
  | "admin-surface"
  | "maps"
  | "tracking"
  | "workbench"
  | "requirement"
  | "external-service"
  | "business-rule"
  | "existing-system"
  | "delivery"
  | "presentation-commerce"
  | "commerce-flow"
  | "payment-integration"
  | "business-integration"
  | "role-system"
  | "client-capability"
  | "interface-capability"
  | "personal-problem"
  | "learn"
  | "practice"
  | "listen"
  | "write"
  | "quiz"
  | "ai-product"
  | "continue"
  | "product-research"
  | "ai-product-development"
  | "documentation"
  | "repository"
  | "running-system"
  | "compare-approaches"
  | "inspect"
  | "debug"
  | "ai-engineering-capability"
  | "market-information"
  | "analysis"
  | "features"
  | "model"
  | "xgboost"
  | "lstm"
  | "experimental-model"
  | "risk"
  | "execution"
  | "outcome"
  | "no-action"
  | "insufficient-confidence"
  | "risk-rejected"
  | "unresolved"
  | "early-work"
  | "duforge-work"
  | "workflow-provenance"
  | "learning-frontier"
  | "development-frontier"
  | "next-experiment"
  | "unknown-yet"
  | "build-further"
  | "open-connection"
  | "email-contact"
  | "github-contact";

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

const capabilityPeelback: StateResolver = (viewport) => {
  const mobile = viewport === "mobile";
  const x = mobile ? 195 : undefined;
  return {
    state: "capability-peelback",
    index: "01A",
    name: "Accumulated capability recedes",
    shortName: "Peelback",
    thesis: "The current system is reduced to the layers learned later",
    description:
      "Deployment, models, backend, and data recede as the visual moves from present capability toward the browser where the story began.",
    annotation: "CURRENT CAPABILITY → EARLY FOUNDATION",
    preferredComposition: "typography-integrated",
    canvasHeight: mobile ? 900 : undefined,
    nodes: mobile
      ? [
          node("deployment", "Deployment", "outcome", x!, 120, { emphasis: "branch" }),
          node("models", "Models", "decision", x!, 270, { emphasis: "branch" }),
          node("core", "Backend", "service", x!, 420, { emphasis: "branch" }),
          node("data", "Data", "data", x!, 570, { emphasis: "branch" }),
          node("browser", "Browser", "interface", x!, 735, { emphasis: "primary" }),
        ]
      : [
          node("deployment", "Deployment", "outcome", 160, 170, { emphasis: "branch" }),
          node("models", "Models", "decision", 380, 255, { emphasis: "branch" }),
          node("core", "Backend", "service", 600, 350, { emphasis: "branch" }),
          node("data", "Data", "data", 820, 445, { emphasis: "branch" }),
          node("browser", "Browser", "interface", 1040, 535, { emphasis: "primary" }),
        ],
    edges: [
      { id: "peel-deployment-models", from: "deployment", to: "models", kind: "transition" },
      { id: "peel-models-backend", from: "models", to: "core", kind: "transition" },
      { id: "peel-backend-data", from: "core", to: "data", kind: "transition" },
      { id: "peel-data-browser", from: "data", to: "browser", kind: "transition" },
    ],
    events: [],
    callouts: [
      {
        id: "peel-note",
        text: "REMOVE THE LAYERS LEARNED LATER",
        x: mobile ? 195 : 1115,
        y: mobile ? 835 : 640,
        tone: "muted",
      },
    ],
  };
};

const beginnerTools: StateResolver = (viewport) => {
  if (viewport === "mobile") {
    return {
      state: "beginner-tools",
      index: "01B",
      name: "Beginner tools",
      shortName: "Beginning",
      thesis: "The system grew from browser primitives",
      description:
        "HTML, CSS, and JavaScript converge on a browser, then branch into a Todo app, Tic-Tac-Toe, and basic websites.",
      annotation: "HTML + CSS + JAVASCRIPT → BROWSER",
      preferredComposition: "typography-integrated",
      canvasHeight: 980,
      nodes: [
        node("html", "HTML", "component", 195, 105),
        node("css", "CSS", "component", 195, 230),
        node("javascript", "JavaScript", "component", 195, 355, { emphasis: "primary" }),
        node("browser", "Browser", "interface", 195, 520, { emphasis: "resolved" }),
        node("todo", "Todo", "evidence", 95, 705),
        node("tic-tac-toe", "Tic-Tac-Toe", "evidence", 295, 705, { width: 145 }),
        node("basic-sites", "Basic websites", "evidence", 195, 840, { width: 165 }),
      ],
      edges: [
        { id: "beginner-html-browser", from: "html", to: "browser", kind: "branch" },
        { id: "beginner-css-browser", from: "css", to: "browser", kind: "branch" },
        { id: "beginner-js-browser", from: "javascript", to: "browser", kind: "primary" },
        { id: "beginner-browser-todo", from: "browser", to: "todo", kind: "branch" },
        { id: "beginner-browser-tic", from: "browser", to: "tic-tac-toe", kind: "branch" },
        { id: "beginner-browser-sites", from: "browser", to: "basic-sites", kind: "branch" },
      ],
      events: [{ id: "beginner-build", from: "javascript", to: "browser" }],
    };
  }

  return {
    state: "beginner-tools",
    index: "01B",
    name: "Beginner tools",
    shortName: "Beginning",
    thesis: "The system grew from browser primitives",
    description:
      "HTML, CSS, and JavaScript converge on a browser, then branch into a Todo app, Tic-Tac-Toe, and basic websites.",
    annotation: "HTML + CSS + JAVASCRIPT → BROWSER",
    preferredComposition: "typography-integrated",
    nodes: [
      node("html", "HTML", "component", 130, 350),
      node("css", "CSS", "component", 310, 350),
      node("javascript", "JavaScript", "component", 500, 350, { emphasis: "primary" }),
      node("browser", "Browser", "interface", 720, 350, { emphasis: "resolved" }),
      node("todo", "Todo", "evidence", 1010, 155),
      node("tic-tac-toe", "Tic-Tac-Toe", "evidence", 1010, 350, { width: 145 }),
      node("basic-sites", "Basic websites", "evidence", 1010, 545, { width: 165 }),
    ],
    edges: [
      { id: "beginner-html-browser", from: "html", to: "browser", kind: "branch" },
      { id: "beginner-css-browser", from: "css", to: "browser", kind: "branch" },
      { id: "beginner-js-browser", from: "javascript", to: "browser", kind: "primary" },
      { id: "beginner-browser-todo", from: "browser", to: "todo", kind: "branch" },
      { id: "beginner-browser-tic", from: "browser", to: "tic-tac-toe", kind: "branch" },
      { id: "beginner-browser-sites", from: "browser", to: "basic-sites", kind: "branch" },
    ],
    events: [{ id: "beginner-build", from: "javascript", to: "browser" }],
  };
};

const spotifyPlayer: StateResolver = (viewport) => {
  const mobile = viewport === "mobile";
  return {
    state: "spotify-player",
    index: "02A",
    name: "Browser becomes a player",
    shortName: "Player",
    thesis: "The early browser becomes the first project I was proud of",
    description:
      "The browser resolves into a Spotify-style audio player before the bundled asset model is exposed.",
    annotation: "BROWSER → PLAYER → AUDIO",
    preferredComposition: "embedded",
    canvasHeight: mobile ? 900 : undefined,
    nodes: mobile
      ? [
          node("browser", "Browser", "interface", 195, 160),
          node("player", "Spotify player", "component", 195, 430, { emphasis: "primary", width: 190 }),
          node("audio", "Audio", "outcome", 195, 710, { emphasis: "resolved" }),
        ]
      : [
          node("browser", "Browser", "interface", 230, 350),
          node("player", "Spotify player", "component", 600, 350, { emphasis: "primary", width: 190 }),
          node("audio", "Audio", "outcome", 970, 350, { emphasis: "resolved" }),
        ],
    edges: [
      { id: "player-browser-player", from: "browser", to: "player", kind: "primary" },
      { id: "player-player-audio", from: "player", to: "audio", kind: "primary" },
    ],
    events: [{ id: "player-audio-event", from: "player", to: "audio" }],
    callouts: [
      { id: "player-worked", text: "WORKED", x: mobile ? 195 : 1080, y: mobile ? 820 : 610, tone: "success" },
    ],
  };
};

const bellybasketFoundation: StateResolver = (viewport) => {
  const mobile = viewport === "mobile";
  const x = mobile ? 195 : undefined;
  return {
    state: "bellybasket-foundation",
    index: "03A",
    name: "Backend boundary",
    shortName: "Boundary",
    thesis: "The browser gains a system behind it",
    description:
      "A frontend crosses an API boundary into backend logic and data—the foundation needed before additional product responsibilities can connect.",
    annotation: "FRONTEND → API → BACKEND → DATA",
    preferredComposition: "full-width",
    canvasHeight: mobile ? 920 : undefined,
    nodes: mobile
      ? [
          node("interface", "Frontend", "interface", x!, 125),
          node("api", "API boundary", "api", x!, 330, { emphasis: "primary", width: 165 }),
          node("core", "Backend", "service", x!, 545, { emphasis: "primary" }),
          node("data", "Data", "data", x!, 760),
        ]
      : [
          node("interface", "Frontend", "interface", 180, 350),
          node("api", "API boundary", "api", 460, 350, { emphasis: "primary", width: 165 }),
          node("core", "Backend", "service", 740, 350, { emphasis: "primary" }),
          node("data", "Data", "data", 1020, 350),
        ],
    edges: [
      { id: "foundation-interface-api", from: "interface", to: "api", kind: "primary" },
      { id: "foundation-api-core", from: "api", to: "core", kind: "primary" },
      { id: "foundation-core-data", from: "core", to: "data", kind: "primary" },
    ],
    events: [{ id: "foundation-request", from: "interface", to: "data" }],
  };
};

const bellybasketSystem: StateResolver = (viewport) => {
  if (viewport === "mobile") {
    return {
      state: "bellybasket-system",
      index: "03B",
      name: "BellyBasket connected system",
      shortName: "BellyBasket",
      thesis: "Several product responsibilities now have to agree",
      description:
        "Frontend and admin connect through an API and backend to data, payment, location, maps, and live tracking.",
      annotation: "FIRST REAL SYSTEM / COHERENT STATE",
      preferredComposition: "full-width",
      canvasHeight: 1160,
      nodes: [
        node("interface", "Frontend", "interface", 100, 120),
        node("admin-surface", "Admin", "interface", 290, 120),
        node("api", "API", "api", 195, 280),
        node("core", "Backend", "service", 195, 445, { emphasis: "primary" }),
        node("data", "Data", "data", 195, 610),
        node("payment", "Razorpay", "external", 90, 785, { emphasis: "external" }),
        node("location", "Location", "external", 300, 785, { emphasis: "external" }),
        node("maps", "Maps", "component", 90, 965),
        node("tracking", "Live tracking", "outcome", 300, 965, { width: 150, emphasis: "resolved" }),
      ],
      edges: [
        { id: "belly-frontend-api", from: "interface", to: "api", kind: "primary" },
        { id: "belly-admin-api", from: "admin-surface", to: "api", kind: "branch" },
        { id: "belly-api-core", from: "api", to: "core", kind: "primary" },
        { id: "belly-core-data", from: "core", to: "data", kind: "primary" },
        { id: "belly-core-payment", from: "core", to: "payment", kind: "branch" },
        { id: "belly-core-location", from: "core", to: "location", kind: "branch" },
        { id: "belly-location-maps", from: "location", to: "maps", kind: "branch" },
        { id: "belly-location-tracking", from: "location", to: "tracking", kind: "branch" },
      ],
      events: [
        { id: "belly-request", from: "interface", to: "core" },
        { id: "belly-location-event", from: "location", to: "tracking", delay: 1 },
      ],
      callouts: [
        { id: "belly-turning-point", text: "I CAN ACTUALLY BUILD A SYSTEM", x: 195, y: 1090, tone: "success" },
      ],
    };
  }

  return {
    state: "bellybasket-system",
    index: "03B",
    name: "BellyBasket connected system",
    shortName: "BellyBasket",
    thesis: "Several product responsibilities now have to agree",
    description:
      "Frontend and admin connect through an API and backend to data, payment, location, maps, and live tracking.",
    annotation: "FIRST REAL SYSTEM / COHERENT STATE",
    preferredComposition: "full-width",
    nodes: [
      node("interface", "Frontend", "interface", 145, 210),
      node("admin-surface", "Admin", "interface", 145, 490),
      node("api", "API", "api", 380, 350),
      node("core", "Backend", "service", 610, 350, { emphasis: "primary" }),
      node("data", "Data", "data", 840, 350),
      node("payment", "Razorpay", "external", 870, 115, { emphasis: "external" }),
      node("location", "Location", "external", 870, 575, { emphasis: "external" }),
      node("maps", "Maps", "component", 1080, 490),
      node("tracking", "Live tracking", "outcome", 1080, 620, { width: 150, emphasis: "resolved" }),
    ],
    edges: [
      { id: "belly-frontend-api", from: "interface", to: "api", kind: "primary" },
      { id: "belly-admin-api", from: "admin-surface", to: "api", kind: "branch" },
      { id: "belly-api-core", from: "api", to: "core", kind: "primary" },
      { id: "belly-core-data", from: "core", to: "data", kind: "primary" },
      { id: "belly-core-payment", from: "core", to: "payment", kind: "branch" },
      { id: "belly-core-location", from: "core", to: "location", kind: "branch" },
      { id: "belly-location-maps", from: "location", to: "maps", kind: "branch" },
      { id: "belly-location-tracking", from: "location", to: "tracking", kind: "branch" },
    ],
    events: [
      { id: "belly-request", from: "interface", to: "core" },
      { id: "belly-location-event", from: "location", to: "tracking", delay: 1 },
    ],
    callouts: [
      { id: "belly-turning-point", text: "I CAN ACTUALLY BUILD A SYSTEM", x: 1110, y: 670, tone: "success" },
    ],
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

const clientWorkbench: StateResolver = (viewport) => {
  const mobile = viewport === "mobile";
  return {
    state: "client-workbench",
    index: "04A",
    name: "Client workbench",
    shortName: "Workbench",
    thesis: "The definition of done no longer belongs to the developer alone",
    description:
      "The connected-system capability from BellyBasket enters a professional workbench where an external requirement can constrain the build.",
    annotation: "PERSONAL BUILD → CLIENT WORKBENCH",
    preferredComposition: "full-width",
    canvasHeight: mobile ? 900 : undefined,
    nodes: mobile
      ? [
          node("interface", "Interface", "interface", 195, 70, { emphasis: "branch" }),
          node("connected-capability", "Connected system", "outcome", 195, 210, { emphasis: "branch", width: 205, detail: "BellyBasket" }),
          node("workbench", "Workbench", "service", 195, 440, { emphasis: "primary", detail: "definition of done" }),
          node("requirement", "External requirement", "external", 195, 720, { emphasis: "external", width: 220 }),
        ]
      : [
          node("interface", "Interface", "interface", 75, 350, { emphasis: "branch" }),
          node("connected-capability", "Connected system", "outcome", 280, 350, { emphasis: "branch", width: 205, detail: "BellyBasket" }),
          node("workbench", "Workbench", "service", 640, 350, { emphasis: "primary", detail: "definition of done" }),
          node("requirement", "External requirement", "external", 1010, 350, { emphasis: "external", width: 220 }),
        ],
    edges: [
      { id: "workbench-interface", from: "interface", to: "connected-capability", kind: "branch" },
      { id: "workbench-capability", from: "connected-capability", to: "workbench", kind: "transition" },
      { id: "workbench-requirement", from: "requirement", to: "workbench", kind: "transition" },
    ],
    events: [{ id: "requirement-enters", from: "requirement", to: "workbench" }],
    callouts: [
      { id: "workbench-question", text: "WHAT DOES SOMEONE ACTUALLY NEED?", x: mobile ? 195 : 1050, y: mobile ? 835 : 625, tone: "redline" },
    ],
  };
};

const clientConstraints: StateResolver = (viewport) => {
  const mobile = viewport === "mobile";
  return {
    state: "client-constraints",
    index: "04B",
    name: "Changing client constraints",
    shortName: "Constraints",
    thesis: "Different requirements reshape one engineering workbench",
    description:
      "Presentation and commerce, commerce flow, payment integration, business-system integration, and organizational roles constrain the same workbench without pretending to document each project's architecture.",
    annotation: "REQUIREMENTS BECOME SYSTEM CONSTRAINTS",
    preferredComposition: "full-width",
    canvasHeight: mobile ? 1160 : undefined,
    groups: mobile
      ? [{ id: "client-inputs", label: "AFTER BELLYBASKET / INCOMING CLIENT CONTEXT", x: 22, y: 72, width: 346, height: 655, tone: "frontend" }]
      : [{ id: "client-inputs", label: "AFTER BELLYBASKET / CHANGING CLIENT CONTEXT", x: 55, y: 75, width: 720, height: 550, tone: "frontend" }],
    nodes: mobile
      ? [
          node("presentation-commerce", "Presentation / commerce", "external", 195, 140, { detail: "UltraCoreWood", width: 245 }),
          node("commerce-flow", "Commerce flow", "external", 195, 265, { detail: "Makhana Health King", width: 220 }),
          node("payment-integration", "Payment integration", "external", 195, 390, { detail: "PhonePe Autopay", width: 225 }),
          node("business-integration", "Business integration", "external", 195, 515, { detail: "SAP HANA", width: 225 }),
          node("role-system", "Role-based system", "external", 195, 640, { detail: "Preschool platform", width: 215 }),
          node("workbench", "Client workbench", "service", 195, 825, { emphasis: "primary", width: 195 }),
          node("delivery", "Delivery", "outcome", 195, 1010, { emphasis: "resolved" }),
        ]
      : [
          node("presentation-commerce", "Presentation / commerce", "external", 230, 145, { detail: "UltraCoreWood", width: 245 }),
          node("commerce-flow", "Commerce flow", "external", 230, 270, { detail: "Makhana Health King", width: 220 }),
          node("payment-integration", "Payment integration", "external", 230, 395, { detail: "PhonePe Autopay", width: 225 }),
          node("business-integration", "Business integration", "external", 560, 210, { detail: "SAP HANA", width: 225 }),
          node("role-system", "Role-based system", "external", 560, 430, { detail: "Preschool platform", width: 215 }),
          node("workbench", "Client workbench", "service", 855, 350, { emphasis: "primary", width: 195 }),
          node("delivery", "Delivery", "outcome", 1080, 350, { emphasis: "resolved" }),
        ],
    edges: [
      { id: "constraint-presentation", from: "presentation-commerce", to: "workbench", kind: "branch" },
      { id: "constraint-commerce", from: "commerce-flow", to: "workbench", kind: "branch" },
      { id: "constraint-payment", from: "payment-integration", to: "workbench", kind: "branch" },
      { id: "constraint-business", from: "business-integration", to: "workbench", kind: "branch" },
      { id: "constraint-role", from: "role-system", to: "workbench", kind: "branch" },
      { id: "constraint-delivery", from: "workbench", to: "delivery", kind: "primary" },
    ],
    events: [
      { id: "constraint-payment-event", from: "payment-integration", to: "workbench" },
      { id: "constraint-business-event", from: "business-integration", to: "workbench", delay: 0.8 },
    ],
  };
};

const clientDelivery: StateResolver = (viewport) => {
  const mobile = viewport === "mobile";
  return {
    state: "client-delivery",
    index: "04C",
    name: "Client delivery capability",
    shortName: "Delivery",
    thesis: "External requirements become a persistent delivery capability",
    description:
      "The changing project constraints compress into client delivery while the workbench receives an existing system—the handoff into inherited software.",
    annotation: "CONSTRAINTS → DELIVERY → EXISTING SYSTEM",
    preferredComposition: "full-width",
    canvasHeight: mobile ? 1000 : undefined,
    nodes: mobile
      ? [
          node("connected-capability", "Connected system", "outcome", 195, 110, { emphasis: "branch", width: 205, detail: "BellyBasket" }),
          node("requirement", "External requirements", "external", 195, 285, { emphasis: "external", width: 220 }),
          node("workbench", "Client workbench", "service", 195, 465, { emphasis: "primary", width: 195 }),
          node("delivery", "Delivered work", "outcome", 195, 645, { emphasis: "resolved" }),
          node("client-capability", "Client delivery", "outcome", 195, 810, { emphasis: "resolved", width: 190 }),
          node("existing-system", "Existing system", "evidence", 195, 930, { emphasis: "branch", width: 190 }),
        ]
      : [
          node("connected-capability", "Connected system", "outcome", 125, 165, { emphasis: "branch", width: 205, detail: "BellyBasket" }),
          node("requirement", "External requirements", "external", 280, 350, { emphasis: "external", width: 220 }),
          node("workbench", "Client workbench", "service", 565, 350, { emphasis: "primary", width: 195 }),
          node("delivery", "Delivered work", "outcome", 815, 350, { emphasis: "resolved" }),
          node("client-capability", "Client delivery", "outcome", 1045, 215, { emphasis: "resolved", width: 190 }),
          node("existing-system", "Existing system", "evidence", 1045, 490, { emphasis: "branch", width: 190 }),
        ],
    edges: [
      { id: "delivery-backbone", from: "connected-capability", to: "workbench", kind: "branch" },
      { id: "delivery-requirement", from: "requirement", to: "workbench", kind: "transition" },
      { id: "delivery-workbench", from: "workbench", to: "delivery", kind: "primary" },
      { id: "delivery-capability", from: "delivery", to: "client-capability", kind: "compression" },
      { id: "delivery-existing", from: "delivery", to: "existing-system", kind: "transition" },
    ],
    events: [{ id: "existing-system-arrives", from: "delivery", to: "existing-system" }],
  };
};

const dapigoInherited: StateResolver = (viewport) => {
  const mobile = viewport === "mobile";
  return {
    state: "dapigo-inherited",
    index: "05A",
    name: "Inherited DapiGO",
    shortName: "Inherited",
    thesis: "Client delivery now begins inside software that already exists",
    description:
      "Only the verified inherited architecture is shown: DapiGO used Flutter with PHP/Laravel. The client-delivery capability remains as subdued context.",
    annotation: "EXISTING SYSTEM / DAPIGO",
    preferredComposition: "full-width",
    canvasHeight: mobile ? 900 : undefined,
    groups: mobile
      ? [{ id: "dapigo-inherited", label: "INHERITED / DAPIGO", x: 25, y: 195, width: 340, height: 630, tone: "legacy" }]
      : [{ id: "dapigo-inherited", label: "INHERITED SYSTEM / DAPIGO", x: 315, y: 80, width: 835, height: 540, tone: "legacy" }],
    nodes: mobile
      ? [
          node("client-capability", "Client delivery", "outcome", 195, 105, { emphasis: "branch", width: 190 }),
          node("existing-system", "DapiGO", "evidence", 195, 285, { emphasis: "branch" }),
          node("legacy-flutter", "Flutter", "interface", 195, 425, { emphasis: "branch" }),
          node("legacy-php", "PHP / Laravel", "service", 195, 600, { emphasis: "branch", width: 170 }),
          node("inspection", "Inspection", "diagnosis", 195, 775, { emphasis: "branch", detail: "understand first" }),
        ]
      : [
          node("client-capability", "Client delivery", "outcome", 135, 350, { emphasis: "branch", width: 190 }),
          node("existing-system", "DapiGO", "evidence", 430, 350, { emphasis: "branch" }),
          node("legacy-flutter", "Flutter", "interface", 675, 230, { emphasis: "branch" }),
          node("legacy-php", "PHP / Laravel", "service", 890, 465, { emphasis: "branch", width: 170 }),
          node("inspection", "Inspection", "diagnosis", 1080, 280, { emphasis: "branch", detail: "understand first" }),
        ],
    edges: [
      { id: "dapigo-client-existing", from: "client-capability", to: "existing-system", kind: "transition" },
      { id: "dapigo-existing-flutter", from: "existing-system", to: "legacy-flutter", kind: "primary" },
      { id: "dapigo-flutter-php", from: "legacy-flutter", to: "legacy-php", kind: "primary" },
      { id: "dapigo-php-inspection", from: "legacy-php", to: "inspection", kind: "transition" },
    ],
    events: [{ id: "dapigo-entry", from: "existing-system", to: "legacy-php" }],
  };
};

const dapigoInspection: StateResolver = (viewport) => {
  const mobile = viewport === "mobile";
  return {
    state: "dapigo-inspection",
    index: "05B",
    name: "Inspect before changing",
    shortName: "Inspection",
    thesis: "Understanding the existing model comes before rebuilding it",
    description:
      "DapiGO's verified Flutter and PHP/Laravel layers stay visible while inspection represents the initial bug-fixing and understanding work. No unverified modules or bugs are inferred.",
    annotation: "BUILDING FEATURES → UNDERSTANDING THE MODEL",
    preferredComposition: "full-width",
    canvasHeight: mobile ? 960 : undefined,
    groups: mobile
      ? [{ id: "dapigo-inspection", label: "INHERITED / DAPIGO", x: 24, y: 72, width: 342, height: 760, tone: "legacy" }]
      : [{ id: "dapigo-inspection", label: "INHERITED SYSTEM / DAPIGO", x: 80, y: 82, width: 1040, height: 530, tone: "legacy" }],
    nodes: mobile
      ? [
          node("existing-system", "DapiGO", "evidence", 195, 145, { emphasis: "branch" }),
          node("legacy-flutter", "Flutter", "interface", 195, 325, { emphasis: "branch" }),
          node("legacy-php", "PHP / Laravel", "service", 195, 510, { emphasis: "branch", width: 170 }),
          node("inspection", "Inspection", "diagnosis", 195, 720, { emphasis: "primary", detail: "understand · bug fixing" }),
        ]
      : [
          node("existing-system", "DapiGO", "evidence", 185, 350, { emphasis: "branch" }),
          node("legacy-flutter", "Flutter", "interface", 430, 225, { emphasis: "branch" }),
          node("legacy-php", "PHP / Laravel", "service", 680, 475, { emphasis: "branch", width: 170 }),
          node("inspection", "Inspection", "diagnosis", 975, 350, { emphasis: "primary", detail: "understand · bug fixing" }),
        ],
    edges: [
      { id: "inspection-existing-flutter", from: "existing-system", to: "legacy-flutter", kind: "primary" },
      { id: "inspection-flutter-php", from: "legacy-flutter", to: "legacy-php", kind: "primary" },
      { id: "inspection-php-inspect", from: "legacy-php", to: "inspection", kind: "transition" },
    ],
    events: [{ id: "inspection-path", from: "existing-system", to: "inspection" }],
    callouts: [
      { id: "inspection-first", text: "INSPECT / UNDERSTAND / THEN DECIDE", x: mobile ? 195 : 1010, y: mobile ? 885 : 640, tone: "redline" },
    ],
  };
};

const cravecartGrowing: StateResolver = (viewport) => {
  const mobile = viewport === "mobile";
  return {
    state: "cravecart-growing",
    index: "05C",
    name: "A new model grows through the old one",
    shortName: "New model",
    thesis: "The rebuild decision changes the model rather than erasing its history",
    description:
      "The inherited Flutter and PHP/Laravel layer remains visible while customer and admin surfaces begin connecting to a shared Node backend scaffold.",
    annotation: "UNDERSTAND → CHANGE THE MODEL",
    preferredComposition: "full-width",
    canvasHeight: mobile ? 1160 : undefined,
    groups: mobile
      ? [
          { id: "growing-old", label: "INHERITED / DAPIGO", x: 25, y: 70, width: 340, height: 390, tone: "legacy" },
          { id: "growing-new", label: "REBUILD GROWING / CRAVECART", x: 20, y: 585, width: 350, height: 475, tone: "rebuilt" },
        ]
      : [
          { id: "growing-old", label: "INHERITED / DAPIGO", x: 45, y: 90, width: 360, height: 510, tone: "legacy" },
          { id: "growing-new", label: "NEW MODEL GROWING / CRAVECART", x: 540, y: 90, width: 615, height: 510, tone: "rebuilt" },
        ],
    nodes: mobile
      ? [
          node("legacy-flutter", "Flutter", "interface", 195, 150, { emphasis: "branch" }),
          node("legacy-php", "PHP / Laravel", "service", 195, 285, { emphasis: "branch", width: 170 }),
          node("inspection", "Inspection", "diagnosis", 195, 510, { emphasis: "primary" }),
          node("customer", "Customer", "interface", 105, 665),
          node("admin", "Admin", "interface", 285, 665),
          node("core", "Shared Node backend", "service", 195, 855, { emphasis: "primary", width: 215, detail: "scaffolded" }),
          node("data", "Data", "data", 195, 990, { emphasis: "branch" }),
        ]
      : [
          node("legacy-flutter", "Flutter", "interface", 220, 225, { emphasis: "branch" }),
          node("legacy-php", "PHP / Laravel", "service", 220, 465, { emphasis: "branch", width: 170 }),
          node("inspection", "Inspection", "diagnosis", 465, 350, { emphasis: "primary" }),
          node("customer", "Customer", "interface", 640, 225),
          node("admin", "Admin", "interface", 640, 475),
          node("core", "Shared Node backend", "service", 890, 350, { emphasis: "primary", width: 215, detail: "scaffolded" }),
          node("data", "Data", "data", 1080, 350, { emphasis: "branch" }),
        ],
    edges: [
      { id: "growing-flutter-php", from: "legacy-flutter", to: "legacy-php", kind: "primary" },
      { id: "growing-php-inspection", from: "legacy-php", to: "inspection", kind: "transition" },
      { id: "growing-inspection-core", from: "inspection", to: "core", kind: "transition" },
      { id: "growing-customer-core", from: "customer", to: "core", kind: "branch" },
      { id: "growing-admin-core", from: "admin", to: "core", kind: "branch" },
      { id: "growing-core-data", from: "core", to: "data", kind: "primary" },
    ],
    events: [{ id: "new-model-grows", from: "inspection", to: "core" }],
    callouts: [
      { id: "growing-status", text: "REBUILD IN PROGRESS", x: mobile ? 195 : 1070, y: mobile ? 1095 : 640, tone: "muted" },
    ],
  };
};

const sharedArchitecture: StateResolver = (viewport) => {
  const mobile = viewport === "mobile";
  return {
    state: "shared-architecture",
    index: "05E",
    name: "Shared architecture extracted",
    shortName: "Shared capability",
    thesis: "The project topology recedes; shared architecture persists",
    description:
      "CraveCart's four-surface topology compresses into shared architecture and multi-surface system capability, alongside connected-system and client-delivery context.",
    annotation: "CRAVECART → SHARED ARCHITECTURE",
    preferredComposition: "typography-integrated",
    canvasHeight: mobile ? 1040 : undefined,
    nodes: mobile
      ? [
          node("connected-capability", "Connected system", "outcome", 195, 105, { emphasis: "branch", width: 205 }),
          node("client-capability", "Client delivery", "outcome", 195, 260, { emphasis: "branch", width: 190 }),
          node("existing-system", "DapiGO", "evidence", 195, 430, { emphasis: "branch", detail: "historical layer" }),
          node("cravecart-project", "CraveCart", "evidence", 195, 600, { emphasis: "branch" }),
          node("shared-capability", "Shared architecture", "outcome", 195, 780, { emphasis: "resolved", width: 225, detail: "multi-surface system" }),
        ]
      : [
          node("connected-capability", "Connected system", "outcome", 150, 175, { emphasis: "branch", width: 205 }),
          node("client-capability", "Client delivery", "outcome", 150, 500, { emphasis: "branch", width: 190 }),
          node("existing-system", "DapiGO", "evidence", 430, 175, { emphasis: "branch", detail: "historical layer" }),
          node("cravecart-project", "CraveCart", "evidence", 620, 350, { emphasis: "branch" }),
          node("shared-capability", "Shared architecture", "outcome", 980, 350, { emphasis: "resolved", width: 225, detail: "multi-surface system" }),
        ],
    edges: [
      { id: "shared-connected-client", from: "connected-capability", to: "client-capability", kind: "branch" },
      { id: "shared-history-project", from: "existing-system", to: "cravecart-project", kind: "transition" },
      { id: "shared-compress", from: "cravecart-project", to: "shared-capability", kind: "compression" },
      { id: "shared-client-capability", from: "client-capability", to: "shared-capability", kind: "branch" },
    ],
    events: [{ id: "shared-extraction", from: "cravecart-project", to: "shared-capability" }],
    callouts: [
      { id: "shared-release", text: "KEEP CAPABILITY / RELEASE PROJECT TOPOLOGY", x: mobile ? 195 : 1090, y: mobile ? 960 : 640, tone: "success" },
    ],
  };
};

const genkoProblem: StateResolver = (viewport) => {
  const mobile = viewport === "mobile";
  return {
    state: "genko-problem",
    index: "06A",
    name: "A personal product problem",
    shortName: "Problem",
    thesis: "The architecture changes because the problem changed",
    description:
      "The client topology has compressed. A personal need—to learn Japanese with a suitable free platform—now organizes product research.",
    annotation: "I WANTED TO LEARN JAPANESE",
    preferredComposition: "typography-integrated",
    canvasHeight: mobile ? 960 : undefined,
    nodes: mobile
      ? [
          node("connected-capability", "Connected system", "outcome", 105, 110, { emphasis: "branch", width: 175 }),
          node("client-capability", "Client delivery", "outcome", 285, 250, { emphasis: "branch", width: 170 }),
          node("shared-capability", "Shared architecture", "outcome", 105, 390, { emphasis: "branch", width: 185 }),
          node("personal-problem", "Learn Japanese", "idea", 195, 600, { emphasis: "primary", width: 185 }),
          node("product-research", "Product research", "evidence", 195, 790, { emphasis: "resolved", width: 195 }),
        ]
      : [
          node("connected-capability", "Connected system", "outcome", 125, 150, { emphasis: "branch", width: 190 }),
          node("client-capability", "Client delivery", "outcome", 125, 350, { emphasis: "branch", width: 180 }),
          node("shared-capability", "Shared architecture", "outcome", 125, 550, { emphasis: "branch", width: 205 }),
          node("personal-problem", "Learn Japanese", "idea", 590, 350, { emphasis: "primary", width: 185 }),
          node("product-research", "Product research", "evidence", 985, 350, { emphasis: "resolved", width: 195 }),
        ],
    edges: [
      { id: "problem-connected-client", from: "connected-capability", to: "client-capability", kind: "branch" },
      { id: "problem-client-shared", from: "client-capability", to: "shared-capability", kind: "branch" },
      { id: "problem-personal-research", from: "personal-problem", to: "product-research", kind: "primary" },
      { id: "problem-shared-research", from: "shared-capability", to: "product-research", kind: "transition" },
    ],
    events: [{ id: "personal-problem-event", from: "personal-problem", to: "product-research" }],
  };
};

const genkoLoop: StateResolver = (viewport) => {
  const mobile = viewport === "mobile";
  return {
    state: "genko-loop",
    index: "06B",
    name: "GENKŌ learning loop grows",
    shortName: "Learning loop",
    thesis: "Courses become a learning flow rather than another backend diagram",
    description:
      "Learn, practice, listen, write, and quiz organize the product around the learner. Further work remains scaffolded without implying breakage.",
    annotation: "LEARN → PRACTICE → LISTEN → WRITE → QUIZ",
    preferredComposition: "full-width",
    canvasHeight: mobile ? 1080 : undefined,
    groups: mobile
      ? [{ id: "genko-loop", label: "GENKŌ / LEARNING FLOW", x: 25, y: 65, width: 340, height: 910, tone: "rebuilt" }]
      : [{ id: "genko-loop", label: "GENKŌ / LEARNING FLOW", x: 65, y: 75, width: 1070, height: 540, tone: "rebuilt" }],
    nodes: mobile
      ? [
          node("learn", "Learn", "component", 195, 140, { emphasis: "primary", detail: "courses" }),
          node("practice", "Practice", "component", 195, 315),
          node("listen", "Listen", "component", 195, 490),
          node("write", "Write", "component", 195, 665),
          node("quiz", "Quiz", "component", 195, 840, { emphasis: "resolved" }),
        ]
      : [
          node("learn", "Learn", "component", 135, 350, { emphasis: "primary", detail: "courses" }),
          node("practice", "Practice", "component", 355, 350),
          node("listen", "Listen", "component", 575, 350),
          node("write", "Write", "component", 795, 350),
          node("quiz", "Quiz", "component", 1015, 350, { emphasis: "resolved" }),
        ],
    edges: [
      { id: "genko-learn-practice", from: "learn", to: "practice", kind: "primary" },
      { id: "genko-practice-listen", from: "practice", to: "listen", kind: "primary" },
      { id: "genko-listen-write", from: "listen", to: "write", kind: "primary" },
      { id: "genko-write-quiz", from: "write", to: "quiz", kind: "primary" },
    ],
    events: [{ id: "genko-practice-event", from: "learn", to: "quiz" }],
    callouts: [
      { id: "genko-scaffold", text: "USABLE PATH / FURTHER WORK SCAFFOLDED", x: mobile ? 195 : 1090, y: mobile ? 1015 : 645, tone: "muted" },
    ],
  };
};

const genkoAiProduct: StateResolver = (viewport) => {
  const mobile = viewport === "mobile";
  const positions = mobile
    ? [[195, 105], [195, 235], [195, 365], [195, 495], [195, 625], [195, 755], [195, 885]]
    : [[95, 350], [265, 350], [435, 350], [605, 350], [775, 350], [945, 350], [1110, 350]];
  return {
    state: "genko-ai-product",
    index: "06C",
    name: "AI inside the GENKŌ product",
    shortName: "AI product feature",
    thesis: "AI is one product capability inside the learning loop",
    description:
      "The learning flow continues through AI interaction and back into continued learning. This is product behavior—not yet the later engineering-workflow interpretation of AI.",
    annotation: "AI = PRODUCT FEATURE",
    preferredComposition: "full-width",
    canvasHeight: mobile ? 1040 : undefined,
    nodes: [
      node("learn", "Learn", "component", positions[0][0], positions[0][1], { emphasis: "primary", detail: "courses" }),
      node("practice", "Practice", "component", positions[1][0], positions[1][1]),
      node("listen", "Listen", "component", positions[2][0], positions[2][1]),
      node("write", "Write", "component", positions[3][0], positions[3][1]),
      node("quiz", "Quiz", "component", positions[4][0], positions[4][1]),
      node("ai-product", "AI interaction", "external", positions[5][0], positions[5][1], { emphasis: "external", width: 180, detail: "product feature" }),
      node("continue", "Continue", "outcome", positions[6][0], positions[6][1], { emphasis: "resolved" }),
    ],
    edges: [
      { id: "ai-learn-practice", from: "learn", to: "practice", kind: "primary" },
      { id: "ai-practice-listen", from: "practice", to: "listen", kind: "primary" },
      { id: "ai-listen-write", from: "listen", to: "write", kind: "primary" },
      { id: "ai-write-quiz", from: "write", to: "quiz", kind: "primary" },
      { id: "ai-quiz-product", from: "quiz", to: "ai-product", kind: "primary" },
      { id: "ai-product-continue", from: "ai-product", to: "continue", kind: "primary" },
      { id: "ai-continue-learn", from: "continue", to: "learn", kind: "feedback" },
    ],
    events: [{ id: "ai-learning-event", from: "quiz", to: "continue" }],
    callouts: [
      { id: "genko-status", text: "USABLE FOUNDATION / CONTINUING DEVELOPMENT", x: mobile ? 195 : 1085, y: mobile ? 990 : 640, tone: "success" },
    ],
  };
};

const genkoCapability: StateResolver = (viewport) => {
  const mobile = viewport === "mobile";
  return {
    state: "genko-capability",
    index: "06D",
    name: "GENKŌ capability extraction",
    shortName: "Product research",
    thesis: "The learning topology compresses while the product capability persists",
    description:
      "A subdued GENKŌ learning loop remains legible beside the accumulated backbone: interface, connected system, client delivery, shared architecture, and product research.",
    annotation: "GENKŌ → PRODUCT RESEARCH",
    preferredComposition: "full-width",
    canvasHeight: mobile ? 1320 : undefined,
    groups: mobile
      ? [
          { id: "genko-compressed-loop", label: "GENKŌ / USABLE FOUNDATION · CONTINUING DEVELOPMENT", x: 24, y: 65, width: 342, height: 570, tone: "legacy" },
          { id: "capability-backbone", label: "PERSISTENT CAPABILITY BACKBONE", x: 20, y: 700, width: 350, height: 545, tone: "capability" },
        ]
      : [
          { id: "genko-compressed-loop", label: "GENKŌ / USABLE FOUNDATION · CONTINUING DEVELOPMENT", x: 45, y: 85, width: 430, height: 520, tone: "legacy" },
          { id: "capability-backbone", label: "PERSISTENT CAPABILITY BACKBONE", x: 525, y: 85, width: 630, height: 520, tone: "capability" },
        ],
    nodes: mobile
      ? [
          node("learn", "Learn", "component", 100, 150, { emphasis: "branch" }),
          node("practice", "Practice", "component", 290, 150, { emphasis: "branch" }),
          node("listen", "Listen", "component", 100, 285, { emphasis: "branch" }),
          node("write", "Write", "component", 290, 285, { emphasis: "branch" }),
          node("quiz", "Quiz", "component", 100, 420, { emphasis: "branch" }),
          node("ai-product", "AI product", "external", 290, 420, { emphasis: "external", width: 145 }),
          node("continue", "Continue", "outcome", 195, 555, { emphasis: "resolved" }),
          node("interface-capability", "Interface", "outcome", 195, 765, { emphasis: "branch" }),
          node("connected-capability", "Connected system", "outcome", 195, 865, { emphasis: "branch", width: 195 }),
          node("client-capability", "Client delivery", "outcome", 195, 965, { emphasis: "branch", width: 180 }),
          node("shared-capability", "Shared architecture", "outcome", 195, 1065, { emphasis: "branch", width: 210 }),
          node("product-research", "Product research", "outcome", 195, 1165, { emphasis: "resolved", width: 195 }),
          node("ai-product-development", "AI-assisted product development", "outcome", 195, 1260, { emphasis: "resolved", width: 280 }),
        ]
      : [
          node("learn", "Learn", "component", 135, 170, { emphasis: "branch" }),
          node("practice", "Practice", "component", 365, 170, { emphasis: "branch" }),
          node("listen", "Listen", "component", 135, 315, { emphasis: "branch" }),
          node("write", "Write", "component", 365, 315, { emphasis: "branch" }),
          node("quiz", "Quiz", "component", 135, 460, { emphasis: "branch" }),
          node("ai-product", "AI product", "external", 365, 460, { emphasis: "external", width: 145 }),
          node("continue", "Continue", "outcome", 250, 560, { emphasis: "resolved" }),
          node("interface-capability", "Interface", "outcome", 650, 160, { emphasis: "branch" }),
          node("connected-capability", "Connected system", "outcome", 880, 160, { emphasis: "branch", width: 195 }),
          node("client-capability", "Client delivery", "outcome", 1045, 270, { emphasis: "branch", width: 180 }),
          node("shared-capability", "Shared architecture", "outcome", 1045, 440, { emphasis: "branch", width: 210 }),
          node("product-research", "Product research", "outcome", 810, 540, { emphasis: "resolved", width: 195 }),
          node("ai-product-development", "AI-assisted product development", "outcome", 620, 410, { emphasis: "resolved", width: 280 }),
        ],
    edges: [
      { id: "capability-loop-practice", from: "learn", to: "practice", kind: "branch" },
      { id: "capability-loop-listen", from: "practice", to: "listen", kind: "branch" },
      { id: "capability-loop-write", from: "listen", to: "write", kind: "branch" },
      { id: "capability-loop-quiz", from: "write", to: "quiz", kind: "branch" },
      { id: "capability-loop-ai", from: "quiz", to: "ai-product", kind: "branch" },
      { id: "capability-loop-continue", from: "ai-product", to: "continue", kind: "branch" },
      { id: "capability-interface-connected", from: "interface-capability", to: "connected-capability", kind: "branch" },
      { id: "capability-connected-client", from: "connected-capability", to: "client-capability", kind: "branch" },
      { id: "capability-client-shared", from: "client-capability", to: "shared-capability", kind: "branch" },
      { id: "capability-shared-research", from: "shared-capability", to: "product-research", kind: "branch" },
      { id: "capability-genko-research", from: "continue", to: "product-research", kind: "compression" },
      { id: "capability-research-ai", from: "product-research", to: "ai-product-development", kind: "branch" },
    ],
    events: [{ id: "genko-extraction", from: "continue", to: "product-research" }],
    callouts: [
      { id: "capability-status", text: "USABLE FOUNDATION / CONTINUING DEVELOPMENT", x: mobile ? 195 : 1100, y: mobile ? 1295 : 640, tone: "success" },
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

const aiWorkbench: StateResolver = (viewport) => {
  const mobile = viewport === "mobile";
  return {
    state: "ai-workbench",
    index: "07A",
    name: "AI moves from product to workbench",
    shortName: "AI boundary",
    thesis: "A product feature becomes one input to engineering work",
    description:
      "GENKŌ's AI interaction detaches from the learning topology and enters the workbench beside product research. It does not become the engineer.",
    annotation: "AI: PRODUCT FEATURE → ENGINEERING INPUT",
    preferredComposition: "full-width",
    canvasHeight: mobile ? 980 : undefined,
    nodes: mobile
      ? [
          node("genko-project", "GENKŌ", "evidence", 195, 110, { emphasis: "branch" }),
          node("ai-product", "AI interaction", "external", 195, 290, { emphasis: "external", width: 180, detail: "product feature" }),
          node("product-research", "Product research", "outcome", 195, 485, { emphasis: "branch", width: 195 }),
          node("workbench", "Engineering workbench", "service", 195, 700, { emphasis: "primary", width: 230 }),
          node("decision", "Engineering judgment", "decision", 195, 875, { emphasis: "primary", width: 220 }),
        ]
      : [
          node("genko-project", "GENKŌ", "evidence", 135, 350, { emphasis: "branch" }),
          node("ai-product", "AI interaction", "external", 365, 350, { emphasis: "external", width: 180, detail: "product feature" }),
          node("product-research", "Product research", "outcome", 590, 190, { emphasis: "branch", width: 195 }),
          node("workbench", "Engineering workbench", "service", 770, 350, { emphasis: "primary", width: 230 }),
          node("decision", "Engineering judgment", "decision", 1050, 350, { emphasis: "primary", width: 220 }),
        ],
    edges: [
      { id: "ai-boundary-genko", from: "genko-project", to: "ai-product", kind: "transition" },
      { id: "ai-boundary-product", from: "ai-product", to: "workbench", kind: "transition" },
      { id: "ai-boundary-research", from: "product-research", to: "workbench", kind: "branch" },
      { id: "ai-boundary-judgment", from: "workbench", to: "decision", kind: "primary" },
    ],
    events: [{ id: "ai-detaches", from: "ai-product", to: "workbench" }],
    callouts: [
      { id: "ai-not-engineer", text: "INPUT ≠ ENGINEER", x: mobile ? 195 : 1090, y: mobile ? 935 : 640, tone: "redline" },
    ],
  };
};

const aiProposals: StateResolver = (viewport) => {
  const mobile = viewport === "mobile";
  return {
    state: "ai-proposals",
    index: "07B",
    name: "Multiple proposal inputs",
    shortName: "Proposals",
    thesis: "AI is one source among documentation, repository, and the running system",
    description:
      "Research opens several proposal sources. None bypasses the workbench or enters the system directly.",
    annotation: "POSSIBILITIES ENTER THE WORKBENCH",
    preferredComposition: "full-width",
    canvasHeight: mobile ? 1120 : undefined,
    groups: mobile
      ? [{ id: "proposal-inputs", label: "PROPOSAL INPUTS", x: 22, y: 255, width: 346, height: 475, tone: "frontend" }]
      : [{ id: "proposal-inputs", label: "PROPOSAL INPUTS", x: 315, y: 80, width: 550, height: 535, tone: "frontend" }],
    nodes: mobile
      ? [
          node("problem", "Problem", "idea", 195, 90),
          node("research", "Research", "evidence", 195, 210, { emphasis: "primary" }),
          node("ai-product", "AI systems", "external", 100, 355, { emphasis: "external" }),
          node("documentation", "Documentation", "evidence", 290, 355, { width: 150 }),
          node("repository", "Repository", "evidence", 100, 525),
          node("running-system", "Running system", "evidence", 290, 525, { width: 160 }),
          node("compare-approaches", "Compare approaches", "diagnosis", 195, 665, { emphasis: "primary", width: 210 }),
          node("workbench", "Engineering workbench", "service", 195, 850, { emphasis: "primary", width: 230 }),
          node("decision", "Engineering decision", "decision", 195, 1010, { emphasis: "branch", width: 220 }),
        ]
      : [
          node("problem", "Problem", "idea", 95, 350),
          node("research", "Research", "evidence", 250, 350, { emphasis: "primary" }),
          node("ai-product", "AI systems", "external", 420, 180, { emphasis: "external" }),
          node("documentation", "Documentation", "evidence", 650, 180, { width: 150 }),
          node("repository", "Repository", "evidence", 420, 500),
          node("running-system", "Running system", "evidence", 650, 500, { width: 160 }),
          node("compare-approaches", "Compare approaches", "diagnosis", 790, 350, { emphasis: "primary", width: 210 }),
          node("workbench", "Workbench", "service", 990, 230, { emphasis: "primary" }),
          node("decision", "Engineering decision", "decision", 1045, 470, { emphasis: "branch", width: 220 }),
        ],
    edges: [
      { id: "proposal-problem-research", from: "problem", to: "research", kind: "primary" },
      { id: "proposal-research-ai", from: "research", to: "ai-product", kind: "branch" },
      { id: "proposal-research-docs", from: "research", to: "documentation", kind: "branch" },
      { id: "proposal-research-repo", from: "research", to: "repository", kind: "branch" },
      { id: "proposal-research-running", from: "research", to: "running-system", kind: "branch" },
      { id: "proposal-ai-compare", from: "ai-product", to: "compare-approaches", kind: "branch" },
      { id: "proposal-docs-compare", from: "documentation", to: "compare-approaches", kind: "branch" },
      { id: "proposal-repo-compare", from: "repository", to: "compare-approaches", kind: "branch" },
      { id: "proposal-running-compare", from: "running-system", to: "compare-approaches", kind: "branch" },
      { id: "proposal-compare-workbench", from: "compare-approaches", to: "workbench", kind: "primary" },
      { id: "proposal-workbench-decision", from: "workbench", to: "decision", kind: "primary" },
    ],
    events: [{ id: "proposal-convergence", from: "research", to: "compare-approaches" }],
  };
};

const aiEvaluation: StateResolver = (viewport) => {
  const mobile = viewport === "mobile";
  return {
    state: "ai-evaluation",
    index: "07C",
    name: "Engineering evaluation gate",
    shortName: "Evaluation",
    thesis: "Possibilities stop at engineering judgment before they reach implementation",
    description:
      "AI, documentation, repository evidence, and the running system converge on one decision boundary that can accept, revise, reject, or research again.",
    annotation: "POSSIBILITIES → ENGINEERING JUDGMENT",
    preferredComposition: "full-width",
    canvasHeight: mobile ? 1160 : undefined,
    nodes: mobile
      ? [
          node("ai-product", "AI systems", "external", 90, 110, { emphasis: "external" }),
          node("documentation", "Documentation", "evidence", 300, 110, { width: 150 }),
          node("repository", "Repository", "evidence", 90, 270),
          node("running-system", "Running system", "evidence", 300, 270, { width: 160 }),
          node("workbench", "Engineering workbench", "service", 195, 455, { emphasis: "primary", width: 230 }),
          node("decision", "Engineering decision", "decision", 195, 640, { emphasis: "primary", width: 220 }),
          node("accept", "Accept", "outcome", 65, 820, { emphasis: "resolved" }),
          node("revise", "Revise", "outcome", 195, 820, { emphasis: "branch" }),
          node("reject", "Reject", "outcome", 325, 820, { emphasis: "branch" }),
          node("research-again", "Research again", "evidence", 195, 1015, { emphasis: "branch", width: 165 }),
        ]
      : [
          node("ai-product", "AI systems", "external", 130, 150, { emphasis: "external" }),
          node("documentation", "Documentation", "evidence", 130, 300, { width: 150 }),
          node("repository", "Repository", "evidence", 130, 450),
          node("running-system", "Running system", "evidence", 130, 600, { width: 160 }),
          node("workbench", "Engineering workbench", "service", 465, 350, { emphasis: "primary", width: 230 }),
          node("decision", "Engineering decision", "decision", 750, 350, { emphasis: "primary", width: 220 }),
          node("accept", "Accept", "outcome", 1035, 125, { emphasis: "resolved" }),
          node("revise", "Revise", "outcome", 1035, 275, { emphasis: "branch" }),
          node("reject", "Reject", "outcome", 1035, 425, { emphasis: "branch" }),
          node("research-again", "Research again", "evidence", 1035, 575, { emphasis: "branch", width: 165 }),
        ],
    edges: [
      { id: "evaluation-ai-workbench", from: "ai-product", to: "workbench", kind: "branch" },
      { id: "evaluation-docs-workbench", from: "documentation", to: "workbench", kind: "branch" },
      { id: "evaluation-repo-workbench", from: "repository", to: "workbench", kind: "branch" },
      { id: "evaluation-running-workbench", from: "running-system", to: "workbench", kind: "branch" },
      { id: "evaluation-workbench-decision", from: "workbench", to: "decision", kind: "primary" },
      { id: "evaluation-accept", from: "decision", to: "accept", kind: "branch" },
      { id: "evaluation-revise", from: "decision", to: "revise", kind: "branch" },
      { id: "evaluation-reject", from: "decision", to: "reject", kind: "branch" },
      { id: "evaluation-research", from: "decision", to: "research-again", kind: "feedback" },
    ],
    events: [{ id: "evaluation-gate", from: "workbench", to: "decision" }],
    callouts: [
      { id: "evaluation-boundary", text: "NOTHING BYPASSES JUDGMENT", x: mobile ? 195 : 1090, y: mobile ? 1100 : 650, tone: "redline" },
    ],
  };
};

const aiWorkflow: StateResolver = (viewport) => {
  const mobile = viewport === "mobile";
  return {
    state: "ai-workflow",
    index: "07D",
    name: "AI-assisted engineering workflow",
    shortName: "Workflow",
    thesis: "Judgment determines which accelerated possibility becomes part of the system",
    description:
      "Proposal inputs pass through engineering decision, inspection, and debugging before implementation, testing, and a working system. Rejected paths return to research.",
    annotation: "POSSIBILITIES → JUDGMENT → SYSTEM",
    preferredComposition: "full-width",
    canvasHeight: mobile ? 1360 : undefined,
    nodes: mobile
      ? [
          node("ai-product", "AI systems", "external", 90, 90, { emphasis: "external" }),
          node("documentation", "Documentation", "evidence", 300, 90, { width: 150 }),
          node("repository", "Repository", "evidence", 90, 225),
          node("running-system", "Running system", "evidence", 300, 225, { width: 160 }),
          node("decision", "Engineering decision", "decision", 195, 410, { emphasis: "primary", width: 220 }),
          node("accept", "Accept", "outcome", 65, 575, { emphasis: "resolved" }),
          node("revise", "Revise", "outcome", 195, 575, { emphasis: "branch" }),
          node("reject", "Reject", "outcome", 325, 575, { emphasis: "branch" }),
          node("research-again", "Research again", "evidence", 195, 725, { emphasis: "branch", width: 165 }),
          node("implement", "Implement", "service", 195, 890, { emphasis: "primary" }),
          node("inspect", "Inspect", "diagnosis", 105, 1045),
          node("debug", "Debug", "diagnosis", 285, 1045),
          node("test", "Test", "evidence", 195, 1180),
          node("working", "Working system", "outcome", 195, 1300, { emphasis: "resolved", width: 165 }),
        ]
      : [
          node("ai-product", "AI systems", "external", 105, 120, { emphasis: "external" }),
          node("documentation", "Documentation", "evidence", 105, 275, { width: 150 }),
          node("repository", "Repository", "evidence", 105, 430),
          node("running-system", "Running system", "evidence", 105, 585, { width: 160 }),
          node("decision", "Engineering decision", "decision", 405, 350, { emphasis: "primary", width: 220 }),
          node("accept", "Accept", "outcome", 650, 170, { emphasis: "resolved" }),
          node("revise", "Revise", "outcome", 650, 350, { emphasis: "branch" }),
          node("reject", "Reject", "outcome", 650, 530, { emphasis: "branch" }),
          node("research-again", "Research again", "evidence", 860, 575, { emphasis: "branch", width: 165 }),
          node("implement", "Implement", "service", 860, 170, { emphasis: "primary" }),
          node("inspect", "Inspect", "diagnosis", 1040, 100),
          node("debug", "Debug", "diagnosis", 1040, 245),
          node("test", "Test", "evidence", 1040, 390),
          node("working", "Working system", "outcome", 1040, 535, { emphasis: "resolved", width: 165 }),
        ],
    edges: [
      { id: "workflow-ai-decision", from: "ai-product", to: "decision", kind: "branch" },
      { id: "workflow-docs-decision", from: "documentation", to: "decision", kind: "branch" },
      { id: "workflow-repo-decision", from: "repository", to: "decision", kind: "branch" },
      { id: "workflow-running-decision", from: "running-system", to: "decision", kind: "branch" },
      { id: "workflow-accept", from: "decision", to: "accept", kind: "branch" },
      { id: "workflow-revise", from: "decision", to: "revise", kind: "branch" },
      { id: "workflow-reject", from: "decision", to: "reject", kind: "branch" },
      { id: "workflow-revise-research", from: "revise", to: "research-again", kind: "feedback" },
      { id: "workflow-reject-research", from: "reject", to: "research-again", kind: "feedback" },
      { id: "workflow-accept-implement", from: "accept", to: "implement", kind: "primary" },
      { id: "workflow-implement-inspect", from: "implement", to: "inspect", kind: "primary" },
      { id: "workflow-inspect-debug", from: "inspect", to: "debug", kind: "primary" },
      { id: "workflow-debug-test", from: "debug", to: "test", kind: "primary" },
      { id: "workflow-test-working", from: "test", to: "working", kind: "primary" },
      { id: "workflow-research-decision", from: "research-again", to: "decision", kind: "feedback" },
    ],
    events: [
      { id: "workflow-proposal-event", from: "ai-product", to: "decision" },
      { id: "workflow-build-event", from: "accept", to: "working", delay: 0.8 },
    ],
  };
};

const aiCapability: StateResolver = (viewport) => {
  const mobile = viewport === "mobile";
  return {
    state: "ai-capability",
    index: "07E",
    name: "AI-assisted engineering extracted",
    shortName: "AI capability",
    thesis: "The workflow compresses into a capability governed by engineering judgment",
    description:
      "The decision boundary remains visible while the detailed workflow becomes AI-assisted engineering within the accumulated capability graph.",
    annotation: "WORKFLOW → AI-ASSISTED ENGINEERING",
    preferredComposition: "typography-integrated",
    canvasHeight: mobile ? 1080 : undefined,
    nodes: mobile
      ? [
          node("product-research", "Product research", "outcome", 195, 100, { emphasis: "branch", width: 190 }),
          node("ai-product", "AI systems", "external", 90, 280, { emphasis: "external" }),
          node("documentation", "Documentation", "evidence", 300, 280, { width: 150 }),
          node("decision", "Engineering decision", "decision", 195, 470, { emphasis: "primary", width: 220 }),
          node("working", "Working system", "outcome", 195, 660, { emphasis: "resolved", width: 165 }),
          node("ai-engineering-capability", "AI-assisted engineering", "outcome", 195, 865, { emphasis: "resolved", width: 255, detail: "judgment remains responsible" }),
        ]
      : [
          node("product-research", "Product research", "outcome", 125, 180, { emphasis: "branch", width: 190 }),
          node("ai-product", "AI systems", "external", 125, 480, { emphasis: "external" }),
          node("documentation", "Documentation", "evidence", 380, 180, { width: 150 }),
          node("decision", "Engineering decision", "decision", 600, 350, { emphasis: "primary", width: 220 }),
          node("working", "Working system", "outcome", 840, 350, { emphasis: "resolved", width: 165 }),
          node("ai-engineering-capability", "AI-assisted engineering", "outcome", 1060, 350, { emphasis: "resolved", width: 255, detail: "judgment remains responsible" }),
        ],
    edges: [
      { id: "ai-cap-research-decision", from: "product-research", to: "decision", kind: "branch" },
      { id: "ai-cap-ai-decision", from: "ai-product", to: "decision", kind: "branch" },
      { id: "ai-cap-doc-decision", from: "documentation", to: "decision", kind: "branch" },
      { id: "ai-cap-decision-working", from: "decision", to: "working", kind: "primary" },
      { id: "ai-cap-compress", from: "working", to: "ai-engineering-capability", kind: "compression" },
    ],
    events: [{ id: "ai-cap-event", from: "working", to: "ai-engineering-capability" }],
  };
};

const quantxProblem: StateResolver = (viewport) => {
  const mobile = viewport === "mobile";
  return {
    state: "quantx-problem",
    index: "08A",
    name: "Recurring trading problem",
    shortName: "QuantX problem",
    thesis: "A less deterministic problem demands experimentation rather than a fixed answer",
    description:
      "Manual chart monitoring, placing orders, and remembering when to sell create the motivation. Missing the right selling moment can lose money; no successful automation is implied.",
    annotation: "MANUAL MONITORING → RECURRING DECISION PROBLEM",
    preferredComposition: "full-width",
    canvasHeight: mobile ? 950 : undefined,
    nodes: mobile
      ? [
          node("ai-engineering-capability", "AI-assisted engineering", "outcome", 195, 100, { emphasis: "branch", width: 250 }),
          node("problem", "Manual trading problem", "idea", 195, 310, { emphasis: "primary", width: 235 }),
          node("market-information", "Market information", "external", 195, 530, { emphasis: "external", width: 205 }),
          node("analysis", "Analysis needed", "diagnosis", 195, 750, { emphasis: "branch", width: 180 }),
        ]
      : [
          node("ai-engineering-capability", "AI-assisted engineering", "outcome", 145, 350, { emphasis: "branch", width: 250 }),
          node("problem", "Manual trading problem", "idea", 455, 350, { emphasis: "primary", width: 235 }),
          node("market-information", "Market information", "external", 760, 350, { emphasis: "external", width: 205 }),
          node("analysis", "Analysis needed", "diagnosis", 1045, 350, { emphasis: "branch", width: 180 }),
        ],
    edges: [
      { id: "quantx-capability-problem", from: "ai-engineering-capability", to: "problem", kind: "transition" },
      { id: "quantx-problem-market", from: "problem", to: "market-information", kind: "primary" },
      { id: "quantx-market-analysis", from: "market-information", to: "analysis", kind: "primary" },
    ],
    events: [{ id: "quantx-problem-event", from: "problem", to: "analysis" }],
    callouts: [
      { id: "quantx-no-claim", text: "NO PROFITABILITY CLAIM", x: mobile ? 195 : 1090, y: mobile ? 890 : 640, tone: "redline" },
    ],
  };
};

const marketPipeline: StateResolver = (viewport) => {
  const mobile = viewport === "mobile";
  return {
    state: "market-pipeline",
    index: "08B",
    name: "Market analysis pipeline",
    shortName: "Pipeline",
    thesis: "Market information must be transformed before a model can evaluate it",
    description:
      "The experimental pipeline grows from market information through analysis and features toward a model boundary. It does not yet imply an action.",
    annotation: "MARKET → ANALYSIS → FEATURES → MODEL",
    preferredComposition: "full-width",
    canvasHeight: mobile ? 1040 : undefined,
    nodes: mobile
      ? [
          node("market-information", "Market information", "external", 195, 120, { emphasis: "external", width: 205 }),
          node("analysis", "Analysis", "diagnosis", 195, 335, { emphasis: "primary" }),
          node("features", "Features", "data", 195, 550),
          node("model", "Model boundary", "decision", 195, 765, { emphasis: "branch", width: 185 }),
          node("unresolved", "Unresolved", "outcome", 195, 930, { emphasis: "branch" }),
        ]
      : [
          node("market-information", "Market information", "external", 130, 350, { emphasis: "external", width: 205 }),
          node("analysis", "Analysis", "diagnosis", 390, 350, { emphasis: "primary" }),
          node("features", "Features", "data", 640, 350),
          node("model", "Model boundary", "decision", 890, 350, { emphasis: "branch", width: 185 }),
          node("unresolved", "Unresolved", "outcome", 1090, 520, { emphasis: "branch" }),
        ],
    edges: [
      { id: "pipeline-market-analysis", from: "market-information", to: "analysis", kind: "primary" },
      { id: "pipeline-analysis-features", from: "analysis", to: "features", kind: "primary" },
      { id: "pipeline-features-model", from: "features", to: "model", kind: "primary" },
      { id: "pipeline-model-unresolved", from: "model", to: "unresolved", kind: "branch" },
    ],
    events: [{ id: "market-pipeline-event", from: "market-information", to: "model" }],
  };
};

const modelBranching: StateResolver = (viewport) => {
  const mobile = viewport === "mobile";
  return {
    state: "model-branching",
    index: "08C",
    name: "Experimental model branches",
    shortName: "Models",
    thesis: "Several model approaches remain experiments; none is declared the winner",
    description:
      "XGBoost, LSTM, and other experimental approaches branch from the same feature input. Insufficient confidence and unresolved paths remain first-class outcomes.",
    annotation: "XGBOOST / LSTM / OTHER EXPERIMENTATION",
    preferredComposition: "full-width",
    canvasHeight: mobile ? 1210 : undefined,
    nodes: mobile
      ? [
          node("features", "Features", "data", 195, 105),
          node("model", "Model experiments", "decision", 195, 280, { emphasis: "primary", width: 190 }),
          node("xgboost", "XGBoost", "component", 70, 475),
          node("lstm", "LSTM", "component", 195, 475),
          node("experimental-model", "Experimental", "component", 320, 475, { width: 145 }),
          node("decision", "Decision candidate", "decision", 195, 690, { emphasis: "branch", width: 190 }),
          node("insufficient-confidence", "Insufficient confidence", "outcome", 195, 880, { emphasis: "branch", width: 225 }),
          node("unresolved", "Unresolved", "outcome", 195, 1060, { emphasis: "branch" }),
        ]
      : [
          node("features", "Features", "data", 105, 350),
          node("model", "Model experiments", "decision", 325, 350, { emphasis: "primary", width: 190 }),
          node("xgboost", "XGBoost", "component", 585, 145),
          node("lstm", "LSTM", "component", 585, 350),
          node("experimental-model", "Experimental", "component", 585, 555, { width: 145 }),
          node("decision", "Decision candidate", "decision", 855, 350, { emphasis: "branch", width: 190 }),
          node("insufficient-confidence", "Insufficient confidence", "outcome", 1080, 225, { emphasis: "branch", width: 225 }),
          node("unresolved", "Unresolved", "outcome", 1080, 500, { emphasis: "branch" }),
        ],
    edges: [
      { id: "models-features-boundary", from: "features", to: "model", kind: "primary" },
      { id: "models-xgboost", from: "model", to: "xgboost", kind: "branch" },
      { id: "models-lstm", from: "model", to: "lstm", kind: "branch" },
      { id: "models-experimental", from: "model", to: "experimental-model", kind: "branch" },
      { id: "models-xgboost-decision", from: "xgboost", to: "decision", kind: "branch" },
      { id: "models-lstm-decision", from: "lstm", to: "decision", kind: "branch" },
      { id: "models-experimental-decision", from: "experimental-model", to: "decision", kind: "branch" },
      { id: "models-low-confidence", from: "decision", to: "insufficient-confidence", kind: "branch" },
      { id: "models-unresolved", from: "decision", to: "unresolved", kind: "branch" },
    ],
    events: [{ id: "model-experiment-event", from: "features", to: "decision" }],
  };
};

const decisionGates: StateResolver = (viewport) => {
  const mobile = viewport === "mobile";
  return {
    state: "decision-gates",
    index: "08D",
    name: "Decision and risk gates",
    shortName: "Gates",
    thesis: "A model output is not automatically an action",
    description:
      "Experimental model outputs pass through decision and risk gates. Valid terminal paths include execution, no action, insufficient confidence, risk rejection, and unresolved research.",
    annotation: "MODEL OUTPUT ≠ ACTION",
    preferredComposition: "full-width",
    canvasHeight: mobile ? 1470 : undefined,
    nodes: mobile
      ? [
          node("market-information", "Market", "external", 195, 75, { emphasis: "external" }),
          node("analysis", "Analysis", "diagnosis", 195, 210),
          node("model", "Model experiments", "decision", 195, 350, { emphasis: "primary", width: 190 }),
          node("xgboost", "XGBoost", "component", 90, 500),
          node("lstm", "LSTM", "component", 300, 500),
          node("experimental-model", "Experimental", "component", 195, 625, { width: 145 }),
          node("decision", "Decision gate", "decision", 195, 755, { emphasis: "primary", width: 175 }),
          node("insufficient-confidence", "Insufficient confidence", "outcome", 195, 890, { emphasis: "branch", width: 225 }),
          node("risk", "Risk gate", "decision", 195, 1040, { emphasis: "primary" }),
          node("execution", "Execution", "service", 80, 1200, { emphasis: "branch" }),
          node("no-action", "No action", "outcome", 195, 1200, { emphasis: "branch" }),
          node("risk-rejected", "Risk rejected", "outcome", 310, 1200, { emphasis: "branch", width: 145 }),
          node("outcome", "Outcome unknown", "outcome", 80, 1360, { emphasis: "branch", width: 160 }),
          node("unresolved", "Unresolved", "outcome", 300, 1360, { emphasis: "branch" }),
        ]
      : [
          node("market-information", "Market", "external", 70, 350, { emphasis: "external" }),
          node("analysis", "Analysis", "diagnosis", 220, 350),
          node("model", "Model experiments", "decision", 400, 350, { emphasis: "primary", width: 190 }),
          node("xgboost", "XGBoost", "component", 580, 170),
          node("experimental-model", "Experimental", "component", 580, 350, { width: 145 }),
          node("lstm", "LSTM", "component", 580, 530),
          node("decision", "Decision gate", "decision", 735, 350, { emphasis: "primary", width: 175 }),
          node("insufficient-confidence", "Insufficient confidence", "outcome", 735, 590, { emphasis: "branch", width: 225 }),
          node("risk", "Risk gate", "decision", 900, 350, { emphasis: "primary" }),
          node("execution", "Execution", "service", 1080, 155, { emphasis: "branch" }),
          node("no-action", "No action", "outcome", 1080, 285, { emphasis: "branch" }),
          node("risk-rejected", "Risk rejected", "outcome", 1080, 415, { emphasis: "branch", width: 145 }),
          node("outcome", "Outcome unknown", "outcome", 1080, 545, { emphasis: "branch", width: 160 }),
          node("unresolved", "Unresolved", "outcome", 900, 590, { emphasis: "branch" }),
        ],
    edges: [
      { id: "gates-market-analysis", from: "market-information", to: "analysis", kind: "primary" },
      { id: "gates-analysis-model", from: "analysis", to: "model", kind: "primary" },
      { id: "gates-model-xgboost", from: "model", to: "xgboost", kind: "branch" },
      { id: "gates-model-experimental", from: "model", to: "experimental-model", kind: "branch" },
      { id: "gates-model-lstm", from: "model", to: "lstm", kind: "branch" },
      { id: "gates-xgboost-decision", from: "xgboost", to: "decision", kind: "branch" },
      { id: "gates-experimental-decision", from: "experimental-model", to: "decision", kind: "branch" },
      { id: "gates-lstm-decision", from: "lstm", to: "decision", kind: "branch" },
      { id: "gates-low-confidence", from: "decision", to: "insufficient-confidence", kind: "branch" },
      { id: "gates-decision-risk", from: "decision", to: "risk", kind: "primary" },
      { id: "gates-risk-execution", from: "risk", to: "execution", kind: "branch" },
      { id: "gates-risk-no-action", from: "risk", to: "no-action", kind: "branch" },
      { id: "gates-risk-rejected", from: "risk", to: "risk-rejected", kind: "branch" },
      { id: "gates-execution-outcome", from: "execution", to: "outcome", kind: "branch" },
      { id: "gates-outcome-unresolved", from: "outcome", to: "unresolved", kind: "feedback" },
    ],
    events: [{ id: "decision-gate-event", from: "model", to: "risk" }],
    callouts: [
      { id: "quantx-status", text: "UNFINISHED ACTIVE EXPERIMENT", x: mobile ? 195 : 1090, y: mobile ? 1430 : 650, tone: "redline" },
    ],
  };
};

const quantxCapability: StateResolver = (viewport) => {
  const mobile = viewport === "mobile";
  return {
    state: "quantx-capability",
    index: "08E",
    name: "Unfinished QuantX capability",
    shortName: "ML experimentation",
    thesis: "Unresolved experiment branches can still develop reusable decision-system capability",
    description:
      "A condensed market-to-risk pipeline remains visibly unfinished while QuantX contributes ML experimentation and decision systems to the accumulated graph.",
    annotation: "QUANTX → ML EXPERIMENTATION / UNRESOLVED",
    preferredComposition: "full-width",
    canvasHeight: mobile ? 1240 : undefined,
    groups: mobile
      ? [
          { id: "quantx-condensed", label: "QUANTX / UNFINISHED ACTIVE EXPERIMENT", x: 22, y: 65, width: 346, height: 720, tone: "legacy" },
          { id: "quantx-extracted", label: "PERSISTENT CAPABILITY", x: 22, y: 840, width: 346, height: 315, tone: "capability" },
        ]
      : [
          { id: "quantx-condensed", label: "QUANTX / UNFINISHED ACTIVE EXPERIMENT", x: 45, y: 80, width: 755, height: 540, tone: "legacy" },
          { id: "quantx-extracted", label: "PERSISTENT CAPABILITY", x: 845, y: 80, width: 310, height: 540, tone: "capability" },
        ],
    nodes: mobile
      ? [
          node("market-information", "Market", "external", 195, 125, { emphasis: "external" }),
          node("analysis", "Analysis", "diagnosis", 195, 260),
          node("model", "Model branches", "decision", 195, 395, { emphasis: "branch", width: 175 }),
          node("decision", "Decision", "decision", 195, 530, { emphasis: "branch" }),
          node("risk", "Risk", "decision", 195, 665, { emphasis: "branch" }),
          node("unresolved", "Unresolved", "outcome", 195, 750, { emphasis: "branch" }),
          node("quantx-project", "QuantX", "evidence", 195, 905, { emphasis: "branch" }),
          node("experiment-capability", "ML experimentation", "outcome", 195, 1070, { emphasis: "resolved", width: 220, detail: "decision systems" }),
        ]
      : [
          node("market-information", "Market", "external", 120, 350, { emphasis: "external" }),
          node("analysis", "Analysis", "diagnosis", 270, 350),
          node("model", "Model branches", "decision", 440, 350, { emphasis: "branch", width: 175 }),
          node("decision", "Decision", "decision", 605, 230, { emphasis: "branch" }),
          node("risk", "Risk", "decision", 605, 470, { emphasis: "branch" }),
          node("unresolved", "Unresolved", "outcome", 755, 470, { emphasis: "branch" }),
          node("quantx-project", "QuantX", "evidence", 990, 235, { emphasis: "branch" }),
          node("experiment-capability", "ML experimentation", "outcome", 990, 470, { emphasis: "resolved", width: 220, detail: "decision systems" }),
        ],
    edges: [
      { id: "quantx-cap-market-analysis", from: "market-information", to: "analysis", kind: "branch" },
      { id: "quantx-cap-analysis-model", from: "analysis", to: "model", kind: "branch" },
      { id: "quantx-cap-model-decision", from: "model", to: "decision", kind: "branch" },
      { id: "quantx-cap-decision-risk", from: "decision", to: "risk", kind: "branch" },
      { id: "quantx-cap-risk-unresolved", from: "risk", to: "unresolved", kind: "feedback" },
      { id: "quantx-cap-project", from: "unresolved", to: "quantx-project", kind: "transition" },
      { id: "quantx-cap-compress", from: "quantx-project", to: "experiment-capability", kind: "compression" },
    ],
    events: [{ id: "quantx-extract-event", from: "quantx-project", to: "experiment-capability" }],
    callouts: [
      { id: "quantx-claim", text: "NO PROFITABILITY / ACCURACY / RETURN CLAIM", x: mobile ? 195 : 1090, y: mobile ? 1185 : 655, tone: "redline" },
    ],
  };
};

const accumulatedSystem: StateResolver = (viewport) => {
  const mobile = viewport === "mobile";
  const items = [
    ["interface-capability", "Interface"],
    ["connected-capability", "Connected system"],
    ["client-capability", "Client delivery"],
    ["shared-capability", "Shared architecture"],
    ["product-research", "Product research"],
    ["ai-engineering-capability", "AI-assisted engineering"],
    ["experiment-capability", "ML experimentation"],
  ] as const;
  return {
    state: "accumulated-system",
    index: "09A",
    name: "Accumulated capability system",
    shortName: "Accumulated system",
    thesis: "Project topology recedes; connected capability remains",
    description:
      "Seven accumulated capabilities form one living backbone rather than a skills list. Each was developed through earlier work and remains available to the current build process.",
    annotation: "ACCUMULATED CAPABILITY / NOT A FINISH LINE",
    preferredComposition: "full-width",
    canvasHeight: mobile ? 1080 : undefined,
    nodes: items.map(([id, label], index) =>
      node(
        id,
        label,
        "outcome",
        mobile ? 195 : 115 + index * 160,
        mobile ? 105 + index * 140 : 350,
        { emphasis: index === items.length - 1 ? "resolved" : "branch", width: label.length > 18 ? 235 : 185 },
      ),
    ),
    edges: items.slice(0, -1).map(([id], index) => ({
      id: `accumulated-${index}`,
      from: id,
      to: items[index + 1][0],
      kind: "branch" as const,
    })),
    events: [{ id: "accumulated-path", from: "interface-capability", to: "experiment-capability" }],
  };
};

const capabilityProvenance: StateResolver = (viewport) => {
  const mobile = viewport === "mobile";
  return {
    state: "capability-provenance",
    index: "09B",
    name: "Capability with provenance",
    shortName: "Provenance",
    thesis: "Every persistent capability points back to work that developed it",
    description:
      "Restrained provenance markers connect early web work and multiple products, BellyBasket, Duforge, CraveCart, GENKŌ, the development workflow, and QuantX to the accumulated backbone.",
    annotation: "CAPABILITY ← PROVENANCE",
    preferredComposition: "full-width",
    canvasHeight: mobile ? 1460 : undefined,
    groups: mobile
      ? [{ id: "provenance-stack", label: "ACCUMULATED CAPABILITY + SOURCE", x: 20, y: 60, width: 350, height: 1310, tone: "capability" }]
      : [{ id: "provenance-stack", label: "ACCUMULATED CAPABILITY + RESTRAINED PROVENANCE", x: 40, y: 75, width: 1120, height: 550, tone: "capability" }],
    nodes: mobile
      ? [
          node("early-work", "Early web work / products", "evidence", 105, 125, { emphasis: "branch", width: 205 }),
          node("interface-capability", "Interface", "outcome", 290, 125, { emphasis: "resolved" }),
          node("bellybasket-project", "BellyBasket", "evidence", 105, 310, { emphasis: "branch" }),
          node("connected-capability", "Connected system", "outcome", 290, 310, { emphasis: "resolved", width: 185 }),
          node("duforge-work", "Duforge", "evidence", 105, 495, { emphasis: "branch" }),
          node("client-capability", "Client delivery", "outcome", 290, 495, { emphasis: "resolved", width: 170 }),
          node("cravecart-project", "CraveCart", "evidence", 105, 680, { emphasis: "branch" }),
          node("shared-capability", "Shared architecture", "outcome", 290, 680, { emphasis: "resolved", width: 205 }),
          node("genko-project", "GENKŌ", "evidence", 105, 865, { emphasis: "branch" }),
          node("product-research", "Product research", "outcome", 290, 865, { emphasis: "resolved", width: 185 }),
          node("workflow-provenance", "Development workflow", "evidence", 80, 1050, { emphasis: "branch", width: 190, detail: "GENKŌ" }),
          node("ai-engineering-capability", "AI-assisted engineering", "outcome", 300, 1050, { emphasis: "resolved", width: 225 }),
          node("quantx-project", "QuantX", "evidence", 105, 1235, { emphasis: "branch" }),
          node("experiment-capability", "ML experimentation", "outcome", 290, 1235, { emphasis: "resolved", width: 205 }),
        ]
      : [
          node("early-work", "Early web work / products", "evidence", 130, 140, { emphasis: "branch", width: 205 }),
          node("interface-capability", "Interface", "outcome", 390, 140, { emphasis: "resolved" }),
          node("bellybasket-project", "BellyBasket", "evidence", 130, 300, { emphasis: "branch" }),
          node("connected-capability", "Connected system", "outcome", 390, 300, { emphasis: "resolved", width: 185 }),
          node("duforge-work", "Duforge", "evidence", 130, 460, { emphasis: "branch" }),
          node("client-capability", "Client delivery", "outcome", 390, 460, { emphasis: "resolved", width: 170 }),
          node("cravecart-project", "CraveCart", "evidence", 650, 140, { emphasis: "branch" }),
          node("shared-capability", "Shared architecture", "outcome", 950, 140, { emphasis: "resolved", width: 205 }),
          node("genko-project", "GENKŌ", "evidence", 650, 300, { emphasis: "branch" }),
          node("product-research", "Product research", "outcome", 950, 300, { emphasis: "resolved", width: 185 }),
          node("workflow-provenance", "Development workflow / GENKŌ", "evidence", 650, 460, { emphasis: "branch", width: 230 }),
          node("ai-engineering-capability", "AI-assisted engineering", "outcome", 950, 460, { emphasis: "resolved", width: 225 }),
          node("quantx-project", "QuantX", "evidence", 650, 580, { emphasis: "branch" }),
          node("experiment-capability", "ML experimentation", "outcome", 950, 580, { emphasis: "resolved", width: 205 }),
        ],
    edges: [
      { id: "prov-interface", from: "early-work", to: "interface-capability", kind: "compression" },
      { id: "prov-connected", from: "bellybasket-project", to: "connected-capability", kind: "compression" },
      { id: "prov-client", from: "duforge-work", to: "client-capability", kind: "compression" },
      { id: "prov-shared", from: "cravecart-project", to: "shared-capability", kind: "compression" },
      { id: "prov-product", from: "genko-project", to: "product-research", kind: "compression" },
      { id: "prov-ai", from: "workflow-provenance", to: "ai-engineering-capability", kind: "compression" },
      { id: "prov-ml", from: "quantx-project", to: "experiment-capability", kind: "compression" },
      { id: "prov-cap-interface-connected", from: "interface-capability", to: "connected-capability", kind: "branch" },
      { id: "prov-cap-connected-client", from: "connected-capability", to: "client-capability", kind: "branch" },
      { id: "prov-cap-client-shared", from: "client-capability", to: "shared-capability", kind: "branch" },
      { id: "prov-cap-shared-product", from: "shared-capability", to: "product-research", kind: "branch" },
      { id: "prov-cap-product-ai", from: "product-research", to: "ai-engineering-capability", kind: "branch" },
      { id: "prov-cap-ai-ml", from: "ai-engineering-capability", to: "experiment-capability", kind: "branch" },
    ],
    events: [{ id: "provenance-resolve", from: "early-work", to: "experiment-capability" }],
  };
};

const openFrontier: StateResolver = (viewport) => {
  const mobile = viewport === "mobile";
  return {
    state: "open-frontier",
    index: "09C",
    name: "Open capability frontier",
    shortName: "Open frontier",
    thesis: "Accumulated capability supports continued work; it does not imply completion",
    description:
      "The capability backbone stays connected while quiet open nodes preserve learning, development, the next experiment, and what is not known yet.",
    annotation: "CAPABLE OF BUILDING FURTHER / NOT FINISHED",
    preferredComposition: "full-width",
    canvasHeight: mobile ? 1320 : undefined,
    nodes: mobile
      ? [
          node("interface-capability", "Interface", "outcome", 195, 85, { emphasis: "branch" }),
          node("connected-capability", "Connected system", "outcome", 195, 205, { emphasis: "branch", width: 185 }),
          node("client-capability", "Client delivery", "outcome", 195, 325, { emphasis: "branch", width: 170 }),
          node("shared-capability", "Shared architecture", "outcome", 195, 445, { emphasis: "branch", width: 205 }),
          node("product-research", "Product research", "outcome", 195, 565, { emphasis: "branch", width: 185 }),
          node("ai-engineering-capability", "AI-assisted engineering", "outcome", 195, 685, { emphasis: "branch", width: 225 }),
          node("experiment-capability", "ML experimentation", "outcome", 195, 805, { emphasis: "resolved", width: 205 }),
          node("learning-frontier", "Learning", "idea", 80, 1010, { emphasis: "branch" }),
          node("development-frontier", "In development", "idea", 310, 1010, { emphasis: "branch", width: 160 }),
          node("next-experiment", "Next experiment", "idea", 80, 1165, { emphasis: "branch", width: 160 }),
          node("unknown-yet", "Unknown yet", "idea", 310, 1165, { emphasis: "branch" }),
          node("build-further", "Build further", "outcome", 195, 1260, { emphasis: "resolved", width: 165 }),
        ]
      : [
          node("interface-capability", "Interface", "outcome", 90, 270, { emphasis: "branch" }),
          node("connected-capability", "Connected system", "outcome", 250, 270, { emphasis: "branch", width: 185 }),
          node("client-capability", "Client delivery", "outcome", 430, 270, { emphasis: "branch", width: 170 }),
          node("shared-capability", "Shared architecture", "outcome", 625, 270, { emphasis: "branch", width: 205 }),
          node("product-research", "Product research", "outcome", 825, 270, { emphasis: "branch", width: 185 }),
          node("ai-engineering-capability", "AI-assisted engineering", "outcome", 1040, 270, { emphasis: "branch", width: 225 }),
          node("experiment-capability", "ML experimentation", "outcome", 1040, 470, { emphasis: "resolved", width: 205 }),
          node("learning-frontier", "Learning", "idea", 170, 500, { emphasis: "branch" }),
          node("development-frontier", "In development", "idea", 370, 500, { emphasis: "branch", width: 160 }),
          node("next-experiment", "Next experiment", "idea", 570, 500, { emphasis: "branch", width: 160 }),
          node("unknown-yet", "Unknown yet", "idea", 760, 500, { emphasis: "branch" }),
          node("build-further", "Build further", "outcome", 600, 625, { emphasis: "resolved", width: 165 }),
        ],
    edges: [
      { id: "frontier-interface-connected", from: "interface-capability", to: "connected-capability", kind: "branch" },
      { id: "frontier-connected-client", from: "connected-capability", to: "client-capability", kind: "branch" },
      { id: "frontier-client-shared", from: "client-capability", to: "shared-capability", kind: "branch" },
      { id: "frontier-shared-product", from: "shared-capability", to: "product-research", kind: "branch" },
      { id: "frontier-product-ai", from: "product-research", to: "ai-engineering-capability", kind: "branch" },
      { id: "frontier-ai-ml", from: "ai-engineering-capability", to: "experiment-capability", kind: "branch" },
      { id: "frontier-learning-build", from: "learning-frontier", to: "build-further", kind: "branch" },
      { id: "frontier-development-build", from: "development-frontier", to: "build-further", kind: "branch" },
      { id: "frontier-experiment-build", from: "next-experiment", to: "build-further", kind: "branch" },
      { id: "frontier-unknown-build", from: "unknown-yet", to: "build-further", kind: "branch" },
      { id: "frontier-capability-build", from: "experiment-capability", to: "build-further", kind: "transition" },
    ],
    events: [{ id: "frontier-open-event", from: "experiment-capability", to: "build-further" }],
  };
};

const contactHandoff: StateResolver = (viewport) => {
  const mobile = viewport === "mobile";
  return {
    state: "contact-handoff",
    index: "09D",
    name: "Quiet contact handoff",
    shortName: "Handoff",
    thesis: "Accumulated capability stays attributable, then hands off to a real person",
    description:
      "The quiet final state retains all seven capabilities with restrained provenance while one open connection leads to Aakash's email and GitHub. Actionable links follow in the contact footer.",
    annotation: "OPEN CONNECTION / AAKASH SINGH",
    preferredComposition: "typography-integrated",
    canvasHeight: mobile ? 1140 : undefined,
    nodes: mobile
      ? [
          node("interface-capability", "Interface", "outcome", 195, 80, { emphasis: "branch", detail: "early web work / products" }),
          node("connected-capability", "Connected system", "outcome", 195, 185, { emphasis: "branch", width: 190, detail: "BellyBasket" }),
          node("client-capability", "Client delivery", "outcome", 195, 290, { emphasis: "branch", width: 180, detail: "Duforge" }),
          node("shared-capability", "Shared architecture", "outcome", 195, 395, { emphasis: "branch", width: 205, detail: "CraveCart" }),
          node("product-research", "Product research", "outcome", 195, 500, { emphasis: "branch", width: 190, detail: "GENKŌ" }),
          node("ai-engineering-capability", "AI-assisted engineering", "outcome", 195, 605, { emphasis: "branch", width: 235, detail: "development workflow / GENKŌ" }),
          node("experiment-capability", "ML experimentation", "outcome", 195, 710, { emphasis: "branch", width: 205, detail: "QuantX" }),
          node("open-connection", "Open connection", "idea", 195, 830, { emphasis: "primary", width: 180 }),
          node("email-contact", "aakash.singh0953@gmail.com", "outcome", 195, 955, { emphasis: "resolved", width: 290 }),
          node("github-contact", "github.com/aakash8930", "evidence", 195, 1060, { emphasis: "branch", width: 245 }),
        ]
      : [
          node("interface-capability", "Interface", "outcome", 130, 155, { emphasis: "branch", detail: "early web work / products" }),
          node("connected-capability", "Connected system", "outcome", 410, 155, { emphasis: "branch", width: 190, detail: "BellyBasket" }),
          node("client-capability", "Client delivery", "outcome", 690, 155, { emphasis: "branch", width: 180, detail: "Duforge" }),
          node("shared-capability", "Shared architecture", "outcome", 990, 155, { emphasis: "branch", width: 205, detail: "CraveCart" }),
          node("product-research", "Product research", "outcome", 225, 350, { emphasis: "branch", width: 190, detail: "GENKŌ" }),
          node("ai-engineering-capability", "AI-assisted engineering", "outcome", 590, 350, { emphasis: "branch", width: 235, detail: "development workflow / GENKŌ" }),
          node("experiment-capability", "ML experimentation", "outcome", 960, 350, { emphasis: "branch", width: 205, detail: "QuantX" }),
          node("open-connection", "Open connection", "idea", 600, 500, { emphasis: "primary", width: 180 }),
          node("email-contact", "aakash.singh0953@gmail.com", "outcome", 420, 620, { emphasis: "resolved", width: 290 }),
          node("github-contact", "github.com/aakash8930", "evidence", 800, 620, { emphasis: "branch", width: 245 }),
        ],
    edges: [
      { id: "contact-interface-connected", from: "interface-capability", to: "connected-capability", kind: "branch" },
      { id: "contact-connected-client", from: "connected-capability", to: "client-capability", kind: "branch" },
      { id: "contact-client-shared", from: "client-capability", to: "shared-capability", kind: "branch" },
      { id: "contact-shared-product", from: "shared-capability", to: "product-research", kind: "branch" },
      { id: "contact-product-ai", from: "product-research", to: "ai-engineering-capability", kind: "branch" },
      { id: "contact-ai-ml", from: "ai-engineering-capability", to: "experiment-capability", kind: "branch" },
      { id: "contact-open", from: "experiment-capability", to: "open-connection", kind: "transition" },
      { id: "contact-email", from: "open-connection", to: "email-contact", kind: "primary" },
      { id: "contact-github", from: "open-connection", to: "github-contact", kind: "branch" },
    ],
    events: [],
    callouts: [
      { id: "contact-person", text: "THE SYSTEM BECOMES QUIET HERE", x: mobile ? 195 : 1090, y: mobile ? 1100 : 655, tone: "muted" },
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
  "capability-peelback": capabilityPeelback,
  "beginner-tools": beginnerTools,
  "spotify-player": spotifyPlayer,
  "bellybasket-foundation": bellybasketFoundation,
  "bellybasket-system": bellybasketSystem,
  "client-workbench": clientWorkbench,
  "client-constraints": clientConstraints,
  "client-delivery": clientDelivery,
  "dapigo-inherited": dapigoInherited,
  "dapigo-inspection": dapigoInspection,
  "cravecart-growing": cravecartGrowing,
  "shared-architecture": sharedArchitecture,
  "genko-problem": genkoProblem,
  "genko-loop": genkoLoop,
  "genko-ai-product": genkoAiProduct,
  "genko-capability": genkoCapability,
  "ai-workbench": aiWorkbench,
  "ai-proposals": aiProposals,
  "ai-evaluation": aiEvaluation,
  "ai-workflow": aiWorkflow,
  "ai-capability": aiCapability,
  "quantx-problem": quantxProblem,
  "market-pipeline": marketPipeline,
  "model-branching": modelBranching,
  "decision-gates": decisionGates,
  "quantx-capability": quantxCapability,
  "accumulated-system": accumulatedSystem,
  "capability-provenance": capabilityProvenance,
  "open-frontier": openFrontier,
  "contact-handoff": contactHandoff,
  "spotify-limited": spotifyLimited,
  "inherited-rebuild": inheritedRebuild,
  "capability-compression": capabilityCompression,
};

export const BUILD_GRAPH_STATES: BuildGraphState[] = [
  "current",
  "capability-peelback",
  "beginner-tools",
  "spotify-player",
  "spotify-limited",
  "bellybasket-foundation",
  "system-thinking",
  "bellybasket-system",
  "client-workbench",
  "client-constraints",
  "client-delivery",
  "dapigo-inherited",
  "dapigo-inspection",
  "cravecart-growing",
  "inherited-rebuild",
  "shared-architecture",
  "genko-problem",
  "genko-loop",
  "genko-ai-product",
  "genko-capability",
  "ai-workbench",
  "ai-proposals",
  "ai-evaluation",
  "ai-workflow",
  "ai-capability",
  "quantx-problem",
  "market-pipeline",
  "model-branching",
  "decision-gates",
  "quantx-capability",
  "accumulated-system",
  "capability-provenance",
  "open-frontier",
  "contact-handoff",
  "multi-surface",
  "engineering-loop",
  "capability-compression",
];

export const BUILD_GRAPH_LAB_STATES: BuildGraphState[] = [
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

export const BUILD_GRAPH_STATE_GUIDE = BUILD_GRAPH_LAB_STATES.map((state) => {
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
