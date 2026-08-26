import { journal } from "@/lib/data";
import Reveal from "./Reveal";
import TiltCard from "./TiltCard";

const SPANS = ["md:col-span-2", "md:col-span-1", "md:col-span-1"];

export default function Journal() {
  return (
    <section id="journal" className="mx-auto max-w-6xl px-6 py-24 md:px-10">
      <span className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-fg-muted)]">
        Journal
      </span>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        {journal.map((entry, i) => (
          <Reveal key={entry.title} delay={i * 80}>
            <TiltCard className={SPANS[i % SPANS.length]}>
              <div className="group block h-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-soft)] p-6 transition-colors hover:border-[var(--color-accent)]/40">
                <div className="flex items-start justify-between gap-4">
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
                    {entry.category}
                  </span>
                  <span className="text-[var(--color-fg-muted)] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
                    ↗
                  </span>
                </div>
                <h3 className="mt-4 font-[family-name:var(--font-display)] text-2xl italic">
                  {entry.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
                  {entry.body}
                </p>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
