import { specs } from "@/lib/data";
import Reveal from "./Reveal";

export default function Specs() {
  return (
    <section id="specs" className="mx-auto max-w-6xl px-6 py-24 md:px-10">
      <span className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-fg-muted)]">
        Specs
      </span>
      <p className="mt-4 max-w-xl font-[family-name:var(--font-display)] text-3xl italic sm:text-4xl">
        Numbers for a car that exists only in this scroll.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-line)] sm:grid-cols-2 lg:grid-cols-3">
        {specs.map((spec, i) => (
          <Reveal key={spec.label} delay={(i % 3) * 80}>
            <div className="flex h-full flex-col justify-between gap-10 bg-[var(--color-bg-soft)] p-8">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
                {spec.label}
              </span>
              <div>
                <div className="font-[family-name:var(--font-display)] text-3xl italic text-[var(--color-fg)]">
                  {spec.value}
                </div>
                <div className="mt-1 text-sm text-[var(--color-fg-muted)]">
                  {spec.note}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
