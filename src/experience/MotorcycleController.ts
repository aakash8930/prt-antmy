import type * as THREE from "three";
import type { MotorcycleModel, PartName } from "./Motorcycle";
import { getAct, windowRange } from "@/animation/MasterTimeline";
import { clamp } from "@/utils/math";

/**
 * MotorcycleController — choreographs the assembled machine on top of the
 * camera: wheel/rotor speed, light activation, dashboard wake, and the
 * assembled/exploded visibility windows for the battery/core acts. Never owns
 * scroll state; it only reads the master progress.
 */
export class MotorcycleController {
  constructor(private model: MotorcycleModel) {}

  update = (progress: number, time: number, velocity: number) => {
    const m = this.model;
    const act = getAct(progress);

    // --- Wheel spin: mostly idle, high during performance. ---
    const performance = windowRange(progress, 0.78, 0.82, 0.86, 0.9);
    const inspectSpin = windowRange(progress, 0.08, 0.2, 0.28, 0.34) * 0.5;
    const spinSpeed = performance * (14 + velocity * 4) + inspectSpin * 0.8;
    const spin = time * (0.35 + spinSpeed);
    m.wheelFront.rotation.z = spin;
    m.wheelRear.rotation.z = spin;

    // --- Rotor (core act). ---
    const core = windowRange(progress, 0.66, 0.7, 0.74, 0.79);
    m.rotor.rotation.x = time * (1.2 + core * 22);
    m.rotor.rotation.z = Math.sin(time * 0.6) * 0.04;

    // --- Lights. ---
    const ignition = windowRange(progress, 0.0, 0.03, 0.05, 0.07);
    const human = windowRange(progress, 0.89, 0.92, 0.94, 0.96);
    const final = act.index === 8 ? 1 : 0;
    const wake = clamp(ignition + human + final * 0.7, 0, 1);
    const headMat = m.headlight.material as THREE.MeshStandardMaterial;
    const tailMat = m.taillight.material as THREE.MeshStandardMaterial;
    const screenMat = m.dashboardScreen.material as THREE.MeshStandardMaterial;
    const pulse = 0.6 + Math.sin(time * 1.6) * 0.08;
    headMat.emissiveIntensity = wake * pulse * 1.4;
    tailMat.emissiveIntensity = wake * 0.8;
    screenMat.emissiveIntensity = (ignition * 0.3 + human * 1.1 + final * 0.8) * pulse;

    // --- Local (non-library) machine motion: very subtle object yaw. ---
    // The 3D interaction orbit is handled by the camera; the object responds
    // only slightly so the two systems never fight.
    const baseYaw = Math.sin(progress * Math.PI * 1.4) * 0.03;
    m.group.rotation.y += (baseYaw - m.group.rotation.y) * 0.03;

    // --- Visibility windows for battery/core: parts drift out of view. ---
    const powerDepth = windowRange(progress, 0.57, 0.62, 0.64, 0.68);
    const coreFocus = windowRange(progress, 0.66, 0.72, 0.74, 0.8);
    const hidden = (name: PartName) => {
      if (powerDepth > 0.3 && visibilityZone(name, powerDepth) === "battery") {
        return true;
      }
      if (coreFocus > 0.25 && name !== "motor") {
        return true;
      }
      return false;
    };
    (Object.keys(m.parts) as PartName[]).forEach((name) => {
      const target = hidden(name);
      m.parts[name].visible = !target;
    });
  };

  setAccent = (x: number) => {
    // Reserved: drive the accent stripe emissive from performance state.
    void x;
  };
}

/**
 * During the battery "travel", only the pack/motor/electronics remain in the
 * shot; the outer shell parts step aside like a technical cross-section.
 */
const BATTERY_KEYS = new Set<PartName>(["battery", "motor", "electronics", "dashboard"]);

const visibilityZone = (name: PartName, depth: number): "battery" | "shell" => {
  if (BATTERY_KEYS.has(name) && depth > 0.5) return "shell";
  return depth > 0.5 ? "battery" : "shell";
};
