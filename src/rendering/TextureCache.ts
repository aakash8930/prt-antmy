import * as THREE from "three";

/**
 * TextureCache — small MRU cache for generated/procedural textures. It owns
 * disposal of GPU buffers so switching quality never leaks textures.
 */
export class TextureCache {
  private cache = new Map<string, THREE.Texture>();
  private maxEntries: number;

  constructor(maxEntries = 16) {
    this.maxEntries = maxEntries;
  }

  set = (key: string, texture: THREE.Texture) => {
    const existing = this.cache.get(key);
    if (existing && existing !== texture) {
      existing.dispose();
    }
    if (this.cache.size >= this.maxEntries) {
      const oldest = this.cache.keys().next().value as string | undefined;
      if (oldest) {
        this.cache.get(oldest)?.dispose();
        this.cache.delete(oldest);
      }
    }
    this.cache.set(key, texture);
  };

  get = (key: string) => this.cache.get(key);

  has = (key: string) => this.cache.has(key);

  dispose = () => {
    this.cache.forEach((t) => t.dispose());
    this.cache.clear();
  };
}

export const textureCache = new TextureCache(18);

/** Deterministic procedural texture helpers. */
export const makeDataTexture = (
  size: number,
  fill: (x: number, y: number) => [number, number, number, number],
): THREE.DataTexture => {
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = fill(x / size, y / size);
      const i = (y * size + x) * 4;
      data[i] = Math.round(r * 255);
      data[i + 1] = Math.round(g * 255);
      data[i + 2] = Math.round(b * 255);
      data[i + 3] = Math.round(a * 255);
    }
  }
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
};

export const makeSparkleTexture = (size = 128, density = 0.16): THREE.Texture =>
  makeDataTexture(size, (x, y) => {
    const n =
      Math.sin(x * 913.7 + y * 137.9) *
      Math.cos(x * 17.3 - y * 7.1) *
      0.5 +
      0.5;
    const mask = n > 1 - density ? 1 : 0;
    const o = Math.pow(Math.max(0, n - (1 - density)) / density, 2.4);
    return [0.82, 0.85, 0.82, mask * o];
  });

export const makeSoftRoundTexture = (size = 128): THREE.Texture =>
  makeDataTexture(size, (x, y) => {
    const dx = x - 0.5;
    const dy = y - 0.5;
    const d = Math.min(1, Math.sqrt(dx * dx + dy * dy) * 2);
    const a = Math.max(0, 1 - d);
    const soft = Math.pow(a, 2.4);
    return [0.85, 0.9, 0.85, soft];
  });
