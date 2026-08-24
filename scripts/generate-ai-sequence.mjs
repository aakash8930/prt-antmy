import { mkdir, rm, writeFile } from "node:fs/promises";

const FRAME_COUNT = 240;
const WIDTH = 2560;
const HEIGHT = 1440;
const CENTER_X = WIDTH / 2;
const CENTER_Y = HEIGHT / 2;
const outputDir = new URL("../public/sequence/", import.meta.url);

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const easeInOut = (value) => value * value * (3 - 2 * value);
const polar = (radius, angle) => [CENTER_X + Math.cos(angle) * radius, CENTER_Y + Math.sin(angle) * radius * 0.55];

const particles = Array.from({ length: 34 }, (_, index) => ({
  radius: 260 + ((index * 97) % 560),
  angle: (index / 34) * Math.PI * 2,
  size: 2 + (index % 3),
  color: index % 5 === 0 ? "#d9ff5f" : "#8ce8ff",
}));

function frameSvg(index) {
  const progress = index / (FRAME_COUNT - 1);
  const eased = easeInOut(progress);
  const pulse = Math.sin(progress * Math.PI);
  const zoom = 0.88 + pulse * 0.12;
  const imageOpacity = 0.84 + pulse * 0.16;
  const orbitRotation = -8 + eased * 34;
  const ringOpacity = 0.22 + pulse * 0.4;
  const glowOpacity = 0.12 + pulse * 0.22;

  const dots = particles
    .map((particle, particleIndex) => {
      const angle = particle.angle + progress * (0.5 + (particleIndex % 4) * 0.13);
      const [x, y] = polar(particle.radius + Math.sin(progress * 8 + particleIndex) * 16, angle);
      const opacity = clamp(0.2 + pulse * 0.75 + Math.sin(progress * 12 + particleIndex) * 0.15);
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${particle.size}" fill="${particle.color}" opacity="${opacity.toFixed(2)}"/>`;
    })
    .join("");

  const signalLines = Array.from({ length: 8 }, (_, lineIndex) => {
    const angle = (lineIndex / 8) * Math.PI * 2 + progress * 0.7;
    const [x1, y1] = polar(250, angle);
    const [x2, y2] = polar(720, angle);
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${lineIndex % 3 === 0 ? "#d9ff5f" : "#8ce8ff"}" stroke-width="2" opacity="${(0.08 + pulse * 0.16).toFixed(2)}"/>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#d9ff5f" stop-opacity="${glowOpacity.toFixed(2)}"/>
      <stop offset="42%" stop-color="#51dfff" stop-opacity="${(glowOpacity * 0.45).toFixed(2)}"/>
      <stop offset="100%" stop-color="#051018" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="scan" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#8ce8ff" stop-opacity="0"/>
      <stop offset="48%" stop-color="#8ce8ff" stop-opacity="${(0.12 + pulse * 0.18).toFixed(2)}"/>
      <stop offset="100%" stop-color="#d9ff5f" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#071016"/>
  <image x="0" y="0" width="${WIDTH}" height="${HEIGHT}" preserveAspectRatio="xMidYMid slice" opacity="${imageOpacity.toFixed(2)}" xlink:href="/ai-core-style-frame.jpg"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#050b11" opacity="0.18"/>
  <g transform="translate(${CENTER_X} ${CENTER_Y}) scale(${zoom.toFixed(4)}) translate(${-CENTER_X} ${-CENTER_Y})">
    <circle cx="${CENTER_X}" cy="${CENTER_Y}" r="580" fill="url(#coreGlow)"/>
    <g transform="rotate(${orbitRotation.toFixed(2)} ${CENTER_X} ${CENTER_Y})" fill="none">
      <ellipse cx="${CENTER_X}" cy="${CENTER_Y}" rx="310" ry="170" stroke="#8ce8ff" stroke-width="3" opacity="${ringOpacity.toFixed(2)}"/>
      <ellipse cx="${CENTER_X}" cy="${CENTER_Y}" rx="430" ry="235" stroke="#8ce8ff" stroke-width="2" stroke-dasharray="18 16" opacity="${(ringOpacity * 0.72).toFixed(2)}"/>
      <ellipse cx="${CENTER_X}" cy="${CENTER_Y}" rx="590" ry="325" stroke="#d9ff5f" stroke-width="2" stroke-dasharray="5 28" opacity="${(ringOpacity * 0.52).toFixed(2)}"/>
      <ellipse cx="${CENTER_X}" cy="${CENTER_Y}" rx="720" ry="400" stroke="url(#scan)" stroke-width="4" opacity="${(ringOpacity * 0.66).toFixed(2)}"/>
    </g>
    <g>${signalLines}${dots}</g>
  </g>
  <path d="M 120 ${HEIGHT - 160} H 720 M ${WIDTH - 720} ${HEIGHT - 160} H ${WIDTH - 120}" stroke="#8ce8ff" stroke-width="2" opacity="${(0.16 + pulse * 0.25).toFixed(2)}"/>
  <path d="M 120 160 H 520 M ${WIDTH - 520} 160 H ${WIDTH - 120}" stroke="#d9ff5f" stroke-width="2" opacity="${(0.12 + pulse * 0.2).toFixed(2)}"/>
</svg>
`;
}

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });
await Promise.all(
  Array.from({ length: FRAME_COUNT }, (_, index) =>
    writeFile(new URL(`frame_${String(index).padStart(3, "0")}.svg`, outputDir), frameSvg(index)),
  ),
);
console.log(`Generated ${FRAME_COUNT} SVG frames at 30 FPS (${FRAME_COUNT / 30}s) in public/sequence/`);
