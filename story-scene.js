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
  } catch (error) {
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

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x031012, 0.052);
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 0.1, 10);

  const world = new THREE.Group();
  scene.add(world);
  const vessel = new THREE.Group();
  vessel.rotation.set(-0.08, -0.32, 0.02);
  world.add(vessel);

  const metal = new THREE.MeshStandardMaterial({ color: 0x767b76, metalness: 0.88, roughness: 0.28 });
  const darkMetal = new THREE.MeshStandardMaterial({ color: 0x12191a, metalness: 0.82, roughness: 0.34 });
  const ivory = new THREE.MeshPhysicalMaterial({ color: 0xc7c0aa, metalness: 0.35, roughness: 0.34, clearcoat: 0.25 });
  const glass = new THREE.MeshPhysicalMaterial({ color: 0x062f35, emissive: 0x062027, emissiveIntensity: 0.28, metalness: 0.05, roughness: 0.05, transmission: 0.58, transparent: true, opacity: 0.88, thickness: 0.35 });
  const energyMaterial = new THREE.MeshBasicMaterial({ color: 0x50e5e1, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending });
  const amberMaterial = new THREE.MeshBasicMaterial({ color: 0xe0a75d, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending });

  const componentData = [];
  function component(object, offset, rotation, mass = 1) {
    vessel.add(object);
    componentData.push({ object, home: object.position.clone(), rotation: object.rotation.clone(), offset: new THREE.Vector3(...offset), spin: new THREE.Vector3(...rotation), mass });
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
  component(chamber, [0, 0, -2.5], [0, 0.2, 0], 1.4);

  const core = new THREE.Group();
  const coreOrb = addMesh(new THREE.IcosahedronGeometry(0.34, 3), energyMaterial, [0, 0, 0], [0, 0, 0], core);
  const coreRings = [];
  for (let i = 0; i < 3; i += 1) {
    const ring = addMesh(new THREE.TorusGeometry(0.53 + i * 0.13, 0.018, 8, 64), amberMaterial, [0, 0, 0], [i * 0.85, i * 0.6, i * 0.25], core);
    coreRings.push(ring);
  }
  component(core, [0, 0, 2.8], [0.4, -0.5, 0.2], 0.6);

  // Structural decks.
  const ballast = new THREE.Group();
  addMesh(new THREE.CylinderGeometry(1.14, 1.27, 0.32, 48), darkMetal, [0, -1.47, 0], [0, 0, 0], ballast);
  addMesh(new THREE.TorusGeometry(1.18, 0.08, 12, 64), metal, [0, -1.3, 0], [Math.PI / 2, 0, 0], ballast);
  for (let i = 0; i < 8; i += 1) {
    const a = i / 8 * Math.PI * 2;
    addMesh(new THREE.BoxGeometry(0.17, 0.19, 0.12), ivory, [Math.sin(a) * 1.08, -1.48, Math.cos(a) * 1.08], [0, a, 0], ballast);
  }
  component(ballast, [0, -3.2, 0.5], [0.1, 0.25, -0.08], 1.5);

  const crown = new THREE.Group();
  addMesh(new THREE.TorusGeometry(0.82, 0.075, 12, 64), metal, [0, 1.38, 0], [Math.PI / 2, 0, 0], crown);
  addMesh(new THREE.TorusGeometry(0.61, 0.035, 8, 64), amberMaterial, [0, 1.38, 0], [Math.PI / 2, 0, 0], crown);
  component(crown, [0.2, 3.25, -0.4], [-0.15, -0.2, 0.12], 0.8);

  // Independently controlled pressure shell quadrants.
  const shells = [];
  const shellOffsets = [[-3.2, 0.5, 0.3], [3.2, 0.45, -0.2], [-1.4, 1.3, -2.5], [1.1, -1.2, 2.4]];
  for (let i = 0; i < 4; i += 1) {
    const panel = new THREE.Group();
    const patch = addMesh(new THREE.SphereGeometry(1.42, 32, 24, i * Math.PI / 2 + 0.05, Math.PI / 2 - 0.1, 0.18, Math.PI - 0.36), ivory, [0, 0, 0], [0, 0, 0], panel);
    patch.scale.set(1, 1.12, 1);
    for (let r = -1; r <= 1; r += 1) addMesh(new THREE.TorusGeometry(1.445, 0.025, 6, 48, Math.PI / 2 - 0.12), metal, [0, 0, 0], [Math.PI / 2, 0, i * Math.PI / 2 + r * 0.03], panel);
    shells.push(component(panel, shellOffsets[i], [0.2 * (i - 1), 0.35 * (i % 2 ? 1 : -1), 0.12 * i], 1.7));
  }

  // Front viewport assembly.
  const viewport = new THREE.Group();
  addMesh(new THREE.CylinderGeometry(0.58, 0.66, 0.28, 48), metal, [0, 0, 1.36], [Math.PI / 2, 0, 0], viewport);
  addMesh(new THREE.CylinderGeometry(0.48, 0.48, 0.31, 48), glass, [0, 0, 1.43], [Math.PI / 2, 0, 0], viewport);
  addMesh(new THREE.TorusGeometry(0.6, 0.055, 10, 48), ivory, [0, 0, 1.53], [0, 0, 0], viewport);
  component(viewport, [-2.6, 0.3, 2.8], [-0.35, -0.55, -0.2], 0.9);

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
  const leftArm = component(makeArm(-1), [-3.8, -1.2, 1.4], [-0.2, 0.4, -0.45], 1.1);
  const rightArm = component(makeArm(1), [3.8, -0.8, -1.3], [0.25, -0.35, 0.48], 1.1);

  // Thrusters and instrument modules.
  const modules = new THREE.Group();
  for (let side = -1; side <= 1; side += 2) {
    addMesh(new THREE.CylinderGeometry(0.24, 0.24, 0.62, 20), darkMetal, [side * 1.42, 0.35, 0], [0, 0, Math.PI / 2], modules);
    addMesh(new THREE.TorusGeometry(0.24, 0.035, 8, 24), amberMaterial, [side * 1.72, 0.35, 0], [0, Math.PI / 2, 0], modules);
    addMesh(new THREE.BoxGeometry(0.34, 0.22, 0.48), ivory, [side * 1.28, -0.72, 0.25], [0, 0, 0], modules);
  }
  component(modules, [0, 1.8, -3.1], [0.25, 0.3, 0.12], 1);

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

  // Instanced water particles.
  const particleCount = mobile ? 420 : 900;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i += 1) {
    positions[i * 3] = ((i * 47) % 101) / 5 - 10;
    positions[i * 3 + 1] = ((i * 71) % 103) / 5 - 10;
    positions[i * 3 + 2] = -((i * 29) % 90) / 5 + 4;
  }
  const particlesGeometry = new THREE.BufferGeometry();
  particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const particlesMaterial = new THREE.PointsMaterial({ color: 0x88b8b4, size: 0.018, transparent: true, opacity: 0.38, depthWrite: false });
  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);

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
  const coreLight = new THREE.PointLight(0x43e2dc, 5, 7, 2);
  vessel.add(coreLight);

  const cameraPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.1, 0.2, 10.2),
    new THREE.Vector3(-0.8, 0.3, 8.1),
    new THREE.Vector3(3.1, 1.1, 7.2),
    new THREE.Vector3(-2.6, 0.4, 8.8),
    new THREE.Vector3(0.2, 0.1, 7.1),
    new THREE.Vector3(1.2, 2.1, 10.8),
    new THREE.Vector3(-2.2, -0.3, 8.2),
    new THREE.Vector3(2.6, 1.1, 10.6),
    new THREE.Vector3(0, 1.8, 15.5),
  ], false, "catmullrom", 0.42);
  const targetPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -0.5, 0), new THREE.Vector3(0, -1.2, 0),
    new THREE.Vector3(-0.5, -1.1, 0), new THREE.Vector3(-2.2, -2.4, -1.4), new THREE.Vector3(0, 0, -2),
  ]);

  let targetProgress = 0;
  let progress = 0;
  let width = 0;
  let height = 0;
  const clock = new THREE.Clock();
  const lookTarget = new THREE.Vector3();
  const stateLabel = document.querySelector("[data-scene-state]");
  const systemLabel = document.querySelector("[data-scene-system]");
  const labels = ["PRESSURE FRAME / STANDBY", "FRAME / EXPOSED", "SYSTEMS / SEPARATED", "INTERNAL CORE / INSPECTION", "VESSEL / LOCKING", "DESCENT / ACTIVE", "PRESSURE / 41 MPA", "BIOLOGICAL SIGNAL / FOUND", "SURFACE LINK / TRANSMITTING"];

  function setComponentState(item, exploded) {
    const delay = (item.mass - 0.6) * 0.075;
    const weighted = smooth(exploded, delay, 1);
    item.object.position.copy(item.home).addScaledVector(item.offset, weighted);
    item.object.rotation.set(
      item.rotation.x + item.spin.x * weighted,
      item.rotation.y + item.spin.y * weighted,
      item.rotation.z + item.spin.z * weighted,
    );
  }

  function animateScene(p, time) {
    // Full explode, sustained internal inspection, then physical reassembly.
    const explodeOut = smooth(p, 0.08, 0.265);
    const assemble = smooth(p, 0.345, 0.49);
    const exploded = explodeOut * (1 - assemble);
    componentData.forEach((item) => setComponentState(item, exploded));

    const lock = smooth(p, 0.44, 0.52);
    vessel.position.y = lerp(0.25, -1.05, smooth(p, 0.52, 0.68)) + Math.sin(time * 0.55) * 0.055;
    vessel.position.x = lerp(0, 1.15, smooth(p, 0.76, 0.89)) - lerp(0, 1.15, smooth(p, 0.9, 1));
    vessel.rotation.y = -0.32 + p * 0.9 + Math.sin(time * 0.22) * 0.025;
    vessel.rotation.x = -0.08 + Math.sin(p * Math.PI * 3) * 0.09;
    vessel.scale.setScalar(lerp(0.94, 1.05, lock) * lerp(1, 0.74, smooth(p, 0.9, 1)));

    const activation = smooth(p, 0.47, 0.61);
    energyMaterial.opacity = 0.35 + activation * 0.65;
    amberMaterial.opacity = 0.28 + activation * 0.72;
    glass.emissiveIntensity = 0.18 + activation * 1.35;
    coreLight.intensity = 2 + activation * 20 + Math.sin(time * 4) * activation * 2;
    coreOrb.scale.setScalar(1 + Math.sin(time * 3.4) * 0.07 * activation);
    coreRings.forEach((ring, i) => {
      ring.rotation.x += 0.002 * (i + 1) * (1 + activation * 3);
      ring.rotation.y -= 0.0015 * (i + 1) * (1 + activation * 3);
      ring.scale.setScalar(1 + activation * i * 0.1);
    });

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
    network.scale.setScalar(0.08 + expansion * 0.92);
    network.rotation.y = time * 0.025;
    network.children.forEach((child) => {
      if (child.material) child.material.opacity = child.isLine ? expansion * 0.3 : expansion;
    });

    particles.rotation.y = time * 0.008;
    particles.position.y = (time * 0.035) % 1;
    particlesMaterial.opacity = 0.22 + smooth(p, 0.52, 0.76) * 0.35;
    floor.position.y = lerp(-2.2, 0, smooth(p, 0.62, 0.82));
    chimney.visible = p > 0.72;

    camera.position.copy(cameraPath.getPointAt(clamp(p)));
    lookTarget.copy(targetPath.getPointAt(clamp(p)));
    if (width < 720) {
      camera.position.z += 3.7;
      camera.position.y += p < 0.12 ? -0.5 : 0.3;
    }
    camera.lookAt(lookTarget);
    camera.fov = lerp(width < 720 ? 43 : 34, width < 720 ? 48 : 39, smooth(p, 0.86, 1));
    camera.updateProjectionMatrix();

    scene.fog.density = lerp(0.035, 0.075, smooth(p, 0.46, 0.7)) - expansion * 0.025;
    renderer.toneMappingExposure = 0.88 + activation * 0.24 + lifePhase * 0.12;

    const labelIndex = Math.min(8, Math.round(p * 8));
    stateLabel.textContent = labels[labelIndex];
    systemLabel.textContent = `CORE ${String(Math.round(activation * 100)).padStart(2, "0")}%`;
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
