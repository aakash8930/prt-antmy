# Aakash Singh — Full-stack developer

A premium, scroll-driven portfolio experience built around a 40-second motion study. Four ten-second videos become 1,200 1080p frames at 30 FPS and are scrubbed by Anime.js through a crisp canvas renderer.

## Run

```bash
npm install
npm run dev
```

Production checks:

```bash
npm run lint
npm run build
npm start
```

## Add the motion frames

The source videos are intentionally not committed. Copy the generated frames into `public/sequence/` using this naming format:

```text
frame_0000.webp
frame_0001.webp
...
frame_1199.webp
```

The frame renderer loads a small moving window around the current scroll position, so it does not decode all 1,200 images at once. The first 36 frames are loaded before the motion stage is revealed, and a nearest-frame fallback prevents blank draws while the user scrubs quickly.

## Structure

- `components/PortfolioExperience.tsx` — page composition and Anime.js entrance/reveal motion.
- `components/FrameSequence.tsx` — Anime.js scroll observer, frame cache, high-DPI canvas rendering, and phase copy.
- `public/sequence/` — local 30 FPS WebP sequence, supplied separately.
