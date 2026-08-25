import { profile } from "@/lib/data";
import Reveal from "./Reveal";

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-28">
      <Reveal>
        <h2 className="text-sm uppercase tracking-[0.2em] text-muted">About</h2>
        <p className="mt-6 max-w-3xl text-2xl font-medium leading-snug text-foreground sm:text-3xl md:text-4xl">
          {profile.bio}
        </p>
      </Reveal>
    </section>
  );
}
