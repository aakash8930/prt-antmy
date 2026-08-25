import * as THREE from "three";
import type { MotorcycleModel, PartName } from "./Motorcycle";
import { getAct, windowRange } from "@/animation/MasterTimeline";
import { clamp, easeOut } from "@/utils/math";

const TARGET_POS: Record<PartName, [number, number, number]> = {
  body: [0.06, 0.52, 0.62],
  frame: [-0.1, -0.22, -0.5],
  battery: [-0.52, -0.24, 0.06],
  motor: [0.52, 0.02, -0.12],
  suspension: [0.34, 0.62, -0.2],
  brakes: [-0.56, -0.12, -0.35],
  wheelFront: [0.56, -0.06, 0.52],
  wheelRear: [-0.64, 0.0, -0.46],
  electronics: [0.2, 0.6, 0.32],
  cooling: [0.72, 0.42, -0.3],
  dashboard: [0.38, 0.92, 0.28],
};

const TARGET_ROT: Record<PartName, [number, number, number]> = {
  body: [0.12, 0, -0.08],
  frame: [0, -0.14, 0],
  battery: [0.08, 0, 0],
  motor: [0, -0.18, 0],
  suspension: [0.1, 0.16, 0],
  brakes: [0.1, -0.22, 0],
  wheelFront: [0, 0.18, 0],
  wheelRear: [0, -0.18, 0],
  electronics: [0, 0.2, 0],
  cooling: [0, -0.2, 0],
  dashboard: [0.06, -0.26, 0],
};

/**
 * ExplodedViewController — drives the assembled→exploded→assembled transition.
 * Each component moves along a meaningful engineering axis instead of a
 * generic radial burst. Scroll backward reassembles exactly because the
 * explosion factor is derived from the master progress (never latched state).
 */
export class ExplodedViewController {
  private parts: MotorcycleModel["parts"];
  private rest = new Map<PartName, THREE.Vector3>();
  private restRot = new Map<PartName, THREE.Euler>();
  private targets = new Map<PartName, THREE.Vector3>();
  private targetRots = new Map<PartName, THREE.Euler>();

  constructor(model: MotorcycleModel) {
    this.parts = model.parts;
    (Object.keys(this.parts) as PartName[]).forEach((key) => {
      const part = this.parts[key];
      this.rest.set(key, part.position.clone());
      this.restRot.set(key, part.rotation.clone());
      this.targets.set(key, new THREE.Vector3(...TARGET_POS[key]));
      this.targetRots.set(key, new THREE.Euler(...TARGET_ROT[key]));
    });
  }

  update = (progress: number, elapsed: number) => {
    // Explosion is active across the deconstruction act; a small residual
    // exists at the start of the power act while the camera enters the pack.
    const explode =
      windowRange(progress, 0.35, 0.47, 0.5, 0.62) *
      (getAct(progress).index >= 3 ? 0.88 : 0.0);
    const e = easeOut(clamp(explode, 0, 1));

    (Object.keys(this.parts) as PartName[]).forEach((key, i) => {
      const part = this.parts[key];
      const rest = this.rest.get(key)!;
      const target = this.targets.get(key)!;
      const rot = this.restRot.get(key)!;
      const targetRot = this.targetRots.get(key)!;

      part.position.set(
        rest.x + target.x * e,
        rest.y + target.y * e,
        rest.z + target.z * e,
      );
      part.rotation.set(
        rot.x + targetRot.x * e + Math.sin(elapsed * 0.5 + i) * 0.002 * e,
        rot.y + targetRot.y * e,
        rot.z + targetRot.z * e,
      );
    });
  };

  /** How far the model is currently exploded (for annotations/HUD). */
  getExplodeFactor(progress: number) {
    return clamp(explodeFor(progress), 0, 1);
  }
}

export const explodeFor = (progress: number) =>
  windowRange(progress, 0.35, 0.47, 0.5, 0.62) *
  (getAct(progress).index >= 3 ? 0.88 : 0.0);
