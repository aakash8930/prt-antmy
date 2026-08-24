import * as THREE from "./assets/vendor/three.module.min.js";

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (v, a, b) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const pulse = (v, a, b, c, d) => smooth(v, a, b) * (1 - smooth(v, c, d));
const lerp = THREE.MathUtils.lerp;

export function createStoryScene(canvas, reducedMotion) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
  } catch {
    document.documentElement.classList.add("no-webgl");
    return { setProgress() {}, resize() {}, destroy() {} };
  }

  const mobile = matchMedia("(max-width: 640px)").matches;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.setClearColor(0x020708, 1);
  renderer.shadowMap.enabled = !mobile;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  canvas.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    document.documentElement.classList.remove("webgl-ready");
    document.documentElement.classList.add("no-webgl");
  });
  canvas.addEventListener("webglcontextrestored", () => {
    document.documentElement.classList.remove("no-webgl");
    document.documentElement.classList.add("webgl-ready");
  });

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x031012, 0.052);
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 0.1, 10);

  const world = new THREE.Group();
  scene.add(world);
  const vessel = new THREE.Group();
  vessel.rotation.set(-0.08, -0.32, 0.02);
  world.add(vessel);

  function surfaceTexture(size = 128) {
    const data = new Uint8Array(size * size * 4);
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const index = (y * size + x) * 4;
        const grain = 112 + ((x * 19 + y * 37 + (x * y) % 29) % 68);
        const scratch = (x * 13 + y * 7) % 113 === 0 ? 54 : 0;
        data[index] = data[index + 1] = data[index + 2] = Math.max(28, grain - scratch);
        data[index + 3] = 255;
      }
    }
    const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    texture.needsUpdate = true;
    return texture;
  }
  const wearMap = surfaceTexture();
  const metal = new THREE.MeshStandardMaterial({ color: 0x686d68, metalness: 0.8, roughness: 0.44, roughnessMap: wearMap, bumpMap: wearMap, bumpScale: 0.008 });
  const darkMetal = new THREE.MeshStandardMaterial({ color: 0x111718, metalness: 0.72, roughness: 0.58, roughnessMap: wearMap, bumpMap: wearMap, bumpScale: 0.006 });
  const ivory = new THREE.MeshPhysicalMaterial({ color: 0xaaa58f, metalness: 0.28, roughness: 0.61, roughnessMap: wearMap, bumpMap: wearMap, bumpScale: 0.012, clearcoat: 0.08 });
  const rubber = new THREE.MeshStandardMaterial({ color: 0x090d0e, metalness: 0.05, roughness: 0.92 });
  const glass = new THREE.MeshPhysicalMaterial({ color: 0x031518, emissive: 0x020b0d, emissiveIntensity: 0.08, metalness: 0.08, roughness: 0.12, transmission: 0.28, transparent: true, opacity: 0.9, thickness: 0.8, ior: 1.49 });
  const energyMaterial = new THREE.MeshBasicMaterial({ color: 0x61b9b4, transparent: true, opacity: 0.62, blending: THREE.AdditiveBlending });
  const amberMaterial = new THREE.MeshBasicMaterial({ color: 0xc79252, transparent: true, opacity: 0.74, blending: THREE.AdditiveBlending });

  const componentData = [];
  function component(object, offset, rotation, mass = 1, assemblyOrder = 0) {
    vessel.add(object);
    componentData.push({ object, home: object.position.clone(), rotation: object.rotation.clone(), offset: new THREE.Vector3(...offset), spin: new THREE.Vector3(...rotation), mass, assemblyOrder });
    return object;
  }
  function addMesh(geometry, material, position = [0, 0, 0], rotation = [0, 0, 0], parent = vessel) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.rotation.set(...rotation);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  // Pressure chamber and internal architecture.
  const chamber = new THREE.Group();
  addMesh(new THREE.SphereGeometry(1.14, 48, 32), darkMetal, [0, 0, 0], [0, 0, 0], chamber);
  addMesh(new THREE.SphereGeometry(1.105, 40, 24), glass, [0, 0, 0], [0, 0, 0], chamber);
  for (let i = 0; i < 3; i += 1) addMesh(new THREE.TorusGeometry(1.21, 0.045, 10, 72), metal, [0, 0, 0], [i === 0 ? Math.PI / 2 : 0, i === 2 ? Math.PI / 2 : 0, i === 1 ? Math.PI / 2 : 0], chamber);
  for (let i = 0; i < 8; i += 1) {
    const angle = i / 8 * Math.PI * 2;
    addMesh(new THREE.CylinderGeometry(0.025, 0.025, 2.15, 8), metal, [Math.sin(angle) * 1.06, 0, Math.cos(angle) * 1.06], [0, 0, angle * 0.08], chamber);
  }
  addMesh(new THREE.CylinderGeometry(0.48, 0.55, 0.16, 32), darkMetal, [0, 1.12, 0], [0, 0, 0], chamber);
  addMesh(new THREE.TorusGeometry(0.48, 0.035, 8, 40), rubber, [0, 1.21, 0], [Math.PI / 2, 0, 0], chamber);
  component(chamber, [0, 0, -2.25], [0, 0.18, 0], 1.4, 1);

  const core = new THREE.Group();
  const coreOrb = addMesh(new THREE.IcosahedronGeometry(0.34, 3), energyMaterial, [0, 0, 0], [0, 0, 0], core);
  const coreRings = [];
  for (let i = 0; i < 3; i += 1) {
    const ring = addMesh(new THREE.TorusGeometry(0.53 + i * 0.13, 0.018, 8, 64), amberMaterial, [0, 0, 0], [i * 0.85, i * 0.6, i * 0.25], core);
    coreRings.push(ring);
  }
  component(core, [0, 0.15, 2.35], [0.28, -0.32, 0.14], 0.6, 0);

  // Structural decks.
  const ballast = new THREE.Group();
  addMesh(new THREE.CylinderGeometry(1.14, 1.27, 0.32, 48), darkMetal, [0, -1.47, 0], [0, 0, 0], ballast);
  addMesh(new THREE.TorusGeometry(1.18, 0.08, 12, 64), metal, [0, -1.3, 0], [Math.PI / 2, 0, 0], ballast);
  for (let side = -1; side <= 1; side += 2) {
    addMesh(new THREE.CylinderGeometry(0.075, 0.075, 1.65, 12), darkMetal, [side * 0.56, -1.72, 0], [0, 0, Math.PI / 2], ballast);
    addMesh(new THREE.CylinderGeometry(0.045, 0.045, 0.42, 10), metal, [side * 0.56, -1.53, 0], [0, 0, 0], ballast);
  }
  for (let i = 0; i < 8; i += 1) {
    const a = i / 8 * Math.PI * 2;
    addMesh(new THREE.BoxGeometry(0.17, 0.19, 0.12), ivory, [Math.sin(a) * 1.08, -1.48, Math.cos(a) * 1.08], [0, a, 0], ballast);
  }
  component(ballast, [0, -2.8, 0.15], [0.08, 0.18, -0.06], 1.5, 1);

  const crown = new THREE.Group();
  addMesh(new THREE.TorusGeometry(0.82, 0.075, 12, 64), metal, [0, 1.38, 0], [Math.PI / 2, 0, 0], crown);
  addMesh(new THREE.TorusGeometry(0.61, 0.035, 8, 64), amberMaterial, [0, 1.38, 0], [Math.PI / 2, 0, 0], crown);
  component(crown, [0, 2.75, -0.15], [-0.12, -0.16, 0.08], 0.8, 4);

  // Independently controlled pressure shell quadrants.
  const shells = [];
  const shellOffsets = [[-3.05, 0.2, 0], [3.05, 0.2, 0], [0, 2.7, -0.35], [0, -2.55, 0.35]];
  for (let i = 0; i < 4; i += 1) {
    const panel = new THREE.Group();
    const patch = addMesh(new THREE.SphereGeometry(1.42, 32, 24, i * Math.PI / 2 + 0.05, Math.PI / 2 - 0.1, 0.18, Math.PI - 0.36), ivory, [0, 0, 0], [0, 0, 0], panel);
    patch.scale.set(1, 1.12, 1);
    for (let r = -1; r <= 1; r += 1) addMesh(new THREE.TorusGeometry(1.445, 0.025, 6, 48, Math.PI / 2 - 0.12), metal, [0, 0, 0], [Math.PI / 2, 0, i * Math.PI / 2 + r * 0.03], panel);
    shells.push(component(panel, shellOffsets[i], [0.12 * (i - 1), 0.24 * (i % 2 ? 1 : -1), 0.08 * i], 1.7, 3));
  }

  // Front viewport assembly.
  const viewport = new THREE.Group();
  addMesh(new THREE.CylinderGeometry(0.58, 0.66, 0.28, 48), metal, [0, 0, 1.36], [Math.PI / 2, 0, 0], viewport);
  addMesh(new THREE.CylinderGeometry(0.48, 0.48, 0.31, 48), glass, [0, 0, 1.43], [Math.PI / 2, 0, 0], viewport);
  addMesh(new THREE.TorusGeometry(0.6, 0.075, 12, 48), metal, [0, 0, 1.53], [0, 0, 0], viewport);
  addMesh(new THREE.TorusGeometry(0.49, 0.026, 8, 48), rubber, [0, 0, 1.57], [0, 0, 0], viewport);
  for (let i = 0; i < 16; i += 1) {
    const angle = i / 16 * Math.PI * 2;
    addMesh(new THREE.CylinderGeometry(0.022, 0.022, 0.055, 8), metal, [Math.cos(angle) * 0.59, Math.sin(angle) * 0.59, 1.6], [Math.PI / 2, 0, 0], viewport);
  }
  component(viewport, [0, 0.15, 3.15], [-0.16, -0.24, -0.08], 0.9, 2);

  function makeArm(side) {
    const arm = new THREE.Group();
    const joints = [];
    const segments = [[0.48, 0.1], [0.44, -0.08], [0.38, 0.18]];
    let x = side * 1.35;
    let y = -0.32;
    segments.forEach(([length, angle], index) => {
      const pivot = new THREE.Group();
      pivot.position.set(x, y, 0.12);
      pivot.rotation.z = side * (angle + index * 0.12);
      pivot.userData.baseRotation = pivot.rotation.z;
      addMesh(new THREE.CylinderGeometry(0.085, 0.11, length, 12), metal, [0, -length / 2, 0], [0, 0, 0], pivot);
      addMesh(new THREE.SphereGeometry(0.13, 16, 12), darkMetal, [0, 0, 0], [0, 0, 0], pivot);
      arm.add(pivot);
      joints.push(pivot);
      x += side * 0.27;
      y -= 0.35;
    });
    addMesh(new THREE.ConeGeometry(0.13, 0.42, 3), ivory, [x, y - 0.12, 0.12], [0, 0, side * 0.48], arm);
    arm.userData.joints = joints;
    return arm;
  }
  const leftArm = component(makeArm(-1), [-3.65, -0.7, 0.65], [-0.16, 0.28, -0.34], 1.1, 5);
  const rightArm = component(makeArm(1), [3.65, -0.7, -0.65], [0.16, -0.28, 0.34], 1.1, 5);

  // Thrusters and instrument modules.
  const modules = new THREE.Group();
  const thrusterRotors = [];
  for (let side = -1; side <= 1; side += 2) {
    addMesh(new THREE.CylinderGeometry(0.28, 0.24, 0.68, 24), darkMetal, [side * 1.42, 0.35, 0], [0, 0, Math.PI / 2], modules);
    addMesh(new THREE.TorusGeometry(0.255, 0.038, 10, 28), metal, [side * 1.76, 0.35, 0], [0, Math.PI / 2, 0], modules);
    const rotor = new THREE.Group();
    rotor.position.set(side * 1.78, 0.35, 0);
    rotor.rotation.y = Math.PI / 2;
    for (let blade = 0; blade < 4; blade += 1) addMesh(new THREE.BoxGeometry(0.055, 0.21, 0.025), darkMetal, [0, 0, 0], [0, 0, blade * Math.PI / 2], rotor);
    modules.add(rotor);
    thrusterRotors.push(rotor);
    addMesh(new THREE.CylinderGeometry(0.035, 0.035, 0.34, 8), metal, [side * 1.22, 0.05, 0], [0, 0, 0], modules);
    addMesh(new THREE.BoxGeometry(0.38, 0.24, 0.5), ivory, [side * 1.28, -0.72, 0.25], [0, 0, 0], modules);
  }
  for (let side = -1; side <= 1; side += 2) {
    addMesh(new THREE.CylinderGeometry(0.035, 0.035, 2.15, 8), metal, [side * 0.93, 0, -0.5], [0, 0, side * 0.33], modules);
    addMesh(new THREE.BoxGeometry(0.22, 0.08, 0.06), amberMaterial, [side * 1.31, -0.57, 0.51], [0, 0, 0], modules);
  }
  component(modules, [0, 1.65, -2.6], [0.2, 0.24, 0.1], 1, 4);

  // Seabed with deterministic rocks.
  const floor = new THREE.Group();
  addMesh(new THREE.PlaneGeometry(80, 80, 24, 24), new THREE.MeshStandardMaterial({ color: 0x091315, roughness: 1 }), [0, -4.7, -6], [-Math.PI / 2, 0, 0], floor);
  for (let i = 0; i < 42; i += 1) {
    const rock = addMesh(new THREE.DodecahedronGeometry(0.15 + (i % 7) * 0.075, 0), new THREE.MeshStandardMaterial({ color: i % 3 ? 0x11191a : 0x29251d, roughness: 1 }), [((i * 37) % 21) - 10, -4.5 + (i % 3) * 0.03, -((i * 53) % 18)], [i * 0.7, i * 0.33, i], floor);
    rock.scale.y = 0.35 + (i % 4) * 0.12;
  }
  scene.add(floor);

  // Hydrothermal discovery structure.
  const chimney = new THREE.Group();
  chimney.position.set(-3.2, -4.4, -1.8);
  for (let i = 0; i < 9; i += 1) {
    const stem = addMesh(new THREE.CylinderGeometry(0.18 + (i % 3) * 0.08, 0.34, 1.2 + (i % 5) * 0.45, 8), new THREE.MeshStandardMaterial({ color: i % 2 ? 0x282319 : 0x182124, roughness: 0.94 }), [(i % 3) * 0.38, (1.2 + (i % 5) * 0.45) / 2, Math.floor(i / 3) * 0.35], [0.08 * i, 0, 0.05 * i], chimney);
    stem.castShadow = true;
  }
  world.add(chimney);

  // Layered marine snow: near, mid and far water volumes move independently.
  const particleLayers = [];
  function particleLayer(count, spread, size, opacity, zOffset) {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (((i * 47 + zOffset * 11) % 101) / 100 - 0.5) * spread;
      positions[i * 3 + 1] = (((i * 71 + zOffset * 7) % 103) / 102 - 0.5) * spread;
      positions[i * 3 + 2] = -(((i * 29 + zOffset * 13) % 97) / 96) * spread + zOffset;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ color: 0x8aa6a1, size, sizeAttenuation: true, transparent: true, opacity, depthWrite: false });
    const points = new THREE.Points(geometry, material);
    points.userData = { baseOpacity: opacity, drift: 0.045 - particleLayers.length * 0.012, lateral: 0.025 - particleLayers.length * 0.006 };
    particleLayers.push(points);
    scene.add(points);
  }
  particleLayer(mobile ? 90 : 180, 18, 0.042, 0.32, 5);
  particleLayer(mobile ? 170 : 360, 25, 0.021, 0.2, 0);
  particleLayer(mobile ? 220 : 520, 36, 0.01, 0.1, -8);

  // Bioluminescent organisms and final network.
  const life = new THREE.Group();
  for (let i = 0; i < 28; i += 1) {
    const organism = addMesh(new THREE.SphereGeometry(0.035 + (i % 4) * 0.012, 8, 6), energyMaterial, [((i * 43) % 97) / 9 - 5.2, ((i * 31) % 73) / 10 - 3, -((i * 17) % 50) / 9], [0, 0, 0], life);
    organism.userData.phase = i * 0.63;
  }
  scene.add(life);

  const network = new THREE.Group();
  const networkNodes = [];
  for (let i = 0; i < 22; i += 1) {
    const angle = i / 22 * Math.PI * 2;
    const radius = 2.8 + (i % 5) * 0.6;
    const node = new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle * 1.7) * 2.8, Math.sin(angle) * radius - 2);
    networkNodes.push(node);
    addMesh(new THREE.IcosahedronGeometry(0.045 + (i % 3) * 0.015, 1), amberMaterial, node.toArray(), [0, 0, 0], network);
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), node]);
    network.add(new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ color: i % 2 ? 0x3faeac : 0xd3a45f, transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending })));
  }
  scene.add(network);

  const sonar = new THREE.Group();
  for (let i = 0; i < 3; i += 1) addMesh(new THREE.TorusGeometry(1, 0.008, 5, 96), new THREE.MeshBasicMaterial({ color: 0x5a9d98, transparent: true, opacity: 0.18 }), [0, 0, 0], [Math.PI / 2, 0, 0], sonar);
  sonar.position.set(0, -2.7, 0);
  scene.add(sonar);

  const silhouettes = new THREE.Group();
  for (let i = 0; i < 7; i += 1) {
    const height = 2.4 + (i % 4) * 1.3;
    const rock = addMesh(new THREE.ConeGeometry(0.8 + (i % 3) * 0.5, height, 7), new THREE.MeshStandardMaterial({ color: 0x060b0c, roughness: 1 }), [-10 + i * 3.4, -4.6 + height / 2, -11 - (i % 3) * 3], [0.08 * i, i * 0.4, 0.04 * i], silhouettes);
    rock.scale.x = 0.55;
  }
  scene.add(silhouettes);

  const hemi = new THREE.HemisphereLight(0x3b7074, 0x020303, 1.25);
  scene.add(hemi);
  const key = new THREE.SpotLight(0xb5e7df, 80, 35, 0.42, 0.7, 1.2);
  key.position.set(-5, 7, 8);
  key.castShadow = !mobile;
  key.shadow.mapSize.set(1024, 1024);
  scene.add(key);
  const rim = new THREE.PointLight(0xd49b52, 18, 14, 2);
  rim.position.set(4, -1, 4);
  scene.add(rim);
  const coreLight = new THREE.PointLight(0x43a7a4, 3, 6, 2);
  vessel.add(coreLight);
  const navigationLights = [];
  for (let side = -1; side <= 1; side += 2) {
    const lamp = addMesh(new THREE.SphereGeometry(0.035, 10, 8), side < 0 ? amberMaterial : energyMaterial, [side * 1.33, 0.82, 0.55]);
    navigationLights.push(lamp);
  }
  const inspectionLight = new THREE.SpotLight(0xbcded5, 0, 16, 0.24, 0.7, 1.4);
  inspectionLight.position.set(0.65, -0.05, 1.45);
  inspectionLight.target.position.set(-3.2, -3.2, -1.8);
  vessel.add(inspectionLight);
  scene.add(inspectionLight.target);

  const cameraPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.4, 0.6, 11.8),
    new THREE.Vector3(-0.55, 0.45, 10.4),
    new THREE.Vector3(1.35, 0.75, 10.8),
    new THREE.Vector3(-1.2, 0.55, 9.4),
    new THREE.Vector3(0.45, 0.35, 10.3),
    new THREE.Vector3(0.8, 1.3, 11.6),
    new THREE.Vector3(-0.85, 0.15, 12.4),
    new THREE.Vector3(1.1, 0.8, 13.2),
    new THREE.Vector3(0, 1.5, 16.8),
  ], false, "catmullrom", 0.48);
  const targetPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.1, 0), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0.1, 0.15), new THREE.Vector3(0, -0.25, 0), new THREE.Vector3(0, -0.75, 0),
    new THREE.Vector3(-0.25, -0.85, 0), new THREE.Vector3(-1.35, -1.75, -0.8), new THREE.Vector3(0, -0.35, -1.5),
  ]);

  let targetProgress = 0;
  let progress = 0;
  let width = 0;
  let height = 0;
  const clock = new THREE.Clock();
  const lookTarget = new THREE.Vector3();
  const waterColor = new THREE.Color();
  const stateLabel = document.querySelector("[data-scene-state]");
  const systemLabel = document.querySelector("[data-scene-system]");
  const calloutLayer = document.querySelector(".scene__callouts");
  const calloutElements = Object.fromEntries([...document.querySelectorAll("[data-component-label]")].map((element) => [element.dataset.componentLabel, element]));
  const sonarUI = document.querySelector(".scene__sonar");
  const labels = ["PRESSURE FRAME / STANDBY", "FRAME / EXPOSED", "SYSTEMS / SEPARATED", "INTERNAL CORE / INSPECTION", "VESSEL / LOCKING", "DESCENT / ACTIVE", "PRESSURE / 41 MPA", "BIOLOGICAL SIGNAL / FOUND", "SURFACE LINK / TRANSMITTING"];

  function setComponentState(item, p) {
    const massDelay = (item.mass - 0.6) * 0.018;
    const separate = smooth(p, 0.075 + massDelay, 0.255 + massDelay);
    const assemblyStart = 0.345 + item.assemblyOrder * 0.018;
    const assemble = smooth(p, assemblyStart, assemblyStart + 0.105);
    const amount = separate * (1 - assemble);
    item.object.position.copy(item.home).addScaledVector(item.offset, amount);
    item.object.rotation.set(
      item.rotation.x + item.spin.x * amount,
      item.rotation.y + item.spin.y * amount,
      item.rotation.z + item.spin.z * amount,
    );
  }

  function placeLabel(element, object) {
    if (!element || !object) return;
    const point = new THREE.Vector3().setFromMatrixPosition(object.matrixWorld).project(camera);
    element.style.setProperty("--label-x", `${(point.x * 0.5 + 0.5) * 100}%`);
    element.style.setProperty("--label-y", `${(-point.y * 0.5 + 0.5) * 100}%`);
  }

  function animateScene(p, time) {
    componentData.forEach((item) => setComponentState(item, p));

    const lock = smooth(p, 0.44, 0.52);
    const descent = smooth(p, 0.52, 0.79);
    const underwaterDrift = smooth(p, 0.5, 0.62);
    vessel.position.y = lerp(0.2, -1.35, descent) + Math.sin(time * 0.42) * 0.035 * underwaterDrift;
    vessel.position.x = Math.sin(time * 0.17) * 0.045 * underwaterDrift;
    vessel.rotation.y = -0.28 + smooth(p, 0.12, 0.42) * 0.54 + smooth(p, 0.55, 1) * 0.24 + Math.sin(time * 0.2) * 0.018 * underwaterDrift;
    vessel.rotation.x = -0.06 + Math.sin(p * Math.PI * 2.4) * 0.045 + Math.sin(time * 0.16) * 0.012 * underwaterDrift;
    vessel.rotation.z = Math.sin(time * 0.14) * 0.009 * underwaterDrift;
    vessel.scale.setScalar(lerp(0.96, 1.02, lock) * lerp(1, 0.78, smooth(p, 0.88, 1)));

    const activation = smooth(p, 0.47, 0.61);
    energyMaterial.opacity = 0.28 + activation * 0.42;
    amberMaterial.opacity = 0.25 + activation * 0.5;
    glass.emissiveIntensity = 0.04 + activation * 0.16;
    coreLight.intensity = 1 + activation * 8 + Math.sin(time * 3.2) * activation * 0.5;
    coreOrb.scale.setScalar(1 + Math.sin(time * 3.4) * 0.07 * activation);
    coreRings.forEach((ring, i) => {
      ring.rotation.x += 0.002 * (i + 1) * (1 + activation * 3);
      ring.rotation.y -= 0.0015 * (i + 1) * (1 + activation * 3);
      ring.scale.setScalar(1 + activation * i * 0.1);
    });
    thrusterRotors.forEach((rotor, i) => { rotor.rotation.z = time * (descent > 0.02 ? 4.5 + i : 0.35); });
    navigationLights.forEach((lamp, i) => { lamp.scale.setScalar(0.8 + activation * (0.25 + Math.sin(time * 2.2 + i * Math.PI) * 0.08)); });
    inspectionLight.intensity = smooth(p, 0.58, 0.76) * 22;

    const pressurePhase = pulse(p, 0.63, 0.68, 0.74, 0.79);
    shells.forEach((panel, i) => {
      const compression = pressurePhase * (0.012 + i * 0.002);
      panel.scale.set(1 - compression, 1 + compression * 0.4, 1 - compression);
    });

    const lifePhase = smooth(p, 0.72, 0.79) * (1 - smooth(p, 0.91, 0.96));
    life.visible = lifePhase > 0.001;
    life.children.forEach((organism) => {
      const phase = organism.userData.phase ?? 0;
      organism.position.y += Math.sin(time * 0.8 + phase) * 0.0008;
      organism.scale.setScalar(lifePhase * (0.8 + Math.sin(time * 2 + phase) * 0.2));
    });

    const armReach = smooth(p, 0.82, 0.9);
    leftArm.userData.joints.forEach((joint, i) => { joint.rotation.z = joint.userData.baseRotation - armReach * (0.25 + i * 0.12); });
    rightArm.userData.joints.forEach((joint, i) => { joint.rotation.z = joint.userData.baseRotation + armReach * (0.22 + i * 0.1); });
    chimney.scale.setScalar(0.72 + smooth(p, 0.78, 0.9) * 0.28);

    const expansion = smooth(p, 0.9, 0.985);
    network.visible = expansion > 0.001;
    network.position.copy(vessel.position);
    network.scale.setScalar(0.08 + expansion * 0.92);
    network.rotation.y = time * 0.025;
    network.children.forEach((child) => {
      if (child.material) child.material.opacity = child.isLine ? expansion * 0.18 : expansion * 0.7;
    });

    const sonarPhase = pulse(p, 0.64, 0.69, 0.88, 0.94);
    sonar.visible = sonarPhase > 0.001;
    sonar.children.forEach((ring, i) => {
      const cycle = (p * 9 + i / 3) % 1;
      ring.scale.setScalar(0.4 + cycle * 5.5);
      ring.material.opacity = sonarPhase * (1 - cycle) * 0.18;
    });
    sonarUI.style.setProperty("--sonar-opacity", sonarPhase.toFixed(3));
    sonarUI.style.setProperty("--sonar-scale", (0.2 + ((p * 8) % 1) * 0.8).toFixed(3));

    const depthDarkness = smooth(p, 0.14, 0.88);
    particleLayers.forEach((layer, index) => {
      layer.position.y = -((time * layer.userData.drift) % 2.4);
      layer.position.x = Math.sin(time * (0.08 + index * 0.025) + index) * layer.userData.lateral;
      layer.material.opacity = layer.userData.baseOpacity * (1 - depthDarkness * 0.62) + inspectionLight.intensity * 0.002;
    });
    floor.position.y = lerp(-2.2, 0, smooth(p, 0.62, 0.82));
    chimney.visible = p > 0.72;

    camera.position.copy(cameraPath.getPointAt(clamp(p)));
    lookTarget.copy(targetPath.getPointAt(clamp(p)));
    camera.position.x += Math.sin(time * 0.13) * 0.035 * underwaterDrift;
    camera.position.y += Math.sin(time * 0.11 + 1.4) * 0.025 * underwaterDrift;
    if (width < 720) {
      camera.position.z += 4.1;
      camera.position.y += p < 0.12 ? -0.35 : 0.4;
    }
    camera.lookAt(lookTarget);
    camera.fov = lerp(width < 720 ? 44 : 36, width < 720 ? 48 : 40, smooth(p, 0.86, 1));
    camera.updateProjectionMatrix();

    scene.fog.density = lerp(0.026, 0.092, depthDarkness) - expansion * 0.018;
    hemi.intensity = lerp(1.35, 0.08, depthDarkness);
    key.intensity = lerp(58, 5, depthDarkness) + activation * 5;
    rim.intensity = lerp(7, 2, depthDarkness) + activation * 4;
    waterColor.setRGB(lerp(0.012, 0.002, depthDarkness), lerp(0.055, 0.009, depthDarkness), lerp(0.06, 0.012, depthDarkness));
    renderer.setClearColor(waterColor, 1);
    renderer.toneMappingExposure = lerp(1.05, 0.72, depthDarkness) + activation * 0.12 + lifePhase * 0.05;

    const inspection = pulse(p, 0.2, 0.255, 0.43, 0.49);
    calloutLayer.style.setProperty("--callout-opacity", inspection.toFixed(3));
    camera.updateMatrixWorld(true);
    scene.updateMatrixWorld(true);
    placeLabel(calloutElements.core, core);
    placeLabel(calloutElements.viewport, viewport);
    placeLabel(calloutElements.module, modules);
    placeLabel(calloutElements.crown, crown);

    const labelIndex = Math.min(8, Math.round(p * 8));
    stateLabel.textContent = labels[labelIndex];
    const pressureMpa = Math.round(p * 60);
    systemLabel.textContent = p > 0.58 ? `PRESSURE ${String(pressureMpa).padStart(2, "0")} MPA` : `CORE ${String(Math.round(activation * 100)).padStart(2, "0")}%`;
  }

  function render() {
    const dt = Math.min(0.05, clock.getDelta());
    const time = clock.elapsedTime;
    progress = reducedMotion.matches ? targetProgress : THREE.MathUtils.damp(progress, targetProgress, 10, dt);
    animateScene(progress, time);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  function resize() {
    width = canvas.clientWidth || innerWidth;
    height = canvas.clientHeight || innerHeight;
    const dpr = Math.min(devicePixelRatio, width < 720 ? 1.35 : 1.7);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    camera.aspect = width / Math.max(1, height);
    camera.updateProjectionMatrix();
  }

  resize();
  renderer.render(scene, camera);
  document.documentElement.classList.add("webgl-ready");
  render();
  return {
    setProgress(value) { targetProgress = clamp(value); },
    resize,
    destroy() { renderer.dispose(); },
  };
}
