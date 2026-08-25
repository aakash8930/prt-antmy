/**
 * Distortion — a full-screen transition shader. It bends the scene itself
 * (rather than the 3D surface) during hard cuts and section transitions:
 * a controlled fissure that opens, smears, and closes. The effect never reads
 * as "glitchy"; it reads as a lens/optical cut.
 */
export const distortionVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const distortionFragment = /* glsl */ `
  precision highp float;

  varying vec2 vUv;
  // ShaderPass feeds the incoming render-target into tDiffuse.
  uniform sampler2D tDiffuse;
  uniform sampler2D uPrevious;
  uniform float uTime;
  uniform float uStrength;
  uniform float uMix;
  uniform vec3 uTint;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
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
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p *= 2.17;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    // Center the fissure vertically; sample a moving seam.
    float seam = fbm(vec2(uv.x * 2.0, uTime * 0.25));
    float band = 1.0 - smoothstep(0.0, 1.0, abs(uv.x - 0.5) * 24.0);

    // Optical distortion: horizontal offset proportional to strength, with a
    // soft chromatic split.
    float offset = (seam - 0.5) * uStrength * band * 0.18;
    float chroma = (seam - 0.5) * uStrength * band * 0.012;

    vec2 uvR = uv + vec2(offset + chroma, 0.0);
    vec2 uvG = uv + vec2(offset, 0.0);
    vec2 uvB = uv + vec2(offset - chroma, 0.0);

    vec3 color;
    color.r = texture2D(tDiffuse, uvR).r;
    color.g = texture2D(tDiffuse, uvG).g;
    color.b = texture2D(tDiffuse, uvB).b;

    // Tinted haze along the seam.
    color += uTint * band * uMix * 0.25;

    // Blend with the previous scene for a hard-cut crossfade.
    vec3 prev = texture2D(uPrevious, uv).rgb;
    color = mix(color, prev, clamp(uMix * 0.9, 0.0, 0.95));

    gl_FragColor = vec4(color, 1.0);
  }
`;

export const distortionUniforms = () => ({
  tDiffuse: { value: null },
  uPrevious: { value: null },
  uTime: { value: 0 },
  uStrength: { value: 0 },
  uMix: { value: 0 },
  uTint: { value: [0.62, 0.77, 0.78] },
});
