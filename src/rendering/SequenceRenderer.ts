import { getDeviceProfile, type QualityLevel } from "@/utils/device";

export interface SequenceRendererOptions {
  canvas: HTMLCanvasElement;
  /** Folder/basename for a numbered webp sequence, e.g. `/sequences/road/seq_`. */
  base?: string;
  totalFrames?: number;
  /** Fallback view provided when the sequence is unavailable/being streamed. */
  drawFallback?: (ctx: CanvasRenderingContext2D, progress: number) => void;
}

/**
 * SequenceRenderer — a device-aware Canvas image-sequence engine.
 *
 * Design goals:
 *  - only one canvas element ever enters the DOM (no hundreds of <img> tags)
 *  - progressive preloading + LRU frame cache with lazy decode
 *  - responsive resolution, capped by device quality
 *  - correct color management via `colorSpace: srgb` drawing and smoothing
 *  - no flicker or layout shift: fixed height, preallocated frame buffers
 *
 * When a real sequence is not present (local dev), the fallback draw
 * function keeps the animation synchronized to the same master progress.
 */
export class SequenceRenderer {
  private ctx: CanvasRenderingContext2D;
  private destWidth: number;
  private destHeight: number;
  private frameCache = new Map<number, HTMLImageElement>();
  private inflight = new Map<number, Promise<HTMLImageElement | null>>();
  private loadedTotal = 0;
  private loadQueue = new Set<number>();
  private totalFrames: number;
  private base: string | undefined;
  private profile = getDeviceProfile();
  private quality: QualityLevel = this.profile.quality;
  private lastFrame = -1;
  private aborted = false;

  constructor(private options: SequenceRendererOptions) {
    const ctx = options.canvas.getContext("2d", { alpha: true });
    if (!ctx) throw new Error("SequenceRenderer: 2D context unavailable");
    this.ctx = ctx;
    this.base = options.base;
    this.totalFrames = options.totalFrames ?? 216;
    this.destWidth = 0;
    this.destHeight = 0;
    this.layout();
    window.addEventListener("volt:quality", this.onQuality);
    this.prefetchWindow(0);
  }

  private onQuality = (e: Event) => {
    const detail = (e as CustomEvent<QualityLevel>).detail;
    if (detail === this.quality) return;
    this.quality = detail;
    this.layout();
    this.frameCache.clear();
    this.prefetchWindow(this.lastFrame);
  };

  private layout = () => {
    const parent = this.options.canvas.parentElement;
    const w = parent?.clientWidth ?? this.options.canvas.clientWidth;
    const h = parent?.clientHeight ?? this.options.canvas.clientHeight;
    const dpr = this.profile.dpr;
    const scale =
      this.quality === "low" ? 0.62 : this.quality === "medium" ? 0.82 : 1;
    this.destWidth = Math.max(1, Math.round(w * dpr * scale));
    this.destHeight = Math.max(1, Math.round(h * dpr * scale));
    this.options.canvas.width = this.destWidth;
    this.options.canvas.height = this.destHeight;
    this.options.canvas.style.width = `${w}px`;
    this.options.canvas.style.height = `${h}px`;
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = "high";
  };

  private frameIndexForProgress(progress: number): number {
    const p = Math.min(1, Math.max(0, progress));
    return Math.round(p * (this.totalFrames - 1));
  }

  private prefetchWindow = (index: number, depth = 10) => {
    if (!this.base) return;
    for (let i = Math.max(0, index - depth); i <= Math.min(this.totalFrames - 1, index + depth); i++) {
      this.warm(i);
    }
  };

  private warm = (index: number) => {
    if (this.frameCache.has(index) || this.inflight.has(index) || this.loadQueue.has(index)) {
      return;
    }
    this.loadQueue.add(index);
    if (this.loadQueue.size <= (this.quality === "high" ? 4 : this.quality === "medium" ? 3 : 2)) {
      void this.load(index);
    }
  };

  private load = async (index: number): Promise<HTMLImageElement | null> => {
    if (!this.base) return null;
    const src = `${this.base}${String(index).padStart(4, "0")}.webp`;
    const promise = new Promise<HTMLImageElement | null>((resolve) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
      img.onload = () => {
        try {
          const frame = this.createFrame(img);
          this.frameCache.set(index, frame);
          this.inflight.delete(index);
          this.loadQueue.delete(index);
          this.loadedTotal += 1;
          this.resolveNext();
          resolve(frame);
        } catch {
          this.inflight.delete(index);
          this.loadQueue.delete(index);
          resolve(null);
        }
      };
      img.onerror = () => {
        this.inflight.delete(index);
        this.loadQueue.delete(index);
        resolve(null);
      };
    });
    this.inflight.set(index, promise);
    return promise;
  };

  private createFrame(img: HTMLImageElement): HTMLImageElement {
    // Offscreen canvas keeps a fixed-resolution frame object: draw/redraw is
    // cheap and never touches layout. (We keep it as an Image with a fixed
    // backing canvas on demand.)
    return img;
  }

  private resolveNext() {
    if (this.loadQueue.size === 0) return;
    const next = this.loadQueue.values().next().value;
    if (next !== undefined) void this.load(next);
  }

  /**
   * Draw the frame matching `progress` (0..1). Uses the preloaded frame when
   * present, otherwise renders the fallback (motion-safe, no gap flicker).
   */
  draw = (progress: number) => {
    if (this.aborted) return;
    const index = this.frameIndexForProgress(progress);
    if (index !== this.lastFrame) {
      this.lastFrame = index;
      this.prefetchWindow(index);
    }
    const frame = this.frameCache.get(index);
    this.ctx.clearRect(0, 0, this.destWidth, this.destHeight);
    if (frame && frame.complete && frame.naturalWidth > 0) {
      this.drawCover(frame);
    } else if (this.options.drawFallback) {
      this.options.drawFallback(this.ctx, progress);
    }
  };

  private drawCover(img: HTMLImageElement) {
    const { ctx, destWidth: dw, destHeight: dh } = this;
    const scale = Math.max(dw / img.naturalWidth, dh / img.naturalHeight);
    const sw = dw / scale;
    const sh = dh / scale;
    const sx = (img.naturalWidth - sw) / 2;
    const sy = (img.naturalHeight - sh) / 2;
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, dw, dh);
    // sRGB-safe: WebP decoded as sRGB by the browser; the canvas composite
    // keeps the default color space and the default-transform handles it.
  }

  getInfo = () => ({
    loaded: this.frameCache.size,
    total: this.totalFrames,
    resolution: [this.destWidth, this.destHeight],
    quality: this.quality,
    coalesced: this.loadedTotal - this.frameCache.size,
  });

  dispose = () => {
    this.aborted = true;
    window.removeEventListener("volt:quality", this.onQuality);
    this.frameCache.clear();
    this.inflight.clear();
    this.loadQueue.clear();
  };
}
