# D-01 — Deep Ocean Expedition

A cinematic, scroll-driven landing page for a fictional deep-sea exploration submarine, built with Next.js, TypeScript, Tailwind CSS and Framer Motion.

## Run

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm start
```

## Interaction

Scroll position drives a 240-frame image sequence rendered on an HTML canvas (`components/SubmarineSequence.tsx`), taking the submarine from intact, through an exploded engineering view, to fully reassembled. Five text beats fade in and out in sync with scroll progress. A closing section (`components/ClosingSignal.tsx`) follows the sequence.

The frame sequence lives in `public/sequence/`. Source stills are in `frames/` (git-ignored) and can be reprocessed with `ffmpeg` (watermark removal via `delogo`, Lanczos upscale, WebP encode).

The cinematic artwork was generated specifically for this project and is not a third-party stock asset.
