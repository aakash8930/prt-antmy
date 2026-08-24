# AI Core — animation frames

The first visual pass for the new site is a futuristic AI-core sequence designed for an Anime.js-style scroll experience.

- 240 SVG frames
- 30 FPS timing
- 8 seconds of motion
- 2560 × 1440 frame canvas
- Generated with `node scripts/generate-ai-sequence.mjs`

The SVG frames use the generated `public/ai-core-style-frame.jpg` as the visual anchor and add deterministic vector rings, particles, signals, and a controlled camera push-in. This keeps the sequence coherent, crisp, and lightweight while the website direction is finalized.
