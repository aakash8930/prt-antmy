import { profile } from "@/lib/data";
import Reveal from "./Reveal";

export default function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-28">
      <Reveal>
        <h2 className="text-sm uppercase tracking-[0.2em] text-muted">Contact</h2>
        <p className="mt-6 max-w-2xl text-3xl font-medium leading-snug text-foreground sm:text-5xl">
          Have something to build? I&apos;d like to hear about it.
        </p>
        <a
          href={`mailto:${profile.email}`}
          className="mt-8 inline-block text-xl font-medium text-foreground underline decoration-border underline-offset-8 transition-colors hover:decoration-accent sm:text-2xl"
        >
          {profile.email}
        </a>
      </Reveal>

      <div className="mt-20 flex flex-col items-start justify-between gap-6 border-t border-border pt-8 sm:flex-row sm:items-center">
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted transition-colors hover:text-foreground"
        >
          GitHub ↗
        </a>
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} {profile.name}
        </p>
      </div>
    </section>
  );
}
