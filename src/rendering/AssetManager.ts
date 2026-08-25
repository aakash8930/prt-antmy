import { getDeviceProfile, type QualityLevel } from "@/utils/device";

/**
 * AssetManager — resolves the asset manifest for the current device profile,
 * warms critical assets, and reports load state for the branded loader.
 * All 3D geometry here is procedural (engineered from primitives/GLTF when
 * present), so the manifest focuses on images, audio and loader progress.
 */

export interface ManifestAsset {
  id: string;
  type: "image" | "audio" | "sequence";
  src: string;
  critical: boolean;
  weight: number;
}

export interface LoadState {
  loaded: number;
  total: number;
  percent: number;
  ready: boolean;
  assets: ManifestAsset[];
}

const IMAGES = [
  "/metadata/volt-mark.svg",
  "/metadata/volt-logo-light.svg",
];

// Audio is fully procedural (Web Audio), so no silent placeholder files are
// preloaded. Keep paths here when real stems are added.
const AUDIO: string[] = [];

const makeManifest = (quality: QualityLevel): ManifestAsset[] => {
  // Sequence assets are optional: when real frames exist (public/sequences/road)
  // they are preloaded through the manifest; otherwise the SequenceRenderer
  // uses its procedural scroll-synced fallback so no 404 storm reaches the app.
  const scale = quality === "low" ? 1_024 : quality === "medium" ? 1_280 : 1_600;
  const frames = 0;
  const seq = Array.from({ length: frames }, (_, i) => ({
    id: `seq-${String(i).padStart(4, "0")}`,
    type: "sequence" as const,
    src: `/sequences/road/seq_${String(i).padStart(4, "0")}.webp`,
    critical: false,
    weight: 0.8,
  }));
  const images = IMAGES.map((src, i) => ({
    id: `img-${i}`,
    type: "image" as const,
    src,
    critical: i < 2,
    weight: 0.4,
  }));
  const audio = AUDIO.map((src, i) => ({
    id: `audio-${i}`,
    type: "audio" as const,
    src,
    critical: false,
    weight: 0.5,
  }));
  void scale;
  return [...images, ...audio, ...seq];
};

class AssetManager {
  private profile = getDeviceProfile();
  private manifest: ManifestAsset[] = [];
  private loadState: LoadState = {
    loaded: 0,
    total: 0,
    percent: 0,
    ready: false,
    assets: [],
  };
  private cache = new Map<string, HTMLImageElement | HTMLAudioElement>();
  private listeners = new Set<(s: LoadState) => void>();
  private started = false;

  subscribe = (fn: (s: LoadState) => void) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };

  getState = () => this.loadState;

  /** Begin a best-effort preload of critical + sequence assets. */
  start = () => {
    if (this.started) return;
    this.started = true;
    this.manifest = makeManifest(this.profile.quality);
    this.loadState = {
      ...this.loadState,
      total: this.manifest.length,
      assets: this.manifest,
    };

    const critical = this.manifest.filter((a) => a.critical);
    const rest = this.manifest.filter((a) => !a.critical);
    const queue = [...critical, ...rest];
    let loaded = 0;

    const finishOne = () => {
      loaded += 1;
      this.loadState = {
        ...this.loadState,
        loaded,
        percent: Math.round((loaded / Math.max(1, queue.length)) * 100),
        ready: loaded >= queue.length,
      };
      this.listeners.forEach((fn) => fn(this.loadState));
    };

    queue.forEach((asset) => {
      this.preload(asset)
        .catch(() => {
          // Missing assets should never block the experience.
        })
        .finally(finishOne);
    });
    // Guarantee we reach "ready" even if preloads hang.
    window.setTimeout(() => {
      if (!this.loadState.ready) {
        this.loadState = {
          ...this.loadState,
          loaded: this.loadState.total,
          percent: 100,
          ready: true,
        };
        this.listeners.forEach((fn) => fn(this.loadState));
      }
    }, 9000);
  };

  private preload(asset: ManifestAsset): Promise<unknown> {
    if (this.cache.has(asset.id)) return Promise.resolve();
    return new Promise((resolve, reject) => {
      if (asset.type === "audio") {
        const audio = new Audio();
        audio.preload = "auto";
        audio.src = asset.src;
        audio.addEventListener("canplaythrough", (e) => {
          this.cache.set(asset.id, audio);
          resolve(e);
        });
        audio.addEventListener("error", reject, { once: true });
        audio.load();
      } else if (asset.type === "image") {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          this.cache.set(asset.id, img);
          resolve(img);
        };
        img.onerror = reject;
        img.src = asset.src;
      } else {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          this.cache.set(asset.id, img);
          resolve(img);
        };
        img.onerror = reject;
        img.src = asset.src;
      }
    });
  }

  get = (id: string) => this.cache.get(id);

  dispose = () => {
    this.cache.clear();
  };
}

export const assetManager = new AssetManager();
