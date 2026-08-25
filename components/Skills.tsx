import { skills } from "@/lib/data";
import Reveal from "./Reveal";

export default function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-6xl px-6 py-20">
      <Reveal>
        <h2 className="text-sm uppercase tracking-[0.2em] text-muted">Skills</h2>
      </Reveal>

      <div className="mt-8 grid grid-cols-1 gap-10 sm:grid-cols-3">
        {Object.entries(skills).map(([group, items], i) => (
          <Reveal key={group} delay={i * 80}>
            <h3 className="text-sm font-medium text-foreground">{group}</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {items.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-border px-3 py-1 text-sm text-muted"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
