import { getDeviceProfile, type QualityLevel } from "@/utils/device";

export interface QualitySettings {
  level: QualityLevel;
  dpr: number;
  maxParticles: number;
  sequenceScale: number;
  post: PostSettings;
  shaderDetail: "high" | "low";
  softShadows: boolean;
  antialias: boolean;
  anisotropy: number;
  memoryBudget: number;
}

export interface PostSettings {
  enabled: boolean;
  bloom: number;
  vignette: number;
  noise: number;
}

const SETTINGS: Record<QualityLevel, Omit<QualitySettings, "level" | "dpr">> = {
  high: {
    maxParticles: 2600,
    sequenceScale: 1,
    post: { enabled: true, bloom: 0.6, vignette: 0.32, noise: 0.035 },
    shaderDetail: "high",
    softShadows: true,
    antialias: true,
    anisotropy: 8,
    memoryBudget: 280,
  },
  medium: {
    maxParticles: 1400,
    sequenceScale: 0.82,
    post: { enabled: true, bloom: 0.42, vignette: 0.28, noise: 0.03 },
    shaderDetail: "low",
    softShadows: false,
    antialias: false,
    anisotropy: 4,
    memoryBudget: 180,
  },
  low: {
    maxParticles: 500,
    sequenceScale: 0.62,
    post: { enabled: false, bloom: 0, vignette: 0.18, noise: 0.02 },
    shaderDetail: "low",
    softShadows: false,
    antialias: false,
    anisotropy: 2,
    memoryBudget: 100,
  },
};

class QualityManager {
  private profile = getDeviceProfile();
  private current = this.build();

  private build(): QualitySettings {
    const base = SETTINGS[this.profile.quality];
    return { ...base, level: this.profile.quality, dpr: this.profile.dpr };
  }

  get = () => this.current;

  set = (level: QualityLevel) => {
    this.current = { ...SETTINGS[level], level, dpr: this.profile.dpr };
    window.dispatchEvent(new CustomEvent("volt:quality", { detail: level }));
  };

  cycle = () => {
    const order: QualityLevel[] = ["high", "medium", "low"];
    const idx = order.indexOf(this.current.level);
    this.set(order[(idx + 1) % order.length]);
  };

  reset = () => {
    this.current = this.build();
    window.dispatchEvent(
      new CustomEvent("volt:quality", { detail: this.current.level }),
    );
  };
}

export const qualityManager = new QualityManager();
