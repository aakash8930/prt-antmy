import * as THREE from "three";
import {
  accentStripeMaterial,
  bodyLightMaterial,
  bodyMaterial,
  carbonMaterial,
  darkMetalMaterial,
  emissiveCoolMaterial,
  floorMaterial,
  glassMaterial,
  headlightMaterial,
  machinedMaterial,
  metalMaterial,
  rubberMaterial,
  taillightMaterial,
} from "./materials";

export type PartName =
  | "body"
  | "frame"
  | "battery"
  | "motor"
  | "suspension"
  | "brakes"
  | "wheelFront"
  | "wheelRear"
  | "electronics"
  | "cooling"
  | "dashboard";

export const PART_LABELS: Record<PartName, string> = {
  body: "AERODYNAMICS",
  frame: "FRAME",
  battery: "BATTERY",
  motor: "MOTOR",
  suspension: "SUSPENSION",
  brakes: "BRAKES",
  wheelFront: "WHEEL",
  wheelRear: "DRIVE",
  electronics: "ELECTRONICS",
  cooling: "THERMAL",
  dashboard: "DASHBOARD",
};

export interface MotorcycleModel {
  group: THREE.Group;
  parts: Record<PartName, THREE.Group>;
  rotor: THREE.Group;
  headlight: THREE.Mesh;
  taillight: THREE.Mesh;
  dashboardScreen: THREE.Mesh;
  wheelFront: THREE.Group;
  wheelRear: THREE.Group;
  dispose: () => void;
}

const box = (
  w: number,
  h: number,
  d: number,
  mat: THREE.Material,
  x: number,
  y: number,
  z: number,
  rx = 0,
  ry = 0,
  rz = 0,
): THREE.Mesh => {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  m.rotation.set(rx, ry, rz);
  m.castShadow = true;
  return m;
};

const cyl = (
  rTop: number,
  rBottom: number,
  h: number,
  mat: THREE.Material,
  x: number,
  y: number,
  z: number,
  rx = 0,
  ry = 0,
  rz = 0,
  seg = 24,
): THREE.Mesh => {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBottom, h, seg), mat);
  m.position.set(x, y, z);
  m.rotation.set(rx, ry, rz);
  m.castShadow = true;
  return m;
};

const sphere = (
  r: number,
  mat: THREE.Material,
  x: number,
  y: number,
  z: number,
  sx = 1,
  sy = 1,
  sz = 1,
): THREE.Mesh => {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 24), mat);
  m.position.set(x, y, z);
  m.scale.set(sx, sy, sz);
  m.castShadow = true;
  return m;
};

const torus = (
  r: number,
  tube: number,
  mat: THREE.Material,
  x: number,
  y: number,
  z: number,
  rx = 0,
  ry = 0,
  rz = 0,
): THREE.Mesh => {
  const m = new THREE.Mesh(new THREE.TorusGeometry(r, tube, 20, 40), mat);
  m.position.set(x, y, z);
  m.rotation.set(rx, ry, rz);
  m.castShadow = true;
  return m;
};

const makeGroup = (name: string): THREE.Group => {
  const g = new THREE.Group();
  g.name = name;
  return g;
};

const buildWheel = (
  x: number,
  partName: PartName,
  rubber: THREE.Material,
  metal: THREE.Material,
  machined: THREE.Material,
  dark: THREE.Material,
): THREE.Group => {
  const wheel = makeGroup(partName);
  wheel.position.set(x, 0.34, 0);
  wheel.add(torus(0.34, 0.085, rubber, 0, 0, 0));
  const rim = cyl(0.22, 0.22, 0.05, dark, 0, 0, 0, Math.PI / 2, 0, 0, 32);
  wheel.add(rim);
  const rimRing = torus(0.22, 0.018, metal, 0, 0, 0);
  wheel.add(rimRing);
  const hub = cyl(0.07, 0.07, 0.1, machined, 0, 0, 0, Math.PI / 2, 0, 0, 20);
  wheel.add(hub);
  // Spokes.
  for (let i = 0; i < 8; i++) {
    const spoke = new THREE.Mesh(
      new THREE.BoxGeometry(0.015, 0.4, 0.02),
      metal,
    );
    spoke.position.set(
      Math.cos((i / 8) * Math.PI * 2) * 0.1,
      Math.sin((i / 8) * Math.PI * 2) * 0.1,
      0,
    );
    spoke.rotation.z = (i / 8) * Math.PI * 2;
    spoke.castShadow = true;
    wheel.add(spoke);
  }
  // Brake disc.
  wheel.add(cyl(0.2, 0.2, 0.018, machined, 0, 0, -0.09, Math.PI / 2, 0, 0, 36));
  return wheel;
};

