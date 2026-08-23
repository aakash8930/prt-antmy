"use client";

import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import * as THREE from "three";
import type { BuildGraphState } from "@/components/build-graph/model";

type AssemblyMode =
  | "current"
  | "decomposed"
  | "browser"
  | "spotify"
  | "boundary"
  | "growing"
  | "system"
  | "clientWorkbench"
  | "clientConstraints"
  | "clientDelivery"
  | "inherited"
  | "inspection"
  | "rebuildGrowing"
  | "rebuild"
  | "sharedArchitecture"
  | "genkoProblem"
  | "genkoLoop"
  | "genkoAI"
  | "genkoCapability"
  | "aiBoundary"
  | "aiInputs"
  | "aiDecision"
  | "aiWorkflow"
  | "aiCapability"
  | "quantProblem"
  | "quantPipeline"
  | "quantModels"
  | "quantGates"
  | "quantCapability";

type SoftwareAssemblyProps = {
  state: BuildGraphState;
  reducedMotion: boolean;
  chapterLabel: string;
};

type SceneRole =
  | "interface"
  | "api"
  | "service"
  | "data"
  | "workbench"
  | "sources"
  | "assets"
  | "admin"
  | "payment"
  | "location"
  | "maps"
  | "tracking"
  | "constraints"
  | "delivery"
  | "legacy"
  | "inspection"
  | "rebuild"
  | "shared"
  | "learning"
  | "productResearch"
  | "productAI"
  | "aiInputs"
  | "decision"
  | "outcomes"
  | "implementation"
  | "testing"
  | "market"
  | "features"
  | "models"
  | "riskGates"
  | "actions"
  | "unresolved";

type RoleGroup = THREE.Group & { userData: { roleOpacity?: number } };

const COLORS = {
  body: 0x111a20,
  bodyRaised: 0x1b2a31,
  interface: 0x91b8c1,
  signal: 0xef7353,
  data: 0x527f8b,
  resolved: 0xb8d7bc,
  history: 0x55656b,
  ink: 0xe6edef,
};

function modeForState(state: BuildGraphState): AssemblyMode {
  if (state === "capability-peelback") return "decomposed";
  if (state === "beginner-tools") return "browser";
  if (state === "spotify-player" || state === "spotify-limited") return "spotify";
  if (state === "bellybasket-foundation") return "boundary";
  if (state === "system-thinking") return "growing";
  if (state === "bellybasket-system") return "system";
  if (state === "client-workbench") return "clientWorkbench";
  if (state === "client-constraints") return "clientConstraints";
  if (state === "client-delivery") return "clientDelivery";
  if (state === "dapigo-inherited") return "inherited";
  if (state === "dapigo-inspection") return "inspection";
  if (state === "cravecart-growing") return "rebuildGrowing";
  if (state === "inherited-rebuild") return "rebuild";
  if (state === "shared-architecture") return "sharedArchitecture";
  if (state === "genko-problem") return "genkoProblem";
  if (state === "genko-loop") return "genkoLoop";
  if (state === "genko-ai-product") return "genkoAI";
  if (state === "genko-capability") return "genkoCapability";
  if (state === "ai-workbench") return "aiBoundary";
  if (state === "ai-proposals") return "aiInputs";
  if (state === "ai-evaluation") return "aiDecision";
  if (state === "ai-workflow") return "aiWorkflow";
  if (state === "ai-capability") return "aiCapability";
  if (state === "quantx-problem") return "quantProblem";
  if (state === "market-pipeline") return "quantPipeline";
  if (state === "model-branching") return "quantModels";
  if (state === "decision-gates") return "quantGates";
  if (state === "quantx-capability") return "quantCapability";
  return "current";
}

