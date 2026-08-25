/**
 * Final composite shader — restrained filmic grade: soft vignette, fine
 * animated grain, and a subtractive tone curve. It never turns the product
 * into "a filter"; it just keeps the frame feeling photographic.
 */
export const postVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const postFragment = /* glsl */ `
  precision highp float;

  varying vec2 vUv;
  uniform sampler2D tDiffuse;
  uniform float uTime;
  uniform float uVignette;
  uniform float uNoise;
  uniform float uBloom;
  uniform float uExposure;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec4 tex = texture2D(tDiffuse, vUv);
    vec3 color = tex.rgb * uExposure;

    // Fine monochrome grain, visible but never distracting.
    float grain = (hash(vUv * vec2(961.0, 625.0) + uTime * 12.0) - 0.5) * uNoise;
    color += grain;

    // Soft vignette.
    vec2 c = vUv - 0.5;
    float vig = 1.0 - smoothstep(0.5, 1.15, dot(c, c) * 2.0) * uVignette;
    color *= vig;

    // Gentle shoulder so highlights don't clip.
    color = mix(color, color * color, 0.06);

    // Bloom luma hint (kept subtle by UnrealBloom threshold).
    float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
    color += vec3(luma * luma) * uBloom * 0.25;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export const postUniforms = () => ({
  tDiffuse: { value: null },
  uTime: { value: 0 },
  uVignette: { value: 0.32 },
  uNoise: { value: 0.035 },
  uBloom: { value: 0.5 },
  uExposure: { value: 1.0 },
});