/**
 * Builds a stylized-but-believable high-performance electric motorcycle from
 * engineered primitives. Geometry is generated once; the controllers only
 * move/rotate named part groups, so reassembly is always exact.
 */
export const createMotorcycle = (): MotorcycleModel => {
  const group = makeGroup("volt-motorcycle");
  const body = bodyMaterial();
  const bodyLight = bodyLightMaterial();
  const carbon = carbonMaterial();
  const metal = metalMaterial();
  const dark = darkMetalMaterial();
  const machined = machinedMaterial();
  const rubber = rubberMaterial();
  const accent = accentStripeMaterial();
  const glass = glassMaterial();

  const parts: Record<PartName, THREE.Group> = {
    body: makeGroup("body"),
    frame: makeGroup("frame"),
    battery: makeGroup("battery"),
    motor: makeGroup("motor"),
    suspension: makeGroup("suspension"),
    brakes: makeGroup("brakes"),
    wheelFront: buildWheel(0.92, "wheelFront", rubber, metal, machined, dark),
    wheelRear: buildWheel(-0.62, "wheelRear", rubber, metal, machined, dark),
    electronics: makeGroup("electronics"),
    cooling: makeGroup("cooling"),
    dashboard: makeGroup("dashboard"),
  };

  // ---------------- FRAME ----------------
  parts.frame.add(box(1.16, 0.05, 0.05, dark, 0.0, 0.66, 0, 0, 0, -0.02));
  parts.frame.add(box(1.06, 0.045, 0.035, dark, -0.02, 0.6, 0.09, 0, 0, -0.02));
  parts.frame.add(box(1.06, 0.045, 0.035, dark, -0.02, 0.6, -0.09, 0, 0, -0.02));
  // steering head
  parts.frame.add(cyl(0.05, 0.06, 0.28, dark, 0.62, 0.78, 0, 0, 0, -0.42));
  // lower cradle
  parts.frame.add(box(0.6, 0.04, 0.04, dark, 0.18, 0.42, 0.09, 0, 0, 0.1));
  parts.frame.add(box(0.6, 0.04, 0.04, dark, 0.18, 0.42, -0.09, 0, 0, 0.1));

  // ---------------- BODY ----------------
  // Nose cone + headlight housing.
  parts.body.add(sphere(0.2, body, 0.82, 0.76, 0, 2.0, 0.9, 0.9));
  parts.body.add(box(0.26, 0.2, 0.22, bodyLight, 0.98, 0.78, 0, 0, 0, -0.28));
  // Fairing sides.
  parts.body.add(box(0.6, 0.4, 0.03, body, 0.62, 0.68, 0.16, 0.1, 0, -0.28));
  parts.body.add(box(0.6, 0.4, 0.03, body, 0.62, 0.68, -0.16, -0.1, 0, -0.28));
  // Tank.
  parts.body.add(sphere(0.22, body, 0.3, 0.88, 0, 2.0, 1.0, 1.05));
  // Tail wedge.
  parts.body.add(cyl(0.045, 0.16, 0.5, body, -0.22, 0.82, 0, 0, 0, Math.PI / 2, 16));
  parts.body.add(box(0.1, 0.14, 0.2, body, -0.5, 0.72, 0));
  // Under body / belly pan.
  parts.body.add(box(0.5, 0.06, 0.3, bodyLight, 0.22, 0.36, 0));
  // Accent stripe along tank.
  parts.body.add(box(0.5, 0.012, 0.02, accent, 0.3, 0.96, 0.1));
  parts.body.add(box(0.5, 0.012, 0.02, accent, 0.3, 0.96, -0.1));

  // ---------------- BATTERY ----------------
  parts.battery.add(box(0.64, 0.26, 0.28, dark, -0.02, 0.4, 0));
  parts.battery.add(box(0.64, 0.05, 0.3, carbon, -0.02, 0.53, 0));
  // cells simulated with thin top rails.
  for (let i = 0; i < 6; i++) {
    parts.battery.add(
      cyl(0.02, 0.02, 0.22, machined, -0.24 + i * 0.09, 0.4, 0.1, 0, 0, 0, 8),
    );
  }
  // busbars
  parts.battery.add(box(0.5, 0.02, 0.03, metal, -0.02, 0.36, 0.12));
  parts.battery.add(box(0.5, 0.02, 0.03, metal, -0.02, 0.36, -0.12));
  // Structural housing clamps.
  parts.battery.add(box(0.66, 0.04, 0.05, dark, -0.02, 0.3, 0.1));
  parts.battery.add(box(0.66, 0.04, 0.05, dark, -0.02, 0.3, -0.1));

  // ---------------- MOTOR ----------------
  const motor = parts.motor;
  const housing = cyl(0.17, 0.17, 0.34, machined, -0.16, 0.52, 0, 0, 0, Math.PI / 2, 32);
  motor.add(housing);
  motor.add(torus(0.18, 0.012, metal, -0.16, 0.52, 0, 0, Math.PI / 2, 0));
  motor.add(torus(0.18, 0.012, metal, -0.16, 0.52, 0, 0, Math.PI / 2, 0));
  motor.add(cyl(0.08, 0.08, 0.12, dark, -0.4, 0.52, 0, 0, 0, Math.PI / 2, 20));
  // Rotor visible in the core phase.
  const rotor = makeGroup("rotor");
  const rotorMat = emissiveCoolMaterial(1.8);
  const rotorCore = cyl(0.06, 0.06, 0.2, rotorMat, 0, 0, 0, 0, 0, Math.PI / 2, 24);
  rotor.add(rotorCore);
  for (let i = 0; i < 8; i++) {
    const fin = box(0.02, 0.16, 0.03, metal, 0, 0, 0);
    fin.position.set(0, Math.cos((i / 8) * Math.PI * 2) * 0.1, Math.sin((i / 8) * Math.PI * 2) * 0.1);
    fin.rotation.x = (i / 8) * Math.PI * 2;
    rotor.add(fin);
  }
  motor.add(rotor);
  parts.motor.userData.housing = housing;
  parts.motor.userData.rotor = rotor;

  // ---------------- SUSPENSION ----------------
  parts.suspension.add(cyl(0.022, 0.022, 0.68, dark, 0.85, 0.64, 0.09, 0, 0, -0.2));
  parts.suspension.add(cyl(0.022, 0.022, 0.68, dark, 0.85, 0.64, -0.09, 0, 0, -0.2));
  parts.suspension.add(cyl(0.012, 0.012, 0.68, machined, 0.85, 0.64, 0.105, 0, 0, -0.2));
  // Rear shock.
  parts.suspension.add(cyl(0.02, 0.03, 0.4, dark, -0.1, 0.52, 0.12, 0, 0, 0.62, 14));
  // Triple clamp.
  parts.suspension.add(box(0.06, 0.04, 0.26, machined, 0.62, 0.84, 0));
  // Handlebar.
  parts.suspension.add(cyl(0.018, 0.018, 0.36, machined, 0.56, 0.99, 0, Math.PI / 2, 0, 0));

  // ---------------- BRAKES ----------------
  parts.brakes.add(box(0.08, 0.14, 0.06, dark, 0.92, 0.48, -0.12, 0, 0, 0.5));
  parts.brakes.add(box(0.08, 0.14, 0.06, dark, -0.62, 0.48, -0.12, 0, 0, 0.5));
  parts.brakes.add(cyl(0.012, 0.012, 0.14, metal, 0.92, 0.34, -0.09, 0, 0, Math.PI / 2, 8));
  parts.brakes.add(cyl(0.012, 0.012, 0.14, metal, -0.62, 0.34, -0.09, 0, 0, Math.PI / 2, 8));

  // ---------------- ELECTRONICS ----------------
  parts.electronics.add(box(0.16, 0.1, 0.14, carbon, 0.42, 0.62, 0.02));
  parts.electronics.add(box(0.1, 0.04, 0.1, dark, 0.5, 0.55, 0.02));
  parts.electronics.add(box(0.18, 0.02, 0.02, metal, 0.42, 0.68, 0.02));
  // charge port
  parts.electronics.add(cyl(0.03, 0.03, 0.05, metal, 0.5, 0.66, 0.02, Math.PI / 2, 0, 0, 12));

  // ---------------- COOLING ----------------
  parts.cooling.add(box(0.3, 0.26, 0.05, metal, 0.64, 0.5, 0.02));
  for (let i = 0; i < 6; i++) {
    parts.cooling.add(box(0.02, 0.2, 0.07, dark, 0.64, 0.5, 0.02 - 0.0, 0, 0, (i % 2) * 0.0 + 0.02));
  }
  // cooling lines to motor
  parts.cooling.add(cyl(0.01, 0.01, 0.4, metal, 0.32, 0.5, 0.08, 0, 0, Math.PI / 2 - 0.25, 8));

  // ---------------- DASHBOARD ----------------
  parts.dashboard.add(box(0.3, 0.2, 0.1, dark, 0.56, 0.98, 0, 0, 0, -0.28));
  const screenMat = new THREE.MeshStandardMaterial({
    color: 0x050808,
    emissive: new THREE.Color(0x9fe8dd),
    emissiveIntensity: 0,
    metalness: 0.2,
    roughness: 0.3,
  });
  const screen = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.02, 0.12), screenMat);
  screen.position.set(0.56, 1.08, 0);
  screen.rotation.x = -0.28;
  parts.dashboard.add(screen);

  // ---------------- LIGHTS ----------------
  const headlight = new THREE.Mesh(
    new THREE.BoxGeometry(0.05, 0.08, 0.16),
    headlightMaterial(0),
  );
  headlight.position.set(1.04, 0.82, 0);
  headlight.rotation.z = -0.3;
  group.add(headlight);

  const taillight = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 0.05, 0.1),
    taillightMaterial(0),
  );
  taillight.position.set(-0.78, 0.74, 0);
  group.add(taillight);

  // ---------------- FLOOR ----------------
  const floor = new THREE.Mesh(new THREE.CircleGeometry(8, 64), floorMaterial());
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0.01;
  floor.receiveShadow = true;
  group.add(floor);
  const floorRing = new THREE.Mesh(
    new THREE.RingGeometry(1.25, 1.26, 64),
    new THREE.MeshBasicMaterial({
      color: 0x9fe8dd,
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide,
    }),
  );
  floorRing.rotation.x = -Math.PI / 2;
  floorRing.position.y = 0.012;
  group.add(floorRing);

  // Assemble.
  Object.values(parts).forEach((part) => group.add(part));

  return {
    group,
    parts,
    rotor,
    headlight,
    taillight,
    dashboardScreen: screen,
    wheelFront: parts.wheelFront,
    wheelRear: parts.wheelRear,
    dispose: () => {
      group.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.isMesh) {
          mesh.geometry.dispose();
          const mat = mesh.material as THREE.Material | THREE.Material[];
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
          else mat?.dispose();
        }
      });
    },
  };
};
