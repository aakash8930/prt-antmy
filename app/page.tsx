import SubmarineSequence from "@/components/SubmarineSequence";
import ClosingSignal from "@/components/ClosingSignal";

export default function Home() {
  return (
    <main id="top" className="relative bg-abyss-shadow">
      <nav className="pointer-events-none fixed inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-6 md:px-10">
        <span className="pointer-events-auto text-xs font-semibold tracking-[0.3em] text-white/90">DUFORGE</span>
        <a
          href="#signal"
          className="pointer-events-auto text-[11px] tracking-[0.3em] text-white/70 transition hover:text-abyss-cyan"
        >
          EXPLORE
        </a>
      </nav>

      <SubmarineSequence />
      <ClosingSignal />
    </main>
  );
}