const MODE_COPY: Record<AssemblyMode, { eyebrow: string; title: string; labels: string[] }> = {
  current: {
    eyebrow: "THE SOFTWARE ASSEMBLY / OPERATING",
    title: "A connected system, already alive.",
    labels: ["Interface", "API seam", "Service core", "Data bed"],
  },
  decomposed: {
    eyebrow: "DECOMPOSITION / WHAT CAME LATER",
    title: "The complete system separates into what was learned.",
    labels: ["Browser surface", "Service recedes", "Data recedes"],
  },
  browser: {
    eyebrow: "SOURCE MATERIAL / FIRST BUILDS",
    title: "Structure, style and behavior assemble the browser.",
    labels: ["HTML", "CSS", "JavaScript", "Browser"],
  },
  spotify: {
    eyebrow: "FIRST PROJECT / FRONTEND MODEL",
    title: "The browser becomes a player. Its assets remain inside.",
    labels: ["Player surface", "/assets", "No backend depth"],
  },
  boundary: {
    eyebrow: "BELLYBASKET / THE BOUNDARY OPENS",
    title: "The interface lifts. A system appears underneath.",
    labels: ["Frontend", "API boundary", "Backend", "Data"],
  },
  growing: {
    eyebrow: "BELLYBASKET / RESPONSIBILITIES CONNECT",
    title: "One product becomes several coordinated responsibilities.",
    labels: ["Frontend", "Admin", "Payment", "Location"],
  },
  system: {
    eyebrow: "BELLYBASKET / FIRST REAL SYSTEM",
    title: "The workspace expands into a coherent product system.",
    labels: ["Backend", "Payment", "Maps", "Live tracking"],
  },
  clientWorkbench: {
    eyebrow: "CLIENT WORK / ANOTHER PERSON'S PROBLEM",
    title: "A capable workspace now receives requirements from outside.",
    labels: ["Working system", "External brief", "Delivery boundary"],
  },
  clientConstraints: {
    eyebrow: "CLIENT WORK / CONSTRAINTS ATTACH",
    title: "Requirements begin shaping what the system is allowed to become.",
    labels: ["Scope", "Feedback", "Business need", "Definition of done"],
  },
  clientDelivery: {
    eyebrow: "CLIENT WORK / DELIVERY",
    title: "The system settles only when an external definition of done is met.",
    labels: ["Requirements resolved", "Delivery path", "Client outcome"],
  },
  inherited: {
    eyebrow: "DAPIGO / AN EXISTING SYSTEM ARRIVES",
    title: "The next build begins inside software with its own history.",
    labels: ["Flutter surface", "PHP / Laravel", "Inherited model"],
  },
  inspection: {
    eyebrow: "DAPIGO / INSPECT BEFORE CHANGING",
    title: "The inherited system stays intact while its paths are understood.",
    labels: ["Trace behavior", "Understand", "Then decide"],
  },
  rebuildGrowing: {
    eyebrow: "CRAVECART / A NEW MODEL GROWS",
    title: "The replacement begins around the knowledge recovered through inspection.",
    labels: ["Customer", "Admin", "Shared Node backend", "Shared data"],
  },
  rebuild: {
    eyebrow: "DAPIGO → CRAVECART / REBUILD",
    title: "The inherited model remains visible while shared architecture moves forward.",
    labels: ["Inherited layer", "Inspection seam", "Four surfaces", "Shared core"],
  },
  sharedArchitecture: {
    eyebrow: "CRAVECART / CAPABILITY RETAINED",
    title: "Project structure recedes. Shared architecture remains in the assembly.",
    labels: ["Shared backend", "Shared state", "Multi-surface system"],
  },
  genkoProblem: {
    eyebrow: "GENKŌ / A PERSONAL LEARNING PROBLEM",
    title: "The assembly changes purpose before it changes scale.",
    labels: ["Learning problem", "Product research", "Continuity"],
  },
  genkoLoop: {
    eyebrow: "GENKŌ / LEARNING LOOP",
    title: "Practice becomes a loop that returns the learner to the product.",
    labels: ["Learn", "Listen", "Write", "Quiz", "Continue"],
  },
  genkoAI: {
    eyebrow: "GENKŌ / AI INSIDE THE PRODUCT",
    title: "AI begins as one interaction inside a researched learning system.",
    labels: ["Learning loop", "AI interaction", "Product feature"],
  },
  genkoCapability: {
    eyebrow: "GENKŌ / PRODUCT CAPABILITY",
    title: "The product settles into a reusable research and learning foundation.",
    labels: ["Product research", "Learning system", "Continuing development"],
  },
  aiBoundary: {
    eyebrow: "AI / PRODUCT FEATURE → ENGINEERING TOOL",
    title: "The AI element leaves the product and docks into the workbench.",
    labels: ["GENKŌ", "AI tool", "Engineering workbench"],
  },
  aiInputs: {
    eyebrow: "AI / PROPOSALS ARE INPUTS",
    title: "AI, documentation and repository context enter one working surface.",
    labels: ["AI proposal", "Documentation", "Repository", "Research"],
  },
  aiDecision: {
    eyebrow: "AI / ENGINEERING JUDGMENT",
    title: "Nothing crosses into the build before an engineering decision.",
    labels: ["Accept", "Revise", "Reject"],
  },
  aiWorkflow: {
    eyebrow: "AI / IMPLEMENTATION LOOP",
    title: "Accepted work enters implementation, testing and correction.",
    labels: ["Implement", "Test", "Debug", "Working system"],
  },
  aiCapability: {
    eyebrow: "AI / CAPABILITY RETAINED",
    title: "The workbench remains useful because judgment stays at its center.",
    labels: ["Research", "Engineering decision", "Tested software"],
  },
  quantProblem: {
    eyebrow: "QUANTX / AN UNFINISHED EXPERIMENT",
    title: "A market question docks at the open edge of the assembly.",
    labels: ["Market information", "Experimental system", "Open question"],
  },
  quantPipeline: {
    eyebrow: "QUANTX / MARKET ANALYSIS",
    title: "Raw signals become features before they reach a model.",
    labels: ["Market inputs", "Analysis", "Feature extraction"],
  },
  quantModels: {
    eyebrow: "QUANTX / EXPERIMENTAL MODELS",
    title: "Several model chambers branch from the same prepared evidence.",
    labels: ["Model A", "Model B", "Model C", "Low confidence"],
  },
  quantGates: {
    eyebrow: "QUANTX / DECISION + RISK GATES",
    title: "A prediction is not an action until both gates allow it through.",
    labels: ["Decision", "Risk", "Action", "No action"],
  },
  quantCapability: {
    eyebrow: "QUANTX / EXPERIMENTAL CAPABILITY",
    title: "The experiment stays open; its data and ML capability remain.",
    labels: ["Experimental ML", "Risk awareness", "Unresolved branch"],
  },
};

function material(color: number, opacity = 1, emissive = 0x000000) {
  const result = new THREE.MeshStandardMaterial({
    color,
    emissive,
    emissiveIntensity: emissive ? 0.32 : 0,
    roughness: 0.72,
    metalness: 0.12,
    transparent: true,
    opacity,
  });
  result.userData.baseOpacity = opacity;
  return result;
}

function addBox(
  parent: THREE.Object3D,
  size: [number, number, number],
  position: [number, number, number],
  color: number,
  options: { emissive?: number; opacity?: number; edges?: boolean } = {},
) {
  const geometry = new THREE.BoxGeometry(...size);
  const mesh = new THREE.Mesh(
    geometry,
    material(color, options.opacity ?? 1, options.emissive ?? 0),
  );
  mesh.position.set(...position);
  parent.add(mesh);

  if (options.edges !== false) {
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: options.emissive ?? COLORS.interface,
      transparent: true,
      opacity: 0.38,
    });
    edgeMaterial.userData.baseOpacity = 0.38;
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), edgeMaterial);
    mesh.add(edges);
  }
  return mesh;
}

function addRole(root: THREE.Group, role: SceneRole) {
  const group = new THREE.Group() as RoleGroup;
  group.name = role;
  group.userData.roleOpacity = 1;
  root.add(group);
  return group;
}

function setGroupOpacity(group: RoleGroup, opacity: number) {
  group.userData.roleOpacity = opacity;
  group.visible = opacity > 0.015;
  group.traverse((object) => {
    if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments) {
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach((item) => {
        if (!("opacity" in item)) return;
        item.transparent = true;
        const baseOpacity = Number(item.userData.baseOpacity ?? 1);
        item.opacity = opacity * baseOpacity;
      });
    }
  });
}

