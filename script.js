(() => {
  const chapters = [...document.querySelectorAll(".chapter")];
  const frames = [...document.querySelectorAll(".scene__frame")];
  const frameImages = frames.map((frame) => frame.querySelector("img"));
  const motionImages = [...document.querySelectorAll(".motion-world img")];
  const preloadImages = [...frameImages, ...motionImages];
  const links = [...document.querySelectorAll(".chapter-menu a")];
  const loader = document.querySelector(".loader");
  const loaderCount = loader.querySelector("span");
  const depthReadout = document.querySelector(".masthead__depth strong");
  const indexButton = document.querySelector(".masthead__index");
  const menu = document.querySelector(".chapter-menu");
  const archive = document.querySelector(".archive");
  const motionWorld = document.querySelector(".motion-world");
  const motionCapsule = document.querySelector(".motion-capsule");
  const motionParts = Object.fromEntries(
    [...document.querySelectorAll(".motion-part")].map((part) => [
      [...part.classList].find((name) => name.startsWith("motion-part--")).replace("motion-part--", ""),
      part,
    ]),
  );
  const particleField = document.querySelector(".motion-field__particles");
  const organismField = document.querySelector(".motion-field__organisms");
  const pressureField = document.querySelector(".motion-field__pressure");
  const sampleField = document.querySelector(".motion-field__sample");
  const signalField = document.querySelector(".motion-field__signal");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");

  let metrics = [];
  let framePending = false;
  let loaded = 0;
  let firstReady = false;
  const readyFrames = new Set();

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const ease = (value) => {
    const t = clamp(value);
    return t * t * (3 - 2 * t);
  };
  const range = (value, start, end) => ease((value - start) / (end - start));
  const mix = (from, to, progress) => from + (to - from) * progress;

  // Deterministic ambient life: no layout changes between reloads or while reversing.
  for (let index = 0; index < 34; index += 1) {
    const particle = document.createElement("i");
    particle.className = "motion-particle";
    particle.style.setProperty("--left", `${(index * 37) % 101}%`);
    particle.style.setProperty("--top", `${(index * 61) % 103}%`);
    particle.style.setProperty("--size", `${1 + (index % 3)}px`);
    particle.style.setProperty("--alpha", `${.16 + (index % 5) * .08}`);
    particle.style.setProperty("--duration", `${3.8 + (index % 7) * .7}s`);
    particle.style.setProperty("--delay", `${-(index % 8) * .6}s`);
    particle.style.setProperty("--drift", `${-18 + (index % 9) * 5}px`);
    particleField.append(particle);
  }
  for (let index = 0; index < 11; index += 1) {
    const organism = document.createElement("i");
    organism.className = "motion-organism";
    organism.style.setProperty("--left", `${16 + (index * 19) % 72}%`);
    organism.style.setProperty("--top", `${14 + (index * 31) % 65}%`);
    organism.style.setProperty("--size", `${12 + (index % 4) * 8}px`);
    organism.style.setProperty("--duration", `${3.5 + (index % 5)}s`);
    organism.style.setProperty("--delay", `${-(index % 6) * .8}s`);
    organism.style.setProperty("--tail", `${-24 + (index % 7) * 8}deg`);
    organismField.append(organism);
  }

  function setPart(name, progress, from) {
    const part = motionParts[name];
    part.style.setProperty("--part-opacity", progress.toFixed(3));
    part.style.setProperty("--tx", `${mix(from.x, 0, progress).toFixed(1)}px`);
    part.style.setProperty("--ty", `${mix(from.y, 0, progress).toFixed(1)}px`);
    part.style.setProperty("--rotation", `${mix(from.rotation, 0, progress).toFixed(1)}deg`);
    part.style.setProperty("--part-scale", mix(from.scale, 1, progress).toFixed(3));
  }

  function renderMotion(narrative) {
    const instant = reduceMotion.matches;
    const worldOpacity = instant ? 0 : 1 - range(narrative, 2.35, 2.95);
    const core = range(narrative, .04, .48);
    const viewport = range(narrative, .28, .9);
    const ballast = range(narrative, .56, 1.16);
    const panels = range(narrative, .92, 1.58);
    const halo = range(narrative, 1.25, 1.82);
    const arms = range(narrative, 1.48, 2.16);

    motionWorld.style.setProperty("--world-opacity", worldOpacity.toFixed(3));
    motionCapsule.style.setProperty("--capsule-scale", `${matchMedia("(max-width: 640px)").matches ? .67 : matchMedia("(max-width: 900px) and (orientation: portrait)").matches ? .82 : 1}`);
    motionCapsule.style.setProperty("--capsule-y", `${mix(48, 0, core) + Math.sin(narrative * 3.2) * 3}px`);
    motionCapsule.style.setProperty("--capsule-rotation", `${mix(-5, 0, core)}deg`);
    motionCapsule.style.setProperty("--glass-opacity", viewport.toFixed(3));
    motionCapsule.style.setProperty("--glass-scale", mix(.28, 1, viewport).toFixed(3));
    motionCapsule.style.setProperty("--beam-opacity", range(narrative, 1.7, 2.2).toFixed(3));
    motionCapsule.style.setProperty("--lights-opacity", range(narrative, 1.82, 2.22).toFixed(3));

    setPart("core", core, { x: 0, y: -120, rotation: -7, scale: .68 });
    setPart("viewport", viewport, { x: -270, y: -40, rotation: -42, scale: .42 });
    setPart("ballast", ballast, { x: 0, y: 230, rotation: 0, scale: .58 });
    setPart("panel-left", panels, { x: -250, y: 28, rotation: -18, scale: .82 });
    setPart("panel-right", panels, { x: 250, y: 28, rotation: 18, scale: .82 });
    setPart("halo", halo, { x: 0, y: -210, rotation: 8, scale: .55 });
    setPart("arm-left", arms, { x: -350, y: 100, rotation: -34, scale: .75 });
    setPart("arm-right", arms, { x: 350, y: 100, rotation: 34, scale: .75 });

    const fieldIn = range(narrative, 2.72, 3.3);
    const fieldOut = 1 - range(narrative, 7.82, 8);
    particleField.style.setProperty("--field-opacity", (instant ? 0 : fieldIn * fieldOut).toFixed(3));
    particleField.style.setProperty("--field-y", `${(narrative - 3) * -22}px`);

    const pressure = range(narrative, 4.25, 4.95) * (1 - range(narrative, 5.32, 5.78));
    pressureField.style.setProperty("--pressure-opacity", (instant ? 0 : pressure).toFixed(3));
    pressureField.style.setProperty("--pressure-scale", mix(.55, 1.22, range(narrative, 4.25, 5.6)).toFixed(3));

    const organisms = range(narrative, 5.45, 6.08) * (1 - range(narrative, 6.72, 7.15));
    organismField.style.setProperty("--organism-opacity", (instant ? 0 : organisms).toFixed(3));
    organismField.style.setProperty("--organism-scale", mix(.65, 1.12, range(narrative, 5.45, 6.85)).toFixed(3));

    const sample = range(narrative, 6.58, 7.24);
    sampleField.style.setProperty("--sample-opacity", (instant ? 0 : sample * (1 - range(narrative, 7.55, 7.85))).toFixed(3));
    sampleField.style.setProperty("--sample-progress", sample.toFixed(3));

    const signal = range(narrative, 7.5, 8);
    signalField.style.setProperty("--signal-opacity", (instant ? 0 : signal).toFixed(3));
    signalField.style.setProperty("--signal-progress", signal.toFixed(3));
  }

  function markLoaded(index) {
    if (readyFrames.has(index)) return;
    readyFrames.add(index);
    loaded += 1;
    loaderCount.textContent = String(Math.round((loaded / preloadImages.length) * 100)).padStart(2, "0");
    if (!firstReady && readyFrames.size === preloadImages.length) {
      firstReady = true;
      requestAnimationFrame(() => loader.classList.add("is-gone"));
    }
  }

  preloadImages.forEach((image, index) => {
    if (image.complete) markLoaded(index);
    else {
      image.addEventListener("load", () => markLoaded(index), { once: true });
      image.addEventListener("error", () => markLoaded(index), { once: true });
    }
  });

  function measure() {
    metrics = chapters.map((chapter, index) => {
      const top = chapter.offsetTop;
      return {
        index,
        chapter,
        center: top + chapter.offsetHeight / 2,
        depth: Number(chapter.dataset.depth || 0),
      };
    });
    update();
  }

  function getNarrativePosition(focus) {
    if (!metrics.length || focus <= metrics[0].center) return 0;
    const last = metrics.length - 1;
    if (focus >= metrics[last].center) return last;

    for (let index = 0; index < last; index += 1) {
      const current = metrics[index];
      const next = metrics[index + 1];
      if (focus >= current.center && focus < next.center) {
        return index + (focus - current.center) / (next.center - current.center);
      }
    }
    return 0;
  }

  function update() {
    framePending = false;
    if (!metrics.length) return;

    const viewportHeight = window.innerHeight;
    const focus = window.scrollY + viewportHeight * 0.5;
    const narrative = getNarrativePosition(focus);
    renderMotion(narrative);
    const activeIndex = Math.round(narrative);
    const active = metrics[activeIndex];

    frames.forEach((image, index) => {
      const distance = Math.abs(narrative - index);
      const visibility = reduceMotion.matches
        ? (index === activeIndex ? 1 : 0)
        : ease(1 - clamp(distance));
      const direction = clamp(narrative - index, -1, 1);
      image.style.setProperty("--opacity", visibility.toFixed(4));
      image.style.setProperty("--scale", (1.018 + Math.abs(direction) * 0.045).toFixed(4));
      image.style.setProperty("--x", `${(-direction * 1.4).toFixed(3)}%`);
      image.style.setProperty("--y", `${(direction * 0.55).toFixed(3)}%`);
    });

    metrics.forEach(({ chapter }) => {
      const rect = chapter.getBoundingClientRect();
      const distance = Math.abs(rect.top + rect.height / 2 - viewportHeight * 0.5);
      const range = viewportHeight * 0.62;
      const visibility = reduceMotion.matches ? 1 : ease(1 - distance / range);
      const copy = chapter.querySelector(".chapter__copy");
      if (copy) {
        copy.style.setProperty("--copy-opacity", visibility.toFixed(3));
        copy.style.setProperty("--copy-y", `${((1 - visibility) * 34).toFixed(1)}px`);
      }
    });

    const lower = Math.floor(narrative);
    const upper = Math.min(metrics.length - 1, lower + 1);
    const fraction = narrative - lower;
    const depth = metrics[lower].depth + (metrics[upper].depth - metrics[lower].depth) * fraction;
    depthReadout.textContent = `${Math.round(depth).toString().padStart(4, "0")} m`;

    const side = active.chapter.classList.contains("chapter--right")
      ? "right"
      : active.chapter.classList.contains("chapter--opening") || active.chapter.classList.contains("chapter--final")
        ? "center"
        : "left";
    document.body.dataset.side = side;
    document.body.dataset.chapter = active.chapter.id;

    const archiveActive = archive.getBoundingClientRect().top <= viewportHeight * 0.5;
    links.forEach((link) => {
      const current = archiveActive
        ? link.hash === "#archive"
        : link.hash === `#${active.chapter.id}`;
      if (current) link.setAttribute("aria-current", "step");
      else link.removeAttribute("aria-current");
    });

    const maxScroll = Math.max(1, document.documentElement.scrollHeight - viewportHeight);
    document.documentElement.style.setProperty("--page-progress", `${(window.scrollY / maxScroll) * 100}%`);
  }

  function schedule() {
    if (framePending) return;
    framePending = true;
    requestAnimationFrame(update);
  }

  indexButton.addEventListener("click", () => {
    const open = indexButton.getAttribute("aria-expanded") !== "true";
    indexButton.setAttribute("aria-expanded", String(open));
    menu.classList.toggle("is-open", open);
  });

  links.forEach((link) => link.addEventListener("click", () => {
    indexButton.setAttribute("aria-expanded", "false");
    menu.classList.remove("is-open");
  }));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.classList.contains("is-open")) {
      indexButton.setAttribute("aria-expanded", "false");
      menu.classList.remove("is-open");
      indexButton.focus();
    }
  });

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", measure);
  reduceMotion.addEventListener("change", schedule);
  window.addEventListener("load", measure, { once: true });
  measure();
})();
