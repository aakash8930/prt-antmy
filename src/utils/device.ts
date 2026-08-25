export type QualityLevel = "high" | "medium" | "low";

export interface DeviceProfile {
  quality: QualityLevel;
  isMobile: boolean;
  isTouch: boolean;
  dpr: number;
  maxParticles: number;
  pixelRatio: number;
  webgl: boolean;
  reducedMotion: boolean;
  cores: number;
}

const detect = (): DeviceProfile => {
  if (typeof window === "undefined") {
    return {
      quality: "high",
      isMobile: false,
      isTouch: false,
      dpr: 1,
      maxParticles: 2400,
      pixelRatio: 1,
      webgl: true,
      reducedMotion: false,
      cores: 8,
    };
  }

  const nav = navigator as Navigator & { deviceMemory?: number };
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const isMobile =
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
    (isTouch && window.innerWidth < 1024);
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const cores = nav.hardwareConcurrency ?? 4;

  let quality: QualityLevel = "high";
  if (isMobile || reducedMotion) quality = "low";
  else if (cores <= 4) quality = "medium";

  const pixelRatio = Math.min(window.devicePixelRatio || 1, isMobile ? 1.8 : 2);
  const dpr = reducedMotion
    ? 1
    : isMobile
      ? Math.min(pixelRatio, 1.5)
      : pixelRatio;

  const maxParticles =
    quality === "high" ? 2600 : quality === "medium" ? 1400 : 500;

  let webgl = false;
  try {
    const canvas = document.createElement("canvas");
    webgl = !!(
      canvas.getContext("webgl2") || canvas.getContext("webgl")
    );
  } catch {
    webgl = false;
  }

  return {
    quality,
    isMobile,
    isTouch,
    dpr,
    maxParticles,
    pixelRatio,
    webgl,
    reducedMotion,
    cores,
  };
};

let cached: DeviceProfile | null = null;

export const getDeviceProfile = (): DeviceProfile => {
  if (!cached) cached = detect();
  return cached;
};