function createAssembly(scene: THREE.Scene) {
  const root = new THREE.Group();
  root.rotation.set(-0.12, -0.34, -0.035);
  scene.add(root);

  const roles = {} as Record<SceneRole, RoleGroup>;
  const role = (name: SceneRole) => (roles[name] = addRole(root, name));

  const data = role("data");
  addBox(data, [4.7, 0.26, 2.5], [0, -1.34, 0], COLORS.bodyRaised, { edges: true });
  [-0.72, -0.24, 0.24, 0.72].forEach((z, index) => {
    addBox(data, [3.85, 0.035, 0.12], [-0.2, -1.15 + index * 0.025, z], COLORS.data, {
      emissive: COLORS.data,
      edges: false,
    });
  });

  const service = role("service");
  addBox(service, [4.15, 1.18, 2.05], [-0.08, -0.58, 0], COLORS.body, { edges: true });
  addBox(service, [1.25, 0.72, 1.55], [-1.18, -0.47, 0.05], COLORS.bodyRaised, { edges: true });
  addBox(service, [1.82, 0.18, 1.62], [0.88, -0.28, 0.04], COLORS.interface, {
    opacity: 0.18,
    edges: true,
  });
  [-0.48, 0, 0.48].forEach((z) =>
    addBox(service, [0.95, 0.055, 0.08], [0.92, -0.14, z], COLORS.signal, {
      emissive: COLORS.signal,
      edges: false,
    }),
  );

  const api = role("api");
  addBox(api, [4.4, 0.09, 2.16], [0, 0.12, 0], COLORS.signal, {
    emissive: COLORS.signal,
    edges: false,
  });
  [-1.35, -0.45, 0.45, 1.35].forEach((x) =>
    addBox(api, [0.16, 0.13, 0.16], [x, 0.18, 1.02], COLORS.signal, {
      emissive: COLORS.signal,
      edges: false,
    }),
  );

  const interfaceGroup = role("interface");
  interfaceGroup.rotation.x = -0.16;
  addBox(interfaceGroup, [4.55, 0.16, 2.55], [0, 0.74, 0.08], COLORS.bodyRaised, { edges: true });
  addBox(interfaceGroup, [4.12, 0.055, 2.14], [0, 0.86, 0.08], COLORS.interface, {
    opacity: 0.2,
    emissive: COLORS.interface,
    edges: true,
  });
  addBox(interfaceGroup, [1.1, 0.035, 0.24], [-1.32, 0.91, -0.68], COLORS.ink, { edges: false });
  addBox(interfaceGroup, [2.65, 0.035, 0.16], [0.42, 0.91, -0.7], COLORS.interface, { edges: false });
  addBox(interfaceGroup, [2.15, 0.035, 0.16], [0.18, 0.91, -0.35], COLORS.interface, { edges: false });
  addBox(interfaceGroup, [1.42, 0.035, 0.48], [-0.72, 0.91, 0.38], COLORS.signal, {
    opacity: 0.55,
    emissive: COLORS.signal,
    edges: false,
  });
  addBox(interfaceGroup, [1.42, 0.035, 0.48], [0.92, 0.91, 0.38], COLORS.data, {
    opacity: 0.48,
    emissive: COLORS.data,
    edges: false,
  });

  const workbench = role("workbench");
  addBox(workbench, [1.75, 0.2, 0.38], [2.84, -0.24, 0.62], COLORS.bodyRaised, { edges: true });
  addBox(workbench, [0.32, 0.32, 0.32], [2.35, -0.02, 0.62], COLORS.signal, {
    emissive: COLORS.signal,
  });
  addBox(workbench, [0.32, 0.32, 0.32], [2.86, -0.02, 0.62], COLORS.interface);
  addBox(workbench, [0.32, 0.32, 0.32], [3.37, -0.02, 0.62], COLORS.history);

  const openPortGeometry = new THREE.TorusGeometry(0.22, 0.055, 10, 28);
  const openPort = new THREE.Mesh(openPortGeometry, material(COLORS.signal, 1, COLORS.signal));
  openPort.position.set(2.48, 0.82, -0.82);
  openPort.rotation.x = Math.PI / 2;
  interfaceGroup.add(openPort);

  const sources = role("sources");
  const sourceColors = [0xe6edef, 0x83b4bf, 0xef7353];
  [-0.8, 0, 0.8].forEach((x, index) => {
    const strip = addBox(sources, [0.66, 0.08, 1.9], [x, 1.72 + index * 0.13, 0], sourceColors[index], {
      emissive: sourceColors[index],
      opacity: 0.78,
      edges: true,
    });
    strip.rotation.z = (index - 1) * 0.08;
  });

  const assets = role("assets");
  addBox(assets, [1.62, 0.22, 1.14], [0.92, 1.14, 0.35], COLORS.signal, {
    opacity: 0.78,
    emissive: COLORS.signal,
    edges: true,
  });
  [-0.3, 0, 0.3].forEach((z) =>
    addBox(assets, [1.14, 0.04, 0.12], [0.92, 1.28, 0.35 + z], COLORS.ink, { edges: false }),
  );

  const admin = role("admin");
  addBox(admin, [1.55, 0.14, 1.1], [-2.85, 0.5, 0.4], COLORS.interface, { opacity: 0.36, edges: true });

  const payment = role("payment");
  addBox(payment, [0.72, 0.72, 0.72], [2.45, -0.72, -0.72], COLORS.signal, {
    opacity: 0.72,
    emissive: COLORS.signal,
    edges: true,
  });

  const location = role("location");
  const pin = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.8, 5), material(COLORS.interface, 0.76, COLORS.interface));
  pin.position.set(2.58, -0.72, 0.45);
  pin.rotation.z = Math.PI;
  location.add(pin);

  const maps = role("maps");
  addBox(maps, [1.38, 0.09, 1.12], [2.58, 0.05, 1.28], COLORS.data, {
    opacity: 0.48,
    emissive: COLORS.data,
    edges: true,
  });

  const tracking = role("tracking");
  const points = [
    new THREE.Vector3(-1.7, 0.35, 1.25),
    new THREE.Vector3(-0.5, 0.1, 1.4),
    new THREE.Vector3(0.7, 0.28, 1.2),
    new THREE.Vector3(2.58, 0.12, 1.3),
  ];
  const curve = new THREE.CatmullRomCurve3(points);
  const tube = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 48, 0.035, 8, false),
    material(COLORS.resolved, 0.92, COLORS.resolved),
  );
  tracking.add(tube);

  const constraints = role("constraints");
  addBox(constraints, [5.65, 0.055, 0.08], [0, 1.72, -1.48], COLORS.signal, {
    emissive: COLORS.signal,
    opacity: 0.72,
    edges: false,
  });
  addBox(constraints, [5.65, 0.055, 0.08], [0, -1.62, -1.48], COLORS.signal, {
    emissive: COLORS.signal,
    opacity: 0.72,
    edges: false,
  });
  addBox(constraints, [0.055, 3.38, 0.08], [-2.82, 0.05, -1.48], COLORS.signal, {
    emissive: COLORS.signal,
    opacity: 0.72,
    edges: false,
  });
  addBox(constraints, [0.055, 3.38, 0.08], [2.82, 0.05, -1.48], COLORS.signal, {
    emissive: COLORS.signal,
    opacity: 0.72,
    edges: false,
  });
  [-1.75, -0.58, 0.58, 1.75].forEach((x, index) =>
    addBox(constraints, [0.72, 0.2, 0.5], [x, 1.62, -1.35], index === 2 ? COLORS.signal : COLORS.history, {
      emissive: index === 2 ? COLORS.signal : 0,
      opacity: 0.82,
      edges: true,
    }),
  );

  const delivery = role("delivery");
  addBox(delivery, [4.8, 0.07, 0.11], [0.18, -1.78, 1.42], COLORS.resolved, {
    emissive: COLORS.resolved,
    opacity: 0.88,
    edges: false,
  });
  addBox(delivery, [0.5, 0.5, 0.5], [2.56, -1.55, 1.42], COLORS.resolved, {
    emissive: COLORS.resolved,
    opacity: 0.84,
    edges: true,
  });

  const legacy = role("legacy");
  addBox(legacy, [2.5, 0.18, 1.76], [-1.55, 0.72, -1.65], COLORS.history, {
    opacity: 0.52,
    edges: true,
  });
  addBox(legacy, [2.12, 0.7, 1.42], [-1.55, -0.02, -1.72], COLORS.body, {
    opacity: 0.72,
    edges: true,
  });
  [-0.45, 0, 0.45].forEach((z) =>
    addBox(legacy, [1.54, 0.055, 0.1], [-1.55, 0.92, -1.65 + z], COLORS.history, {
      emissive: COLORS.history,
      edges: false,
    }),
  );

  const inspection = role("inspection");
  addBox(inspection, [0.075, 3.25, 2.55], [-0.02, 0.04, -1.15], COLORS.signal, {
    emissive: COLORS.signal,
    opacity: 0.18,
    edges: false,
  });
  const inspectionRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.12, 0.04, 10, 48),
    material(COLORS.signal, 0.82, COLORS.signal),
  );
  inspectionRing.position.set(-1.55, 0.25, -1.28);
  inspectionRing.rotation.x = Math.PI / 2;
  inspection.add(inspectionRing);

  const rebuild = role("rebuild");
  const surfacePositions: [number, number, number][] = [
    [0.5, 1.25, -0.42],
    [1.82, 1.25, -0.42],
    [0.5, 0.42, -0.42],
    [1.82, 0.42, -0.42],
  ];
  surfacePositions.forEach((position, index) =>
    addBox(rebuild, [1.02, 0.12, 0.66], position, index === 0 ? COLORS.signal : COLORS.interface, {
      emissive: index === 0 ? COLORS.signal : COLORS.interface,
      opacity: index === 0 ? 0.7 : 0.38,
      edges: true,
    }),
  );
  addBox(rebuild, [2.52, 0.86, 1.5], [1.15, -0.48, -0.5], COLORS.bodyRaised, {
    opacity: 0.96,
    edges: true,
  });
  addBox(rebuild, [1.7, 0.16, 1.02], [1.15, -0.23, -0.32], COLORS.interface, {
    emissive: COLORS.interface,
    opacity: 0.28,
    edges: true,
  });

  const shared = role("shared");
  const sharedRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.48, 0.08, 12, 64),
    material(COLORS.resolved, 0.72, COLORS.resolved),
  );
  sharedRing.position.set(0.4, -0.38, 0.05);
  sharedRing.rotation.x = Math.PI / 2;
  shared.add(sharedRing);
  [-0.72, 0, 0.72].forEach((x) =>
    addBox(shared, [0.42, 0.08, 1.38], [0.4 + x, -0.28, 0.05], COLORS.resolved, {
      emissive: COLORS.resolved,
      opacity: 0.4,
      edges: false,
    }),
  );

  const learning = role("learning");
  const learningRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.42, 0.055, 10, 72),
    material(COLORS.interface, 0.66, COLORS.interface),
  );
  learningRing.position.set(-0.15, 1.08, 0.02);
  learningRing.rotation.x = Math.PI / 2;
  learning.add(learningRing);
  const learningPositions: [number, number, number][] = [
    [-1.25, 1.18, -0.62],
    [-0.58, 1.18, 0.92],
    [0.52, 1.18, 0.92],
    [1.06, 1.18, -0.22],
    [0.2, 1.18, -1.08],
  ];
  learningPositions.forEach((position, index) =>
    addBox(learning, [0.68, 0.1, 0.48], position, index === 4 ? COLORS.resolved : COLORS.interface, {
      emissive: index === 4 ? COLORS.resolved : COLORS.interface,
      opacity: index === 4 ? 0.72 : 0.34,
      edges: true,
    }),
  );

  const productResearch = role("productResearch");
  addBox(productResearch, [1.85, 0.16, 1.18], [2.78, 0.32, -0.32], COLORS.bodyRaised, {
    opacity: 0.94,
    edges: true,
  });
  [-0.34, 0, 0.34].forEach((z, index) =>
    addBox(productResearch, [1.32 - index * 0.14, 0.045, 0.1], [2.78, 0.44, -0.32 + z], index === 1 ? COLORS.signal : COLORS.interface, {
      emissive: index === 1 ? COLORS.signal : COLORS.interface,
      opacity: 0.66,
      edges: false,
    }),
  );

  const productAI = role("productAI");
  addBox(productAI, [0.86, 0.18, 0.86], [1.18, 1.38, 0.2], COLORS.signal, {
    emissive: COLORS.signal,
    opacity: 0.78,
    edges: true,
  }).rotation.y = Math.PI / 4;
  addBox(productAI, [1.22, 0.035, 0.08], [1.18, 1.52, 0.2], COLORS.ink, {
    opacity: 0.72,
    edges: false,
  });

  const aiInputs = role("aiInputs");
  const inputColors = [COLORS.signal, COLORS.interface, COLORS.history];
  [-0.72, 0, 0.72].forEach((z, index) =>
    addBox(aiInputs, [1.12, 0.16, 0.48], [3.08, 0.34, z], inputColors[index], {
      emissive: index < 2 ? inputColors[index] : 0,
      opacity: index === 0 ? 0.76 : 0.46,
      edges: true,
    }),
  );

  const decision = role("decision");
  const decisionPlate = addBox(decision, [1.05, 0.2, 1.05], [1.55, -0.12, 0], COLORS.signal, {
    emissive: COLORS.signal,
    opacity: 0.82,
    edges: true,
  });
  decisionPlate.rotation.y = Math.PI / 4;
  addBox(decision, [0.32, 0.34, 0.32], [1.55, 0.08, 0], COLORS.bodyRaised, {
    edges: true,
  });

  const outcomes = role("outcomes");
  const outcomeColors = [COLORS.resolved, COLORS.signal, COLORS.history];
  [-0.88, 0, 0.88].forEach((z, index) =>
    addBox(outcomes, [1.2, 0.12, 0.38], [2.86, -0.38, z], outcomeColors[index], {
      emissive: index < 2 ? outcomeColors[index] : 0,
      opacity: index === 0 ? 0.7 : 0.46,
      edges: true,
    }),
  );

  const implementation = role("implementation");
  addBox(implementation, [1.78, 0.72, 1.46], [0.42, -0.62, 0], COLORS.bodyRaised, {
    opacity: 0.98,
    edges: true,
  });
  addBox(implementation, [1.18, 0.12, 0.9], [0.42, -0.31, 0], COLORS.signal, {
    emissive: COLORS.signal,
    opacity: 0.36,
    edges: true,
  });

  const testing = role("testing");
  const testRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.72, 0.055, 10, 48),
    material(COLORS.resolved, 0.82, COLORS.resolved),
  );
  testRing.position.set(-0.92, -0.55, 0.18);
  testRing.rotation.x = Math.PI / 2;
  testing.add(testRing);
  addBox(testing, [0.62, 0.2, 0.62], [-0.92, -0.5, 0.18], COLORS.resolved, {
    emissive: COLORS.resolved,
    opacity: 0.58,
    edges: true,
  });

  const market = role("market");
  [-0.76, 0, 0.76].forEach((z, index) => {
    addBox(market, [0.86, 0.12, 0.42], [4.06, 0.56 - index * 0.08, z], index === 1 ? COLORS.interface : COLORS.data, {
      emissive: index === 1 ? COLORS.interface : COLORS.data,
      opacity: index === 1 ? 0.62 : 0.46,
      edges: true,
    });
    addBox(market, [0.76, 0.035, 0.055], [3.28, 0.48, z], COLORS.data, {
      emissive: COLORS.data,
      opacity: 0.72,
      edges: false,
    });
  });

  const features = role("features");
  addBox(features, [0.72, 0.42, 2.02], [2.72, 0.35, 0], COLORS.bodyRaised, {
    opacity: 0.96,
    edges: true,
  });
  [-0.72, -0.36, 0, 0.36, 0.72].forEach((z, index) =>
    addBox(features, [0.94 - Math.abs(index - 2) * 0.08, 0.06, 0.07], [2.72, 0.6, z], COLORS.interface, {
      emissive: COLORS.interface,
      opacity: 0.58,
      edges: false,
    }),
  );

  const models = role("models");
  [-1.05, 0, 1.05].forEach((z, index) => {
    addBox(models, [0.92, 0.7, 0.72], [1.55, 0.18 + index * 0.06, z], index === 1 ? COLORS.interface : COLORS.bodyRaised, {
      emissive: index === 1 ? COLORS.interface : 0,
      opacity: index === 1 ? 0.38 : 0.8,
      edges: true,
    });
    addBox(models, [0.46, 0.08, 0.38], [1.55, 0.58 + index * 0.06, z], index === 2 ? COLORS.history : COLORS.signal, {
      emissive: index === 2 ? 0 : COLORS.signal,
      opacity: index === 2 ? 0.38 : 0.56,
      edges: true,
    });
  });

  const riskGates = role("riskGates");
  const gateFrame = (x: number, color: number, height: number) => {
    addBox(riskGates, [0.12, height, 0.12], [x, 0.25, -0.72], color, { emissive: color, opacity: 0.72, edges: false });
    addBox(riskGates, [0.12, height, 0.12], [x, 0.25, 0.72], color, { emissive: color, opacity: 0.72, edges: false });
    addBox(riskGates, [0.12, 0.12, 1.56], [x, 0.25 + height / 2, 0], color, { emissive: color, opacity: 0.72, edges: false });
    addBox(riskGates, [0.12, 0.12, 1.56], [x, 0.25 - height / 2, 0], color, { emissive: color, opacity: 0.72, edges: false });
  };
  gateFrame(0.48, COLORS.signal, 1.34);
  gateFrame(-0.38, COLORS.resolved, 1.06);

  const actions = role("actions");
  addBox(actions, [1.38, 0.1, 0.22], [-1.18, 0.12, -0.38], COLORS.resolved, {
    emissive: COLORS.resolved,
    opacity: 0.78,
    edges: false,
  });
  addBox(actions, [1.14, 0.1, 0.22], [-1.08, 0.12, 0.48], COLORS.history, {
    opacity: 0.46,
    edges: false,
  });
  addBox(actions, [0.44, 0.24, 0.48], [-1.94, 0.12, -0.38], COLORS.resolved, {
    emissive: COLORS.resolved,
    opacity: 0.66,
    edges: true,
  });
  addBox(actions, [0.44, 0.24, 0.48], [-1.76, 0.12, 0.48], COLORS.bodyRaised, {
    opacity: 0.8,
    edges: true,
  });

  const unresolved = role("unresolved");
  [0, 0.42, 0.84].forEach((offset, index) =>
    addBox(unresolved, [0.3, 0.055, 0.08], [-2.35 - offset, 0.08 + offset * 0.26, 0.58 + offset * 0.34], COLORS.signal, {
      emissive: COLORS.signal,
      opacity: 0.62 - index * 0.12,
      edges: false,
    }),
  );

  return { root, roles };
}

