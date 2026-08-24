export default function ClosingSignal() {
  const stats = [
    { label: "Depth", value: "6000 M" },
    { label: "Pressure", value: "1080 BAR" },
    { label: "Temp.", value: "2.1 °C" },
    { label: "Power", value: "78%" },
  ];

  return (
    <section id="signal" className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden bg-abyss-shadow">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/closing-signal.webp)" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(2,7,11,0.88) 0%, rgba(2,7,11,0.55) 45%, rgba(2,7,11,0.35) 70%, rgba(2,7,11,0.8) 100%), linear-gradient(180deg, rgba(2,7,11,0.4) 0%, transparent 30%, transparent 65%, rgba(2,7,11,0.9) 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-1 flex-col justify-center gap-8 px-6 py-32 md:px-10">
        <p className="text-[11px] tracking-[0.3em] text-abyss-cyan/80 uppercase">Signal received</p>
        <h2 className="max-w-3xl font-serif text-4xl leading-[1.05] text-white md:text-6xl">
          The unknown has <em className="text-abyss-softblue not-italic">answered</em>.
        </h2>
        <p className="max-w-md text-sm text-white/60 md:text-base">
          We went down to look closer. Now we listen. D-01 remains on station, transmitting.
        </p>

        <dl className="mt-4 grid max-w-xl grid-cols-2 gap-x-10 gap-y-5 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="text-[10px] uppercase tracking-[0.2em] text-white/45">{stat.label}</dt>
              <dd className="mt-1 font-mono text-lg text-white/90">{stat.value}</dd>
            </div>
          ))}
        </dl>

        <a
          href="#top"
          className="mt-4 inline-flex w-fit items-center gap-3 border-b border-abyss-cyan/40 pb-1 text-xs tracking-[0.25em] text-abyss-softblue transition hover:border-abyss-cyan hover:text-white"
        >
          BACK TO THE SURFACE <span aria-hidden>↑</span>
        </a>
      </div>

      <footer className="relative z-10 flex flex-col gap-4 border-t border-white/10 px-6 py-8 text-[10px] uppercase tracking-[0.2em] text-white/40 md:flex-row md:items-center md:justify-between md:px-10">
        <span>Duforge · D-01 Deep Ocean Expedition</span>
        <span>A fictional field story &amp; interactive design project</span>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </section>
  );
}
