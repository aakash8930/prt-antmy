import { otherProjects } from "@/lib/data";
import Reveal from "./Reveal";

export default function OtherProjects() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <Reveal>
        <h2 className="text-sm uppercase tracking-[0.2em] text-muted">
          More on GitHub
        </h2>
      </Reveal>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {otherProjects.map((project, i) => (
          <Reveal key={project.name} delay={(i % 3) * 60}>
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group block h-full rounded-xl border border-border bg-surface p-6 transition-colors hover:border-foreground/30"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-lg font-medium text-foreground">
                  {project.name}
                </h3>
                <span className="text-muted transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
                  ↗
                </span>
              </div>
              <p className="mt-2 text-sm text-muted">{project.description}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.stack.map((s) => (
                  <li
                    key={s}
                    className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted"
                  >
                    {s}
                  </li>
                ))}
              </ul>
              {project.live && (
                <span className="mt-4 inline-block text-xs text-muted underline underline-offset-4">
                  Live demo available
                </span>
              )}
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
