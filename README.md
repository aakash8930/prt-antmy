# Aakash Singh — Full-stack developer

A premium, scroll-driven portfolio experience built around a 40-second motion study. The four supplied ten-second clips are sampled into a 1,200-frame, 1920 × 1080 WebP sequence at 30 FPS and scrubbed by Anime.js through a canvas renderer.

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

## Motion sequence

The committed sequence is in `public/sequence/` using this exact naming format:

```text
frame_0000.webp
frame_0001.webp
...
frame_1199.webp
```

The source footage is retained in the GitHub release `source-videos-2026-08-25` rather than shipped as duplicate public assets. The four source clips are 1920 × 1080, 24 FPS, and 10 seconds each; the generation script resamples them by time to the required 30 FPS output. The authorized lower-right sparkle is inpainted during generation.

To regenerate the sequence, download `v1.mp4` through `v4.mp4` into `public/video/` and install the media-processing dependencies outside the app:

```bash
python -m pip install av pillow opencv-python-headless numpy
PYTHONPATH=. python scripts/generate-video-sequence.py --quality 60
```

The renderer loads a small moving window around the current scroll position, so it does not decode all 1,200 images into memory at once. The first 36 frames are loaded before the motion stage is revealed, and a nearest-frame fallback prevents blank draws while the user scrubs quickly.

## Structure

- `components/PortfolioExperience.tsx` — page composition and Anime.js entrance/reveal motion.
- `components/FrameSequence.tsx` — Anime.js scroll observer, frame cache, high-DPI canvas rendering, and phase copy.
- `scripts/generate-video-sequence.py` — authorized watermark cleanup and 24-to-30 FPS WebP generation.
- `public/sequence/` — the committed 1,200-frame motion sequence.
