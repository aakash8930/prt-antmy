(() => {
  const chapters = [...document.querySelectorAll(".chapter")];
  const frames = [...document.querySelectorAll(".scene__frame")];
  const frameImages = frames.map((frame) => frame.querySelector("img"));
  const links = [...document.querySelectorAll(".chapter-menu a")];
  const loader = document.querySelector(".loader");
  const loaderCount = loader.querySelector("span");
  const depthReadout = document.querySelector(".masthead__depth strong");
  const indexButton = document.querySelector(".masthead__index");
  const menu = document.querySelector(".chapter-menu");
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

  function markLoaded(index) {
    if (readyFrames.has(index)) return;
    readyFrames.add(index);
    loaded += 1;
    loaderCount.textContent = String(Math.round((loaded / frames.length) * 100)).padStart(2, "0");
    if (!firstReady && [0, 1, 2].every((frame) => readyFrames.has(frame))) {
      firstReady = true;
      requestAnimationFrame(() => loader.classList.add("is-gone"));
    }
  }

  frameImages.forEach((image, index) => {
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

    links.forEach((link) => {
      const current = link.hash === `#${active.chapter.id}`;
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
