import * as THREE from "three";
import { getAct } from "@/animation/MasterTimeline";
import { clamp, damp } from "@/utils/math";

export interface LightState {
  key: THREE.DirectionalLight;
  fill: THREE.DirectionalLight;
  rim: THREE.DirectionalLight;
  headlightPoint: THREE.PointLight;
  accentPoint: THREE.PointLight;
  ambient: THREE.HemisphereLight;
}

/**
 * LightingController — studio light choreography. Rather than brightening the
 * object, the lights reveal geometry and material. Act-driven intensities and
 * positions are updated every frame and smoothly damped.
 */
export class LightingController {
  private state: LightState | null = null;

  build = (scene: THREE.Scene): LightState => {
    const key = new THREE.DirectionalLight(0xfff0dd, 2.6);
    key.position.set(3.4, 4.5, 3.0);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 14;
    key.shadow.bias = -0.0002;

    const fill = new THREE.DirectionalLight(0x9fb6c8, 1.0);
    fill.position.set(-3.2, 2.4, -2.4);

    const rim = new THREE.DirectionalLight(0xc6e8e2, 2.2);
    rim.position.set(-2.2, 2.0, 4.0);

    const headlightPoint = new THREE.PointLight(0xfff0d8, 0, 5, 2);
    headlightPoint.position.set(1.2, 0.78, 0);

    const accentPoint = new THREE.PointLight(0x9fe8dd, 0, 3.5, 2);
    accentPoint.position.set(-0.2, 0.5, 0);

    const ambient = new THREE.HemisphereLight(0x78858c, 0x060708, 0.35);

    scene.add(key, fill, rim, headlightPoint, accentPoint, ambient);
    this.state = { key, fill, rim, headlightPoint, accentPoint, ambient };
    return this.state;
  };

  update = (progress: number, elapsed: number) => {
    if (!this.state) return;
    const act = getAct(progress);
    const s = this.state;

    // Baseline studio key with act-specific shaping.
    let keyIntensity = 2.7;
    let fillIntensity = 1.0;
    let rimIntensity = 2.1;
    let accent = 0;
    let ambient = 0.4;

    if (act.index === 0) {
      keyIntensity = 0.25;
      fillIntensity = 0.4;
      rimIntensity = 0.5;
      ambient = 0.22;
    } else if (act.index === 1) {
      keyIntensity = 2.6;
      fillIntensity = 1.15;
      rimIntensity = 2.2;
      ambient = 0.42;
    } else if (act.index === 2) {
      // Material close-up: strong rim + softer key to reveal micro-contrast.
      keyIntensity = 2.1;
      fillIntensity = 0.7;
      rimIntensity = 3.4;
      ambient = 0.36;
    } else if (act.index === 3 || act.index === 4) {
      // Technical inspection: even, flatter light.
      keyIntensity = 2.2;
      fillIntensity = 1.6;
      rimIntensity = 1.5;
      ambient = 0.52;
      accent = 0.6;
    } else if (act.index === 5) {
      // Core: darken everything, accent becomes the glow source.
      keyIntensity = 0.75;
      fillIntensity = 0.3;
      rimIntensity = 0.8;
      ambient = 0.2;
      accent = 1.4;
    } else if (act.index === 6) {
      // Performance: dynamic punch, accent drops back.
      keyIntensity = 2.9;
      fillIntensity = 1.1;
      rimIntensity = 2.8;
      ambient = 0.44;
      accent = 0.3;
    } else if (act.index === 7) {
      keyIntensity = 1.9;
      fillIntensity = 1.2;
      rimIntensity = 1.7;
      ambient = 0.4;
      accent = 0.2;
    } else {
      keyIntensity = 2.7;
      fillIntensity = 1.1;
      rimIntensity = 2.3;
      ambient = 0.42;
    }

    s.key.intensity = damp(s.key.intensity, keyIntensity, 3, 0.016);
    s.fill.intensity = damp(s.fill.intensity, fillIntensity, 3, 0.016);
    s.rim.intensity = damp(s.rim.intensity, rimIntensity, 3, 0.016);
    s.ambient.intensity = damp(s.ambient.intensity, ambient, 3, 0.016);
    s.accentPoint.intensity = damp(
      s.accentPoint.intensity,
      clamp(accent, 0, 1.6),
      3,
      0.016,
    );
    s.accentPoint.intensity *= 0.5 + Math.sin(elapsed * 1.2) * 0.5 * 0.08;

    // Cursor-reactive reflection direction (very subtle).
    const parallax = Math.sin(elapsed * 0.2) * 0.4;
    s.key.position.set(3.4 + parallax, 4.5, 3.0);
    s.fill.position.set(-3.2 + parallax, 2.4, -2.4);
  };
}
