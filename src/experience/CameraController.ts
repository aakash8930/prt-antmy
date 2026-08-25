import * as THREE from "three";
import { clamp, damp, easeInOut } from "@/utils/math";
import { getAct } from "@/animation/MasterTimeline";

export interface PointerState {
  x: number;
  y: number;
  dragging: boolean;
  dragStartX: number;
  dragStartY: number;
  manualYaw: number;
  manualPitch: number;
}

export const emptyPointer = (): PointerState => ({
  x: 0,
  y: 0,
  dragging: false,
  dragStartX: 0,
  dragStartY: 0,
  manualYaw: 0,
  manualPitch: 0,
});

const POSITIONS: [number, number, number][] = [
  [3.7, 0.85, 6.2], // 0 ignore ignite
  [3.25, 0.95, 5.4], // 0.07 form
  [2.4, 0.85, 3.35], // 0.22 material
  [1.35, 0.42, 1.35], // 0.34 close-up
  [1.05, 1.55, 2.9], // 0.52 inspection
  [0.5, 0.62, 1.15], // 0.66 battery
  [-0.05, 0.62, 0.95], // 0.77 motor
  [-0.95, 0.52, 1.0], // 0.89 rear wheel
  [2.0, 0.72, 3.35], // 0.96 human
  [1.0, 0.64, 2.1], // 1.0 final
];

const TARGETS: [number, number, number][] = [
  [0, 0.9, 0],
  [0.25, 0.72, 0],
  [0, 0.72, 0],
  [0.6, 0.8, 0],
  [0, 0.62, 0],
  [-0.02, 0.42, 0],
  [-0.16, 0.52, 0],
  [-0.62, 0.34, 0],
  [0, 0.72, 0],
  [0, 0.66, 0],
];

const POSITION_KEYS = [0, 0.07, 0.22, 0.34, 0.52, 0.66, 0.77, 0.89, 0.96, 1];
const TARGET_KEYS = POSITION_KEYS;

/**
 * CameraController — choreographs the camera along real Catmull-Rom paths
 * over the master experience. It never hand-moves random axes; every frame is
 * sampled from a curve. Direct manipulation (drag during inspection) rotates
 * a spherical inspection orbit that overrides scroll-driven yaw so the user's
 * intent is respected.
 */
export class CameraController {
  private path: THREE.CatmullRomCurve3;
  private targetPath: THREE.CatmullRomCurve3;
  private currentPos = new THREE.Vector3(3.7, 0.85, 6.2);
  private currentTarget = new THREE.Vector3(0, 0.9, 0);
  private temp = new THREE.Vector3();
  private temp2 = new THREE.Vector3();
  private focus: THREE.Vector3 | null = null;
  private prevTime = 0;

  setFocus = (v: THREE.Vector3 | null) => {
    this.focus = v ? v.clone() : null;
  };

  getPathPoints = (count = 160) => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      const p = new THREE.Vector3();
      this.path.getPointAt(i / (count - 1), p);
      pts.push(p);
    }
    return pts;
  };

  constructor() {
    this.path = new THREE.CatmullRomCurve3(
      POSITIONS.map((p) => new THREE.Vector3(...p)),
      false,
      "catmullrom",
      0.5,
    );
    this.targetPath = new THREE.CatmullRomCurve3(
      TARGETS.map((p) => new THREE.Vector3(...p)),
      false,
      "catmullrom",
      0.5,
    );
  }

  private sample(progress: number, out: THREE.Vector3) {
    const curveT = clamp(progress, 0, 1) * (POSITION_KEYS.length - 1);
    const i = Math.min(POSITION_KEYS.length - 2, Math.floor(curveT));
    const t = curveT - i;
    const eased = easeInOut(t);
    this.path.getPointAt(clamp((i + eased) / (POSITION_KEYS.length - 1), 0, 1), out);
    return out;
  }

  private sampleTarget(progress: number, out: THREE.Vector3) {
    const curveT = clamp(progress, 0, 1) * (TARGET_KEYS.length - 1);
    const i = Math.min(TARGET_KEYS.length - 2, Math.floor(curveT));
    const t = curveT - i;
    const eased = easeInOut(t);
    this.targetPath.getPointAt(clamp((i + eased) / (TARGET_KEYS.length - 1), 0, 1), out);
    return out;
  }

  private inspectionRadius(progress: number) {
    const act = getAct(progress);
    // Manual orbit is available through the deconstruction/final inspection.
    const window =
      act.index >= 3 && act.index <= 4 ? 1 : act.index >= 7 ? 0.6 : 0;
    return window;
  }

  update = (
    camera: THREE.PerspectiveCamera,
    progress: number,
    pointer: PointerState,
    time: number,
  ) => {
    const delta = Math.min(0.05, Math.max(0, this.prevTime ? (time - this.prevTime) / 1000 : 0.016));
    this.prevTime = time;

    this.sample(progress, this.currentPos);
    this.sampleTarget(progress, this.currentTarget);

    // Subtle cursor parallax — shifts the camera, not the object.
    this.currentPos.x += pointer.x * 0.14 * -1;
    this.currentPos.y += pointer.y * 0.08;
    this.currentPos.z += pointer.x * 0.08;
    this.currentTarget.x += pointer.x * 0.08;
    this.currentTarget.y += pointer.y * 0.03;

    // Material act: slide the look target across the machine for the travel shot.
    const materialAct = getAct(progress).index === 2;
    if (materialAct) {
      const local = (progress - 0.22) / 0.12;
      this.currentTarget.x += (Math.sin(local * Math.PI) - 0.5) * 0.3;
      this.currentTarget.y += Math.sin(local * Math.PI) * 0.06;
    }

    // Direct part focus: pull the lens toward a selected component.
    if (this.focus) {
      this.temp2.copy(this.currentTarget).lerp(this.focus, 0.62);
      this.currentTarget.copy(this.temp2);
      const dir = this.temp2.subVectors(this.currentPos, this.currentTarget).normalize();
      this.currentPos.addScaledVector(dir, -0.28);
    }

    const inspection = this.inspectionRadius(progress);
    if (inspection > 0 && pointer.dragging) {
      // Spherical orbit around the bike's technical center.
      const center = this.temp.set(0, 0.58, 0);
      const baseYaw =
        Math.atan2(this.currentPos.z - center.z, this.currentPos.x - center.x);
      const radius = 2.5;
      const yaw = baseYaw + pointer.manualYaw;
      const pitch = clamp(0.32 + pointer.manualPitch, -0.35, 1.1);
      this.currentPos.set(
        center.x + Math.cos(yaw) * Math.cos(pitch) * radius,
        center.y + Math.sin(pitch) * radius,
        center.z + Math.sin(yaw) * Math.cos(pitch) * radius,
      );
      this.currentTarget.copy(center);
    }

    // Smoothing keeps the camera physically present even during fast scrubs.
    camera.position.x = damp(camera.position.x, this.currentPos.x, 7, delta);
    camera.position.y = damp(camera.position.y, this.currentPos.y, 7, delta);
    camera.position.z = damp(camera.position.z, this.currentPos.z, 7, delta);

    camera.lookAt(this.currentTarget);
  };
}
