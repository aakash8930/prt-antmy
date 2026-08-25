"use client";

import { useEffect, useRef } from "react";
import { flagshipProjects, type FlagshipProject } from "@/lib/data";
import Reveal from "./Reveal";

function ShowcaseRow({ project, index }: { project: FlagshipProject; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const reversed = index % 2 === 1;

  return (
    <div
      id={project.slug}
      className={`flex flex-col gap-10 py-20 md:flex-row md:items-center md:gap-16 ${
        reversed ? "md:flex-row-reverse" : ""
      }`}
    >
      <Reveal className="md:w-3/5">
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <video
            ref={videoRef}
            src={project.video}
            muted
            loop
            playsInline
            preload="metadata"
            className="aspect-video w-full object-cover"
          />
        </div>
      </Reveal>

      <Reveal className="md:w-2/5" delay={100}>
        <span className="text-xs uppercase tracking-[0.2em] text-muted">
          {String(index + 1).padStart(2, "0")} — Featured
        </span>
        <h3 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
          {project.name}
        </h3>
        <p className="mt-1 text-muted">{project.tagline}</p>
        <p className="mt-5 text-foreground/80 leading-relaxed">
          {project.description}
        </p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <li
              key={s}
              className="rounded-full border border-border px-3 py-1 text-xs text-muted"
            >
              {s}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex gap-5">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-accent"
          >
            Code →
          </a>
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-accent"
            >
              Live →
            </a>
          )}
        </div>
      </Reveal>
    </div>
  );
}

export default function ProjectShowcase() {
  return (
    <section id="work" className="mx-auto max-w-6xl px-6 py-10">
      <Reveal>
        <h2 className="text-sm uppercase tracking-[0.2em] text-muted">Work</h2>
        <p className="mt-3 max-w-xl text-2xl font-medium text-foreground sm:text-3xl">
          A closer look at three projects behind the reel above.
        </p>
      </Reveal>

      <div className="divide-y divide-border">
        {flagshipProjects.map((project, i) => (
          <ShowcaseRow key={project.slug} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
