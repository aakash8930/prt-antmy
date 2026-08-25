/**
 * EnergyField — restrained electromagnetic visualization used around the motor
 * and inside the battery section. It looks like engineering telemetry rather
 * than neon electricity: thin field lines, a soft luminous core, and a faint
 * swirl that intensifies with `uDrive`.
 */
export const energyFieldVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const energyFieldFragment = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform float uTime;
  uniform float uProgress;
  uniform float uDrive;
  uniform vec3 uColor;
  uniform vec3 uCoreColor;
  uniform float uAlpha;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 4; i++) {
      v += amp * noise(p);
      p = p * 2.03 + 17.7;
      amp *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 p = vUv - 0.5;
    float r = length(p) * 2.0;
    float angle = atan(p.y, p.x);

    vec2 sp = vec2(angle, r * 4.0);
    float lines = sin(sp.x * 14.0 - uTime * (0.7 + uDrive * 2.0) + sp.y * 3.0 + fbm(sp * 2.0 + uTime * 0.2) * 4.0);
    float lineMask = smoothstep(0.55, 0.96, lines);

    // Faint radial falloff so field lines only live near the core.
    float radial = 1.0 - smoothstep(0.25, 1.15, r);
    // Outer swirl.
    float swirl = fbm(vec2(angle * 2.0 + uTime * 0.05, r * 3.0 - uTime * (0.2 + uDrive * 0.5)));
    swirl = smoothstep(0.42, 0.82, swirl);

    float core = smoothstep(0.45, 0.02, r);

    vec3 col = uColor * lineMask * radial * (0.35 + uDrive * 0.85);
    col += uCoreColor * core * (0.25 + uDrive * 0.4);
    col += uColor * swirl * radial * 0.12;

    float dist = length(p);
    float edge = 1.0 - smoothstep(0.18, 0.72, dist);
    col *= edge;

    float alpha = (0.16 + lineMask * 0.5 + core * 0.35) * uAlpha * radial;
    gl_FragColor = vec4(col, alpha * uProgress);
  }
`;

export const energyFieldUniforms = () => ({
  uTime: { value: 0 },
  uProgress: { value: 0 },
  uDrive: { value: 0 },
  uColor: { value: [0.42, 0.84, 0.8] },
  uCoreColor: { value: [0.86, 0.94, 0.92] },
  uAlpha: { value: 0.85 },
});
