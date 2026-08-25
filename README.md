# VOLT — ENGINEERED TO MOVE

A cinematic, scroll-driven brand experience for a fictional high-performance
electric motorcycle. Built as a single continuous product film: one normalized
`experienceProgress` value drives the 3D scene, camera choreography, exploded
view, lighting, particles, custom shaders, canvas image-sequence engine, HUD,
audio, and typography. Scrolling backward reverses the entire experience.

---

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4**
- **Three.js** + **React Three Fiber** + **@react-three/drei**
- **GSAP** + **ScrollTrigger** as the orchestration layer
- **Lenis** smooth scroll
- **Web Audio API** (layered, procedural mix)
- **HTML Canvas** (image-sequence engine)
- **GLSL** (energy field, atmospheric depth, distortion, final grade)

---

## Running

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build
npm run start    # serve production build
```

---

## How the experience is organized

The master timeline is `experienceProgress` (`0 → 1`). Every system reads it on
every frame; nothing owns private scroll state.

### Acts

| #  | Act            | Progress  | What happens                                            |
|----|----------------|-----------|---------------------------------------------------------|
| 1  | Ignition       | 0.00–0.07 | A pulse wakes the machine. `SYSTEM // INITIALIZING`.     |
| 2  | Form           | 0.07–0.22 | Cinematic orbit. Technical labels near the components.  |
| 3  | Material       | 0.22–0.34 | Extreme close-up; studio lighting reveals the surfaces. |
| 4  | Deconstruction | 0.34–0.52 | The machine explodes along meaningful engineering axes. |
| 5  | Power System   | 0.52–0.66 | Camera enters the battery pack. Live telemetry.         |
| 6  | The Core       | 0.66–0.77 | The motor becomes the subject; GLSL energy field.       |
| 7  | Performance    | 0.77–0.89 | Rear-wheel shot, road streaks, restrained speed HUD.    |
| 8  | Human + Machine| 0.89–0.96 | Quiet studio; the machine wakes for a pilot.            |
| 9  | Final Form     | 0.96–1.00 | Clean orbit. `VOLT` / `ENGINEERED TO MOVE` / CTA.       |

### System modules (`src/`)

```
app/                    App Router shell (layout, page, global styles)
components/
  Experience/           Viewport, overlay, navigation, loader, debug panel
experience/
  ExperienceEngine.ts   Orchesator — advances every system from one progress value
  SceneManager.ts       Renderer config, enviro map, post pipeline
  CameraController.ts   Catmull-Rom camera paths + direct inspection orbit
  MotorcycleController.ts  Wheel/rotor/lights/visibility choreography
  ExplodedViewController   Assembled → exploded translation/rotation
  LightingController.ts Act-aware studio light rig
  ParticleSystem.ts     Single GPU Points cloud (dust/energy/road)
  ShaderController.ts   Energy field + atmospheric depth + distortion
animation/
  MasterTimeline.ts     Act definitions and window functions
  ScrollController.ts   Lenis + ScrollTrigger + single rAF engine
rendering/
  SequenceRenderer.ts   Canvas image-sequence engine
  AssetManager.ts       Manifest, preload, load state
  QualityManager.ts     High / Medium / Low device profiles
  TextureCache.ts       Procedural texture cache
shaders/                GLSL: EnergyField, Atmosphere, Distortion, Post
audio/                  AudioController (layered Web Audio)
utils/                  device detection, math helpers
```

---

## Design decisions

- **No generic/animated landing page.** The page is a 1500vh scroll track with
  a fixed cinematic viewport; sections are acts of one continuous film.
- **The motorcycle is the hero.** The camera and lights move; the machine does
  not spin in place. It only rotates subtly when the user inspects it.
- **Reversible by construction.** All choreography is a pure function of
  `experienceProgress`, so back-scrolling reassembles the machine exactly.
- **Restrained, not cyberpunk.** Near-black environment, cool white
  engineering accents, no neon, no glassmorphism, no cards.
- **Image sequences.** One `<canvas>`, progressive preload, frame cache,
  responsive resolution, no hundreds of `<img>` nodes. When sequence frames
  are absent the renderer falls back to a procedural road composite that stays
  synchronized to scroll.
- **Performance.** Device detection selects quality (particle count, DPR,
  shader detail, post effects). Scroll animation and React re-renders are
  decoupled — the DOM overlay updates via direct frame subscriptions, never
  per-frame React state.

---

## Controls

- **Scroll** — drive the experience forward and backward.
- **Click / press any key / scroll** — engage the system (also unlocks audio).
- **Audio toggle** — top-right.
- **Inspection** — during the deconstruction act, drag to orbit the machine and
  hover/click components. Use `RETURN TO EXPERIENCE` to release the focus.
- **Press `D`** — developer panel (FPS, progress, draw calls, triangles,
  particles, quality, memory, active scene, audio) plus jump, quality,
  wireframe, bounds, camera path, and component-name controls.

---

## Asset pipeline note

The live experience renders an engineered procedural motorcycle model in
Three.js, so it runs without large binary assets. To upgrade to a production
asset set, drop a GLB/GLTF into `public/motorcycle/` and a 216-frame WebP
sequence into `public/sequences/road/` — `SequenceRenderer` and the scene
attachment layer are already structured to consume them.
