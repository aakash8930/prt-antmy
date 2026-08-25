import { clamp } from "@/utils/math";

/**
 * AudioController — a layered, procedural Web Audio soundtrack.
 *
 * The composition is intentionally restrained: a near-silent ambience, a low
 * electrical hum that is always present once unlocked, and an accelerating
 * motor/road bed that tracks scroll velocity. Amplitude and spectral
 * intensity follow the master experience progress and scroll velocity.
 */
export class AudioController {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private ambience: GainNode | null = null;
  private humOsc: OscillatorNode | null = null;
  private humOsc2: OscillatorNode | null = null;
  private humGain: GainNode | null = null;
  private motorOsc: OscillatorNode | null = null;
  private motorGain: GainNode | null = null;
  private roadNoise: BiquadFilterNode | null = null;
  private roadGain: GainNode | null = null;
  private windNoise: BiquadFilterNode | null = null;
  private windGain: GainNode | null = null;
  private started = false;
  private enabled = false;
  private lastIntensity = 0;

  get isEnabled() {
    return this.enabled;
  }

  get isRunning() {
    return !!this.ctx && this.started;
  }

  /** Called from a user gesture. Safe to call repeatedly. */
  unlock = () => {
    if (!this.ctx) {
      const AC =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
    }
    if (this.ctx.state === "suspended") {
      void this.ctx.resume();
    }
    if (!this.started) {
      this.build();
      this.started = true;
    }
  };

  setEnabled = (enabled: boolean) => {
    this.enabled = enabled;
    if (enabled) {
      this.unlock();
      if (this.ctx && this.master) {
        this.ctx.resume();
        this.master.gain.setTargetAtTime(1, this.ctx.currentTime, 0.4);
      }
    } else if (this.ctx && this.master) {
      this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.25);
    }
  };

  private build = () => {
    if (!this.ctx) return;
    const ctx = this.ctx;

    this.master = ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(ctx.destination);

    this.buildAmbience(ctx);
    this.buildHum(ctx);
    this.buildMotor(ctx);
    this.buildRoad(ctx);
  };

  private buildAmbience(ctx: AudioContext) {
    const buffer = this.noiseBuffer(ctx, 4);
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 480;
    filter.Q.value = 0.6;
    const gain = ctx.createGain();
    gain.gain.value = 0.12;
    src.connect(filter).connect(gain).connect(this.master!);
    src.start();
    this.ambience = gain;
  }

  private buildHum(ctx: AudioContext) {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 52;
    const osc2 = ctx.createOscillator();
    osc2.type = "triangle";
    osc2.frequency.value = 104;
    osc2.detune.value = 7;
    const oscGain = ctx.createGain();
    oscGain.gain.value = 0.7;
    const gain = ctx.createGain();
    gain.gain.value = 0.12;
    osc.connect(oscGain).connect(gain).connect(this.master!);
    osc2.connect(oscGain);
    osc.start();
    osc2.start();
    this.humOsc = osc;
    this.humOsc2 = osc2;
    this.humGain = gain;
  }

  private buildMotor(ctx: AudioContext) {
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = 45;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 520;
    filter.Q.value = 3.4;
    const gain = ctx.createGain();
    gain.gain.value = 0;
    osc.connect(filter).connect(gain).connect(this.master!);
    osc.start();
    this.motorOsc = osc;
    this.motorGain = gain;
  }

  private buildRoad(ctx: AudioContext) {
    const buffer = this.noiseBuffer(ctx, 3);
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 340;
    filter.Q.value = 0.8;
    const gain = ctx.createGain();
    gain.gain.value = 0;
    src.connect(filter).connect(gain).connect(this.master!);
    src.start();
    this.roadNoise = filter;
    this.roadGain = gain;

    const wind = ctx.createBufferSource();
    wind.buffer = buffer;
    wind.loop = true;
    const windFilter = ctx.createBiquadFilter();
    windFilter.type = "lowpass";
    windFilter.frequency.value = 720;
    const windGain = ctx.createGain();
    windGain.gain.value = 0;
    wind.connect(windFilter).connect(windGain).connect(this.master!);
    wind.start();
    this.windNoise = windFilter;
    this.windGain = windGain;
  }

  private noiseBuffer(ctx: AudioContext, seconds: number): AudioBuffer {
    const length = Math.floor(ctx.sampleRate * seconds);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      last = last * 0.96 + white * 0.04;
      data[i] = last * 5;
    }
    return buffer;
  }

  /** Per-frame update. All values are smoothed inside the audio graph. */
  update = (progress: number, scrollVelocity: number, motorSpeed: number) => {
    if (!this.ctx || !this.started || !this.enabled) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const intensity = clamp(progress, 0, 1);
    const vel = clamp(scrollVelocity, 0, 4);

    this.ambience?.gain.setTargetAtTime(
      0.12 + intensity * 0.08,
      t,
      0.6,
    );
    this.humGain?.gain.setTargetAtTime(
      0.1 + intensity * 0.14,
      t,
      0.5,
    );
    if (this.humOsc) this.humOsc.frequency.setTargetAtTime(52 + motorSpeed * 4, t, 0.3);
    if (this.humOsc2) this.humOsc2.frequency.setTargetAtTime(104 + motorSpeed * 8, t, 0.3);

    const motorDrive = intensity > 0.72 ? clamp((intensity - 0.72) / 0.28, 0, 1) : 0;
    this.motorGain?.gain.setTargetAtTime(motorDrive * 0.22, t, 0.28);
    if (this.motorOsc) {
      this.motorOsc.frequency.setTargetAtTime(42 + motorDrive * 130 + vel * 9, t, 0.22);
    }

    const roadDrive = clamp(intensity * 0.5 + vel * 0.3, 0, 0.2);
    this.roadGain?.gain.setTargetAtTime(roadDrive, t, 0.4);
    this.roadNoise?.frequency.setTargetAtTime(280 + vel * 90 + motorDrive * 200, t, 0.25);
    this.windGain?.gain.setTargetAtTime(Math.min(0.16, vel * 0.05), t, 0.5);
    this.windNoise?.frequency.setTargetAtTime(520 + vel * 120, t, 0.3);

    const delta = Math.abs(intensity - this.lastIntensity);
    if (delta > 0.055) this.transition(delta);
    this.lastIntensity = intensity;
  };

  private transition(strength: number) {
    if (!this.ctx || !this.master) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(76, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(44, ctx.currentTime + 0.18);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(Math.min(0.16, strength * 0.2), ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.32);
    osc.connect(gain).connect(this.master);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  }

  dispose = () => {
    try {
      void this.ctx?.close();
    } catch {
      // no-op
    }
    this.ctx = null;
    this.started = false;
  };
}

export const audioController = new AudioController();
