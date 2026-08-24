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

Scroll position drives a five-beat narrative (`components/SubmarineSequence.tsx`) over a high-resolution static submarine poster. The story moves from first contact, through structure and engineering, to final departure. Framer Motion smooths the text transitions, while the closing section (`components/ClosingSignal.tsx`) follows the story.

The project intentionally does not bundle an image-frame sequence. This keeps the experience lightweight and avoids blurry or inconsistent frame playback. The poster and closing artwork are 2560-pixel-wide images and a static fallback is used for reduced-motion users.

The cinematic artwork was generated specifically for this project and is not a third-party stock asset.
