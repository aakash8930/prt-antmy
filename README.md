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

Quality checks:

```bash
npm run lint
npm audit
```

For correct absolute Open Graph URLs, set the public site URL before building:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.example npm run build
```

## Interaction

Scroll position drives a 240-frame image sequence rendered on an HTML canvas (`components/SubmarineSequence.tsx`), taking the submarine from intact, through an exploded engineering view, to fully reassembled. The sequence is 30-fps ready (240 frames represent an eight-second motion study) while scroll position controls playback rather than elapsed time. Five text beats fade in and out in sync with scroll progress. A closing section (`components/ClosingSignal.tsx`) follows the sequence.

The frame sequence lives in `public/sequence/`. The frames are 2560 × 1440 WebP images, upscaled and lightly sharpened from the original 1920 × 1080 sequence to keep the canvas crisp on high-density displays. The renderer uses a nearest available frame while assets are settling, retries neither missing assets nor hides the failure, and supports a static poster for reduced-motion users.

The cinematic artwork was generated specifically for this project and is not a third-party stock asset.