function targetsForMode(mode: AssemblyMode) {
  const visible = (value: number, y = 0, z = 0, scale = 1) => ({ opacity: value, y, z, scale });
  const clientMode = ["clientWorkbench", "clientConstraints", "clientDelivery"].includes(mode);
  const inheritedMode = ["inherited", "inspection", "rebuildGrowing", "rebuild", "sharedArchitecture"].includes(mode);
  const genkoMode = ["genkoProblem", "genkoLoop", "genkoAI", "genkoCapability"].includes(mode);
  const aiMode = ["aiBoundary", "aiInputs", "aiDecision", "aiWorkflow", "aiCapability"].includes(mode);
  const quantMode = ["quantProblem", "quantPipeline", "quantModels", "quantGates", "quantCapability"].includes(mode);
  const completeCore = ["current", "boundary", "growing", "system"].includes(mode) || clientMode || genkoMode || aiMode || quantMode;
  const historicCoreOpacity = mode === "sharedArchitecture" ? 0.62 : inheritedMode ? 0.22 : 0;
  const legacyOpacity = mode === "inherited" || mode === "inspection"
    ? 1
    : mode === "rebuildGrowing"
      ? 0.78
      : mode === "rebuild"
        ? 0.48
        : mode === "sharedArchitecture"
          ? 0.18
          : 0;
  const rebuildOpacity = mode === "rebuildGrowing"
    ? 0.58
    : mode === "rebuild"
      ? 1
      : mode === "sharedArchitecture"
        ? 0.34
        : 0;

  return {
    interface: visible(
      completeCore ? 1 : mode === "spotify" || mode === "browser" || mode === "decomposed" ? 1 : historicCoreOpacity,
      mode === "decomposed" ? 0.55 : mode === "spotify" ? 0.25 : inheritedMode ? -0.18 : 0,
      mode === "decomposed" ? 0.45 : inheritedMode ? 0.5 : 0,
      mode === "spotify" ? 1.12 : inheritedMode ? 0.88 : 1,
    ),
    api: visible(completeCore ? 1 : historicCoreOpacity, mode === "boundary" ? -0.08 : 0, inheritedMode ? 0.5 : 0, inheritedMode ? 0.88 : 1),
    service: visible(
      completeCore ? 1 : mode === "decomposed" ? 0.2 : historicCoreOpacity,
      mode === "decomposed" ? -0.55 : mode === "boundary" ? -0.18 : inheritedMode ? -0.18 : 0,
      mode === "decomposed" ? -1.2 : inheritedMode ? 0.5 : 0,
      inheritedMode ? 0.88 : 1,
    ),
    data: visible(
      completeCore ? 1 : mode === "decomposed" ? 0.16 : historicCoreOpacity,
      mode === "decomposed" ? -0.82 : mode === "boundary" ? -0.28 : inheritedMode ? -0.18 : 0,
      mode === "decomposed" ? -1.65 : inheritedMode ? 0.5 : 0,
      inheritedMode ? 0.88 : 1,
    ),
    workbench: visible(
      mode === "current"
        ? 0.8
        : mode === "system"
          ? 0.34
          : clientMode
            ? 0.72
            : mode === "inspection"
              ? 0.48
              : genkoMode
                ? 0.58
                : aiMode
                  ? 1
                  : quantMode
                    ? 0.42
                    : 0,
      0,
      mode === "decomposed" ? -1.2 : 0,
      aiMode ? 1.12 : 1,
    ),
    sources: visible(mode === "decomposed" || mode === "browser" ? 1 : 0, mode === "browser" ? -0.45 : 0, 0, mode === "browser" ? 0.9 : 1),
    assets: visible(mode === "spotify" ? 1 : 0),
    admin: visible(mode === "growing" || mode === "system" ? 1 : 0),
    payment: visible(mode === "growing" || mode === "system" ? 1 : 0),
    location: visible(mode === "growing" || mode === "system" ? 1 : 0),
    maps: visible(mode === "system" ? 1 : 0),
    tracking: visible(mode === "system" ? 1 : 0),
    constraints: visible(
      mode === "clientWorkbench" ? 0.34 : mode === "clientConstraints" ? 1 : mode === "clientDelivery" ? 0.42 : 0,
      mode === "clientWorkbench" ? 0.28 : 0,
      0,
      mode === "clientWorkbench" ? 1.08 : 1,
    ),
    delivery: visible(mode === "clientDelivery" ? 1 : 0),
    legacy: visible(legacyOpacity, 0, mode === "inherited" || mode === "inspection" ? 0.3 : 0, mode === "inherited" ? 1.08 : 1),
    inspection: visible(mode === "inspection" ? 1 : mode === "rebuildGrowing" ? 0.72 : mode === "rebuild" ? 0.28 : 0),
    rebuild: visible(rebuildOpacity, mode === "rebuildGrowing" ? 0.18 : 0, mode === "rebuildGrowing" ? -0.28 : 0, mode === "rebuildGrowing" ? 0.82 : 1),
    shared: visible(mode === "sharedArchitecture" ? 1 : mode === "rebuild" ? 0.26 : 0, 0, mode === "sharedArchitecture" ? 0.34 : 0),
    learning: visible(
      mode === "genkoProblem"
        ? 0.38
        : mode === "genkoLoop" || mode === "genkoAI"
          ? 1
          : mode === "genkoCapability"
            ? 0.56
            : mode === "aiBoundary"
              ? 0.24
              : 0,
      mode === "genkoProblem" ? 0.18 : 0,
      0,
      mode === "genkoProblem" ? 0.86 : 1,
    ),
    productResearch: visible(genkoMode ? 1 : aiMode ? 0.74 : 0),
    productAI: visible(
      mode === "genkoAI"
        ? 1
        : mode === "genkoCapability"
          ? 0.58
          : mode === "aiBoundary"
            ? 1
            : mode === "aiInputs"
              ? 0.82
              : mode === "aiDecision"
                ? 0.56
                : mode === "aiWorkflow" || mode === "aiCapability"
                  ? 0.3
                  : 0,
      mode === "aiBoundary" || aiMode ? -0.72 : 0,
      mode === "aiBoundary" || aiMode ? 0.38 : 0,
      mode === "aiBoundary" ? 1.08 : 1,
    ),
    aiInputs: visible(
      mode === "aiInputs" ? 1 : mode === "aiDecision" ? 0.76 : mode === "aiWorkflow" ? 0.36 : mode === "aiCapability" ? 0.22 : 0,
    ),
    decision: visible(mode === "aiDecision" || mode === "aiWorkflow" ? 1 : mode === "aiCapability" ? 0.78 : 0),
    outcomes: visible(mode === "aiDecision" ? 1 : mode === "aiWorkflow" ? 0.68 : mode === "aiCapability" ? 0.28 : 0),
    implementation: visible(mode === "aiWorkflow" ? 1 : mode === "aiCapability" ? 0.72 : 0),
    testing: visible(mode === "aiWorkflow" || mode === "aiCapability" ? 1 : 0),
    market: visible(
      mode === "quantProblem"
        ? 0.48
        : mode === "quantPipeline"
          ? 1
          : mode === "quantModels" || mode === "quantGates"
            ? 0.62
            : mode === "quantCapability"
              ? 0.18
              : 0,
      mode === "quantProblem" ? 0.28 : 0,
      mode === "quantProblem" ? 0.5 : 0,
    ),
    features: visible(
      mode === "quantPipeline" || mode === "quantModels" ? 1 : mode === "quantGates" ? 0.52 : mode === "quantCapability" ? 0.36 : 0,
    ),
    models: visible(
      mode === "quantModels" || mode === "quantGates" ? 1 : mode === "quantCapability" ? 0.44 : 0,
      mode === "quantModels" ? 0.16 : 0,
      0,
      mode === "quantModels" ? 1.08 : 1,
    ),
    riskGates: visible(mode === "quantGates" ? 1 : mode === "quantCapability" ? 0.7 : 0),
    actions: visible(mode === "quantGates" ? 1 : mode === "quantCapability" ? 0.52 : 0),
    unresolved: visible(
      mode === "quantProblem" ? 0.36 : mode === "quantGates" ? 0.72 : mode === "quantCapability" ? 1 : 0,
      mode === "quantCapability" ? 0.22 : 0,
    ),
  } satisfies Record<SceneRole, { opacity: number; y: number; z: number; scale: number }>;
}

