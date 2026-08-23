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
  | "system";

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
  | "tracking";

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

  return { root, roles };
}

function targetsForMode(mode: AssemblyMode) {
  const visible = (value: number, y = 0, z = 0, scale = 1) => ({ opacity: value, y, z, scale });
  return {
    interface: visible(1, mode === "decomposed" ? 0.55 : mode === "spotify" ? 0.25 : 0, mode === "decomposed" ? 0.45 : 0, mode === "spotify" ? 1.12 : 1),
    api: visible(["current", "boundary", "growing", "system"].includes(mode) ? 1 : 0, mode === "boundary" ? -0.08 : 0),
    service: visible(["current", "boundary", "growing", "system"].includes(mode) ? 1 : mode === "decomposed" ? 0.2 : 0, mode === "decomposed" ? -0.55 : mode === "boundary" ? -0.18 : 0, mode === "decomposed" ? -1.2 : 0),
    data: visible(["current", "boundary", "growing", "system"].includes(mode) ? 1 : mode === "decomposed" ? 0.16 : 0, mode === "decomposed" ? -0.82 : mode === "boundary" ? -0.28 : 0, mode === "decomposed" ? -1.65 : 0),
    workbench: visible(mode === "current" ? 0.8 : mode === "system" ? 0.34 : 0, 0, mode === "decomposed" ? -1.2 : 0),
    sources: visible(mode === "decomposed" || mode === "browser" ? 1 : 0, mode === "browser" ? -0.45 : 0, 0, mode === "browser" ? 0.9 : 1),
    assets: visible(mode === "spotify" ? 1 : 0),
    admin: visible(mode === "growing" || mode === "system" ? 1 : 0),
    payment: visible(mode === "growing" || mode === "system" ? 1 : 0),
    location: visible(mode === "growing" || mode === "system" ? 1 : 0),
    maps: visible(mode === "system" ? 1 : 0),
    tracking: visible(mode === "system" ? 1 : 0),
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

    const resize = () => {
      const { clientWidth, clientHeight } = canvas;
      const width = Math.max(1, clientWidth);
      const height = Math.max(1, clientHeight);
      const pixelRatio = Math.min(window.devicePixelRatio, 1.75);
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      if (camera.aspect < 0.9) {
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

      const isExpanded = modeRef.current === "growing" || modeRef.current === "system";
      const targetRootX = isExpanded ? -0.35 : 0.15;
      root.position.x = THREE.MathUtils.lerp(root.position.x, targetRootX, factor);
      root.scale.setScalar(THREE.MathUtils.lerp(root.scale.x, isExpanded ? 0.92 : 1, factor));
      root.rotation.y = THREE.MathUtils.lerp(root.rotation.y, isExpanded ? -0.18 : -0.34, factor);

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
