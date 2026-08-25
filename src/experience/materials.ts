import * as THREE from "three";
import { makeDataTexture, makeSoftRoundTexture } from "@/rendering/TextureCache";

/**
 * Procedural, physically-based material library for the VOLT motorcycle.
 * All textures are generated once and reused; nothing requires network HDRs.
 */

const COLORS = {
  body: new THREE.Color(0x14171a),
  bodyLight: new THREE.Color(0x22262b),
  accent: new THREE.Color(0x8fd8cf),
  metal: new THREE.Color(0x8c9094),
  darkMetal: new THREE.Color(0x303337),
  carbon: new THREE.Color(0x161819),
  rubber: new THREE.Color(0x0b0c0c),
  machined: new THREE.Color(0xb9bcc0),
  glass: new THREE.Color(0x0c1013),
  emissiveCool: new THREE.Color(0x9fe8dd),
  emissiveWarm: new THREE.Color(0xfff0d8),
  emissiveRed: new THREE.Color(0xff3f33),
};

const makeCarbonTexture = (): THREE.Texture => {
  const size = 256;
  const tex = makeDataTexture(size, (x, y) => {
    const cell = 8 / size;
    const cx = Math.floor(x / cell);
    const cy = Math.floor(y / cell);
    const even = (cx + cy) % 2 === 0;
    const wave = Math.sin(cx * 1.7 + cy * 0.9) * 0.5 + 0.5;
    const base = even ? 0.1 : 0.15;
    const sheen = wave * 0.05;
    const v = base + sheen;
    return [v * 0.85, v, v * 0.95, 1];
  });
  tex.repeat.set(4, 4);
  tex.colorSpace = THREE.NoColorSpace;
  return tex;
};

const makeBrushedTexture = (): THREE.Texture => {
  const size = 256;
  return makeDataTexture(size, (x, y) => {
    const lines = (Math.sin(y * 280 + x * 7) * 0.5 + 0.5) * 0.12;
    const noise = (Math.sin(x * 913.7 + y * 137.9) * 0.5 + 0.5) * 0.07;
    const v = 0.42 + lines + noise;
    return [v, v, v + 0.03, 1];
  });
};

let carbonTex: THREE.Texture | null = null;
let brushedTex: THREE.Texture | null = null;

const getCarbon = () => {
  if (!carbonTex) carbonTex = makeCarbonTexture();
  return carbonTex;
};

const getBrushed = () => {
  if (!brushedTex) brushedTex = makeBrushedTexture();
  return brushedTex;
};

export const bodyMaterial = () =>
  new THREE.MeshPhysicalMaterial({
    color: COLORS.body,
    metalness: 0.72,
    roughness: 0.32,
    clearcoat: 0.78,
    clearcoatRoughness: 0.16,
    sheen: 0.2,
    sheenColor: new THREE.Color(0x3a4a4a),
    envMapIntensity: 1.05,
  });

export const bodyLightMaterial = () =>
  new THREE.MeshPhysicalMaterial({
    color: COLORS.bodyLight,
    metalness: 0.6,
    roughness: 0.34,
    clearcoat: 0.5,
    clearcoatRoughness: 0.24,
    envMapIntensity: 0.9,
  });

export const carbonMaterial = () =>
  new THREE.MeshPhysicalMaterial({
    color: COLORS.carbon,
    map: getCarbon(),
    metalness: 0.35,
    roughness: 0.42,
    clearcoat: 0.55,
    clearcoatRoughness: 0.2,
    envMapIntensity: 0.75,
  });

export const metalMaterial = () =>
  new THREE.MeshPhysicalMaterial({
    color: COLORS.metal,
    metalness: 0.92,
    roughness: 0.42,
    map: getBrushed(),
    envMapIntensity: 1.1,
  });

export const darkMetalMaterial = () =>
  new THREE.MeshPhysicalMaterial({
    color: COLORS.darkMetal,
    metalness: 0.84,
    roughness: 0.36,
    envMapIntensity: 0.9,
  });

export const machinedMaterial = () =>
  new THREE.MeshPhysicalMaterial({
    color: COLORS.machined,
    metalness: 1.0,
    roughness: 0.26,
    map: getBrushed(),
    envMapIntensity: 1.2,
  });

export const rubberMaterial = () =>
  new THREE.MeshPhysicalMaterial({
    color: COLORS.rubber,
    metalness: 0.0,
    roughness: 0.92,
    clearcoat: 0.08,
    clearcoatRoughness: 0.55,
    envMapIntensity: 0.35,
  });

export const glassMaterial = () =>
  new THREE.MeshPhysicalMaterial({
    color: COLORS.glass,
    metalness: 0.0,
    roughness: 0.08,
    transmission: 0.4,
    thickness: 0.2,
    transparent: true,
    opacity: 0.6,
    envMapIntensity: 1.4,
  });

export const emissiveCoolMaterial = (intensity = 1.6) =>
  new THREE.MeshStandardMaterial({
    color: 0x0c1212,
    emissive: COLORS.emissiveCool,
    emissiveIntensity: intensity,
    metalness: 0.2,
    roughness: 0.4,
  });

export const headlightMaterial = (intensity = 0) =>
  new THREE.MeshStandardMaterial({
    color: 0x050505,
    emissive: COLORS.emissiveWarm,
    emissiveIntensity: intensity,
    metalness: 0.3,
    roughness: 0.25,
  });

export const taillightMaterial = (intensity = 0) =>
  new THREE.MeshStandardMaterial({
    color: 0x080505,
    emissive: COLORS.emissiveRed,
    emissiveIntensity: intensity,
    metalness: 0.1,
    roughness: 0.35,
  });

export const accentStripeMaterial = () =>
  new THREE.MeshPhysicalMaterial({
    color: COLORS.accent,
    metalness: 0.55,
    roughness: 0.3,
    clearcoat: 0.65,
    clearcoatRoughness: 0.14,
    envMapIntensity: 1.0,
  });

export const floorMaterial = () =>
  new THREE.MeshStandardMaterial({
    color: 0x08090a,
    metalness: 0.55,
    roughness: 0.38,
    envMapIntensity: 0.55,
  });

export { makeSoftRoundTexture };