export function SoftwareAssembly({ state, reducedMotion, chapterLabel }: SoftwareAssemblyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mode = modeForState(state);
  const modeRef = useRef(mode);
  const reducedMotionRef = useRef(reducedMotion);
  const copy = useMemo(() => MODE_COPY[mode], [mode]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    reducedMotionRef.current = reducedMotion;
  }, [reducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setClearColor(0x071015, 0);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x091116, 0.055);
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(7.4, 4.7, 8.8);
    camera.lookAt(0, -0.1, 0);

    scene.add(new THREE.HemisphereLight(0xbad7dc, 0x071015, 1.75));
    const key = new THREE.DirectionalLight(0xffffff, 3.1);
    key.position.set(-4, 7, 5);
    scene.add(key);
    const warm = new THREE.PointLight(COLORS.signal, 12, 12, 1.6);
    warm.position.set(3.5, 1.8, 3.5);
    scene.add(warm);
    const cool = new THREE.PointLight(COLORS.data, 8, 10, 1.8);
    cool.position.set(-2, -2.6, 2);
    scene.add(cool);

    const { root, roles } = createAssembly(scene);
    const arc = canvas.closest<HTMLElement>(".story-arc");
    const basePositions = Object.fromEntries(
      Object.entries(roles).map(([name, group]) => [name, group.position.clone()]),
    ) as Record<SceneRole, THREE.Vector3>;
    const initialTargets = targetsForMode(modeRef.current);
    (Object.keys(roles) as SceneRole[]).forEach((name) => {
      const group = roles[name];
      const target = initialTargets[name];
      group.position.y = basePositions[name].y + target.y;
      group.position.z = basePositions[name].z + target.z;
      group.scale.setScalar(target.scale);
      setGroupOpacity(group, target.opacity);
    });

    let frame = 0;
    let previousTime = performance.now();
    let portraitViewport = false;

    const resize = () => {
      const { clientWidth, clientHeight } = canvas;
      const width = Math.max(1, clientWidth);
      const height = Math.max(1, clientHeight);
      const pixelRatio = Math.min(window.devicePixelRatio, 1.75);
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      portraitViewport = camera.aspect < 0.9;
      if (portraitViewport) {
        camera.position.set(7.8, 5.4, 13.4);
        camera.fov = 40;
      } else {
        camera.position.set(7.4, 4.7, 8.8);
        camera.fov = 35;
      }
      camera.lookAt(0, -0.1, 0);
      camera.updateProjectionMatrix();
    };

    const render = (time: number) => {
      const dt = Math.min(0.05, (time - previousTime) / 1000);
      previousTime = time;
      const targets = targetsForMode(modeRef.current);
      const instant = reducedMotionRef.current;
      const factor = instant ? 1 : 1 - Math.exp(-dt * 5.5);

      (Object.keys(roles) as SceneRole[]).forEach((name) => {
        const group = roles[name];
        const target = targets[name];
        group.position.y = THREE.MathUtils.lerp(group.position.y, basePositions[name].y + target.y, factor);
        group.position.z = THREE.MathUtils.lerp(group.position.z, basePositions[name].z + target.z, factor);
        const scale = THREE.MathUtils.lerp(group.scale.x, target.scale, factor);
        group.scale.setScalar(scale);
        const currentOpacity = group.userData.roleOpacity ?? 0;
        setGroupOpacity(group, THREE.MathUtils.lerp(currentOpacity, target.opacity, factor));
      });

      const activeMode = modeRef.current;
      const chapterProgress = THREE.MathUtils.clamp(Number(arc?.dataset.localProgress ?? 0), 0, 1);
      const inspectionX = activeMode === "inspection" ? THREE.MathUtils.lerp(-0.72, 0.72, chapterProgress) : 0;
      const rebuildX = activeMode === "rebuildGrowing" ? THREE.MathUtils.lerp(0.72, 0, chapterProgress) : 0;
      const activeAiMode = ["aiBoundary", "aiInputs", "aiDecision", "aiWorkflow", "aiCapability"].includes(activeMode);
      const activeQuantMode = ["quantProblem", "quantPipeline", "quantModels", "quantGates", "quantCapability"].includes(activeMode);
      const aiDetachProgress = activeMode === "aiBoundary" ? THREE.MathUtils.clamp(chapterProgress / 0.3, 0, 1) : activeAiMode ? 1 : 0;
      roles.inspection.position.x = THREE.MathUtils.lerp(roles.inspection.position.x, inspectionX, factor);
      roles.rebuild.position.x = THREE.MathUtils.lerp(roles.rebuild.position.x, rebuildX, factor);
      roles.productAI.position.x = THREE.MathUtils.lerp(roles.productAI.position.x, aiDetachProgress * 1.35, factor);
      const modelBranchProgress = activeMode === "quantModels"
        ? THREE.MathUtils.clamp((chapterProgress - 0.45) / 0.2, 0, 1)
        : activeQuantMode
          ? 1
          : 0;
      roles.models.position.x = THREE.MathUtils.lerp(roles.models.position.x, (1 - modelBranchProgress) * 0.64, factor);
      const gateProgress = activeMode === "quantGates"
        ? THREE.MathUtils.clamp((chapterProgress - 0.65) / 0.29, 0, 1)
        : 1;
      roles.riskGates.scale.z = roles.riskGates.scale.x * THREE.MathUtils.lerp(1.32, 1, gateProgress);
      const learningRotation = ["genkoLoop", "genkoAI"].includes(activeMode) ? chapterProgress * 1.15 : 0;
      roles.learning.rotation.y = THREE.MathUtils.lerp(roles.learning.rotation.y, learningRotation, factor * 0.6);

      const isExpanded = [
        "growing",
        "system",
        "rebuildGrowing",
        "rebuild",
        "sharedArchitecture",
        "genkoLoop",
        "genkoAI",
        "aiInputs",
        "aiDecision",
        "aiWorkflow",
        "quantPipeline",
        "quantModels",
        "quantGates",
      ].includes(activeMode);
      const isInherited = ["inherited", "inspection", "rebuildGrowing", "rebuild", "sharedArchitecture"].includes(activeMode);
      const isWorkbenchScene = [
        "genkoProblem",
        "genkoLoop",
        "genkoAI",
        "genkoCapability",
        "aiBoundary",
        "aiInputs",
        "aiDecision",
        "aiWorkflow",
        "aiCapability",
      ].includes(activeMode);
      const isQuantLab = ["quantProblem", "quantPipeline", "quantModels", "quantGates", "quantCapability"].includes(activeMode);
      const targetRootX = isQuantLab ? -0.68 : isWorkbenchScene ? -0.42 : isExpanded ? -0.3 : isInherited ? 0.05 : 0.15;
      const targetScale = isQuantLab ? 0.8 : isExpanded ? 0.88 : isInherited ? 0.93 : isWorkbenchScene ? 0.91 : 1;
      const targetRotation = activeMode === "inspection" ? -0.48 : isInherited ? -0.2 : isQuantLab ? -0.08 : isWorkbenchScene ? -0.14 : isExpanded ? -0.18 : -0.34;
      root.position.x = THREE.MathUtils.lerp(root.position.x, targetRootX, factor);
      root.scale.setScalar(THREE.MathUtils.lerp(root.scale.x, targetScale, factor));
      root.rotation.y = THREE.MathUtils.lerp(root.rotation.y, targetRotation, factor);

      if (!portraitViewport) {
        const cameraTarget = activeMode === "inspection"
          ? new THREE.Vector3(6.35, 3.65, 7.25)
          : isInherited
            ? new THREE.Vector3(8.35, 5.15, 10.4)
            : isQuantLab
              ? new THREE.Vector3(8.8, 5.15, 11.4)
              : isWorkbenchScene
                ? new THREE.Vector3(8.15, 4.85, 10.1)
                : new THREE.Vector3(7.4, 4.7, 8.8);
        camera.position.lerp(cameraTarget, factor * 0.72);
      }
      const lookZ = activeMode === "inspection" ? -0.72 : isInherited ? -0.25 : 0;
      camera.lookAt(0, -0.1, lookZ);

      renderer.render(scene, camera);
      frame = requestAnimationFrame(render);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((item) => item.dispose());
        }
      });
      renderer.dispose();
    };
  }, []);

  return (
    <figure className={`software-assembly software-assembly--${mode}`} aria-labelledby="software-assembly-title">
      <div className="software-assembly__stage" aria-hidden="true">
        <canvas ref={canvasRef} className="software-assembly__canvas" />
        <div className="software-assembly__atmosphere" />
        <div className="software-assembly__copy">
          <span>{copy.eyebrow}</span>
          <strong>{copy.title}</strong>
        </div>
        <ol className="software-assembly__legend">
          {copy.labels.map((label, index) => (
            <li key={label} style={{ "--legend-index": index } as CSSProperties}>
              <i />{label}
            </li>
          ))}
        </ol>
        <span className="software-assembly__chapter">{chapterLabel}</span>
      </div>
      <figcaption id="software-assembly-title" className="visually-hidden">
        {copy.title} {copy.labels.join(", ")}.
      </figcaption>
    </figure>
  );
}
