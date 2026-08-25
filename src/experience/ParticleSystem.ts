import * as THREE from "three";
import { qualityManager } from "@/rendering/QualityManager";
import { makeSoftRoundTexture } from "@/rendering/TextureCache";
import { getAct, windowRange } from "@/animation/MasterTimeline";

const VERTEX = /* glsl */ `
  attribute float aSeed;
  attribute float aSize;
  uniform float uTime;
  uniform float uDrift;
  uniform float uEnergy;
  uniform float uRoad;
  varying float vAlpha;
  varying float vSeed;

  void main() {
    vec3 p = position;
    float seed = aSeed;

    // Ambient atmospheric drift.
    p.y += sin(uTime * 0.25 + seed * 19.0) * uDrift * 0.16;
    p.x += cos(uTime * 0.18 + seed * 23.0) * uDrift * 0.12;
    p.z += sin(uTime * 0.12 + seed * 17.0) * uDrift * 0.1;

    // Energy particles swirl around the motor axis.
    if (uEnergy > 0.001) {
      float a = uTime * (0.6 + seed * 0.6) + seed * 6.283;
      float rad = 0.2 + seed * 0.35;
      p.x = -0.16 + cos(a) * rad * 0.4;
      p.y = 0.52 + sin(a) * rad * 0.35;
      p.z = cos(a * 0.7 + seed) * rad * 0.8;
    }

    // Road streaking during the performance act.
    if (uRoad > 0.001) {
      p.z += (seed - 0.5) * uRoad * 2.2;
      p.y += (seed - 0.5) * uRoad * 0.9;
    }

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aSize * (300.0 / max(0.4, -mv.z)) * (0.6 + uEnergy * 0.5);
    gl_Position = projectionMatrix * mv;

    float dist = clamp((seed - 0.5) * 2.0, -1.0, 1.0);
    vAlpha = (0.25 + 0.6 * (1.0 - abs(dist))) * (0.5 + uEnergy * 0.6);
    vSeed = seed;
  }
`;

const FRAGMENT = /* glsl */ `
  precision highp float;
  uniform sampler2D uMap;
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform vec3 uEnergyColor;
  uniform float uEnergy;
  varying float vAlpha;
  varying float vSeed;

  void main() {
    vec4 tex = texture2D(uMap, gl_PointCoord);
    vec3 col = mix(uColor, uEnergyColor, uEnergy * 0.6);
    float outA = tex.a * vAlpha * uOpacity;
    // Slight cool tint for energy spheres.
    if (gl_PointCoord.y > 0.5 && uEnergy > 0.2) col = mix(col, uEnergyColor, 0.25);
    gl_FragColor = vec4(col, outA);
  }
`;

/**
 * ParticleSystem — a GPU-friendly single Points cloud that fills all particle
 * roles (atmosphere dust, energy flow, road streak) through branch-free
 * uniforms. Density is capped by the active device quality level.
 */
export class ParticleSystem {
  private points: THREE.Points;
  private material: THREE.ShaderMaterial;
  private geometry: THREE.BufferGeometry;
  private count: number;
  private softTex: THREE.Texture;

  constructor(scene: THREE.Scene) {
    const quality = qualityManager.get();
    this.count = quality.maxParticles;
    this.softTex = makeSoftRoundTexture(96);

    const positions = new Float32Array(this.count * 3);
    const seeds = new Float32Array(this.count);
    const sizes = new Float32Array(this.count);
    for (let i = 0; i < this.count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 5.2;
      positions[i * 3 + 1] = 0.15 + Math.random() * 1.9;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3.4;
      seeds[i] = Math.random();
      sizes[i] = 0.4 + Math.random() * 1.4;
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    this.geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

    this.material = new THREE.ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uMap: { value: this.softTex },
        uTime: { value: 0 },
        uDrift: { value: 0.3 },
        uEnergy: { value: 0 },
        uRoad: { value: 0 },
        uColor: { value: new THREE.Color(0x8a969b) },
        uEnergyColor: { value: new THREE.Color(0x9fe8dd) },
        uOpacity: { value: 0.7 },
      },
    });

    this.points = new THREE.Points(this.geometry, this.material);
    this.points.frustumCulled = false;
    scene.add(this.points);
  }

  update = (progress: number, time: number, velocity: number) => {
    const u = this.material.uniforms;
    u.uTime.value = time;

    const act = getAct(progress);
    const materialClose = act.index === 2;
    const dustWindow = windowRange(progress, 0.03, 0.18, 0.8, 1.0);
    const energy = windowRange(progress, 0.62, 0.7, 0.72, 0.8);
    const road = windowRange(progress, 0.79, 0.84, 0.86, 0.9);

    u.uDrift.value = materialClose ? 0.55 : dustWindow * 0.55;
    u.uEnergy.value = energy;
    u.uRoad.value = road * Math.min(1.4, velocity * 0.5 + progress);
    // Density responds to device quality.
    u.uOpacity.value =
      0.65 * (0.6 + Math.min(1, velocity * 0.3)) * (1 + energy * 0.3);
  };

  setWireframe = (on: boolean) => {
    this.material.wireframe = on;
  };

  dispose = () => {
    this.geometry.dispose();
    this.material.dispose();
    this.softTex.dispose();
  };
}
