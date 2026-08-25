export const clamp = (v: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, v));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

/**
 * A normalized window function: 0 before `in`, ramps to 1 between `in`/`full`,
 * stays at 1 until `out` starts, then ramps back to 0 by `out`.
 */
export const windowFn = (
  x: number,
  from: number,
  to: number,
  fullFrom?: number,
  fullTo?: number,
) => {
  const f = fullFrom ?? to;
  const tEnd = fullTo ?? from;
  const rise = smoothstep(from, to, x);
  const fall = smoothstep(f, tEnd, x);
  // fall should be 0 while inside the plateau; 1 as we leave it.
  const leave = smoothstep(f, tEnd, x);
  return roseFall(rise, leave);
};

function roseFall(rise: number, leave: number) {
  // 1 - (1-rise) is zero at start; subtracting leave cuts the tail.
  const up = rise;
  const down = 1 - leave;
  return clamp(up * down);
}

export const multiWindow = (
  x: number,
  segments: Array<[number, number] | [number, number, number, number]>,
) => {
  let v = 0;
  for (const s of segments) {
    const w =
      s.length === 2
        ? windowFn(x, s[0], s[1])
        : windowFn(x, s[0], s[1], s[2], s[3]);
    v = Math.max(v, w);
  }
  return v;
};

export const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export const easeIn = (t: number) => t * t * t;

export const damp = (a: number, b: number, lambda: number, dt: number) =>
  lerp(a, b, 1 - Math.exp(-lambda * dt));

export const round = (v: number, precision = 0) => {
  const f = 10 ** precision;
  return Math.round(v * f) / f;
};

export const pad = (v: number | string, length = 3, char = "0") =>
  String(v).padStart(length, char);
