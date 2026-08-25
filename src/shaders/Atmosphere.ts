/**
 * Atmosphere — a low-intensity volumetric depth layer placed in screen space
 * behind/around the motorcycle. It is not a foggy skybox; it is a slow, exact
 * depth-graded haze with drifting dust-like light motes.
 */
export const atmosphereVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const atmosphereFragment = /* glsl */ `
  precision highp float;

  varying vec2 vUv;
  uniform float uTime;
  uniform float uProgress;
  uniform vec3 uTint;
  uniform float uIntensity;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 c = uv - 0.5;
    float d = length(c);

    // Broad, soft depth falloff.
    float depth = 1.0 - smoothstep(0.2, 0.9, d);
    float haze = fbm(uv * 3.0 + vec2(uTime * 0.012, -uTime * 0.007));
    haze = smoothstep(0.42, 0.78, haze);

    // Fine motes.
    vec2 mp = uv * vec2(9.0, 5.0) + vec2(uTime * 0.03, uTime * 0.014);
    float mote = floor(fbm(mp) * 14.0);
    float sparkle = smoothstep(0.72, 1.0, noise(mp * 5.0 + uTime * 0.08) + mote * 0.02);

    vec3 col = uTint * depth * haze * 0.22;
    col += uTint * sparkle * depth * 0.18;

    float alpha = (depth * 0.12 + sparkle * 0.05) * uIntensity * uProgress;
    gl_FragColor = vec4(col, alpha);
  }
`;

export const atmosphereUniforms = () => ({
  uTime: { value: 0 },
  uProgress: { value: 0 },
  uTint: { value: [0.22, 0.24, 0.26] },
  uIntensity: { value: 0.6 },
});
