import * as THREE from "three";
import { qualityManager } from "@/rendering/QualityManager";
import {
  atmosphereFragment,
  atmosphereUniforms,
  atmosphereVertex,
} from "@/shaders/Atmosphere";
import {
  energyFieldFragment,
  energyFieldUniforms,
  energyFieldVertex,
} from "@/shaders/EnergyField";
import { getAct, windowRange } from "@/animation/MasterTimeline";

/**
 * ShaderController — owns the three custom GLSL systems: the motor energy
 * field, the atmospheric depth shell, and the surface distortion parameters.
 * Quality controls which effects are active and how intense they are.
 */
export class ShaderController {
  private energyField: THREE.Mesh;
  private energyMaterial: THREE.ShaderMaterial;
  private atmosphere: THREE.Mesh;
  private atmosphereMaterial: THREE.ShaderMaterial;
  private distortionStrength = 0;

  constructor(scene: THREE.Scene) {
    // Energy field sits at the motor and always faces the camera.
    this.energyMaterial = new THREE.ShaderMaterial({
      vertexShader: energyFieldVertex,
      fragmentShader: energyFieldFragment,
      uniforms: energyFieldUniforms(),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const plane = new THREE.PlaneGeometry(2.1, 2.1);
    this.energyField = new THREE.Mesh(plane, this.energyMaterial);
    this.energyField.visible = false;
    scene.add(this.energyField);

    // Atmospheric depth shell.
    this.atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: atmosphereVertex,
      fragmentShader: atmosphereFragment,
      uniforms: atmosphereUniforms(),
      transparent: true,
      depthWrite: false,
      side: THREE.BackSide,
      blending: THREE.NormalBlending,
    });
    this.atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(26, 32, 24),
      this.atmosphereMaterial,
    );
    scene.add(this.atmosphere);
  }

  update = (
    progress: number,
    time: number,
    camera: THREE.PerspectiveCamera,
    velocity: number,
  ) => {
    const q = qualityManager.get();
    const act = getAct(progress);

    // --- Energy field around the motor (power/core acts). ---
    const energy = windowRange(progress, 0.6, 0.7, 0.78, 0.84);
    const drive = windowRange(progress, 0.66, 0.72, 0.74, 0.79) * (1 + Math.min(1.2, velocity * 0.2));
    this.energyField.visible = energy > 0.001 && q.shaderDetail === "high";
    if (this.energyField.visible) {
      this.energyField.position.set(-0.16, 0.52, 0);
      this.energyField.lookAt(camera.position);
      const u = this.energyMaterial.uniforms;
      u.uTime.value = time;
      u.uProgress.value = energy;
      u.uDrive.value = drive;
    }

    // --- Atmospheric depth. ---
    const depthIntensity =
      (act.index >= 1 ? 0.6 : 0.3) * 0.8 + velocity * 0.04;
    const au = this.atmosphereMaterial.uniforms;
    au.uTime.value = time;
    au.uProgress.value = Math.min(1, depthIntensity);
    au.uIntensity.value = q.post.enabled ? 0.75 : 0.5;

    // --- Distortion strength: pulses at act boundaries. ---
    const boundaries = [0.07, 0.22, 0.34, 0.52, 0.66, 0.77, 0.89, 0.96];
    let s = 0;
    for (const b of boundaries) {
      const d = Math.abs(progress - b);
      if (d < 0.012) s = Math.max(s, 1 - d / 0.012);
    }
    this.distortionStrength = s * (q.post.enabled ? 1 : 0.7);
  };

  setWireframe = (on: boolean) => {
    this.energyMaterial.wireframe = on;
  };

  getDistortion = () => this.distortionStrength;

  dispose = () => {
    this.energyField.geometry.dispose();
    this.energyMaterial.dispose();
    this.atmosphere.geometry.dispose();
    this.atmosphereMaterial.dispose();
  };
}
