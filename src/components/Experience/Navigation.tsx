"use client";

import { useExperience, experienceStore } from "@/experience/ExperienceStore";
import { audioController } from "@/audio/AudioController";

const Mark = () => (
  <div className="flex items-center gap-3">
    <svg width="26" height="18" viewBox="0 0 26 18" fill="none" aria-hidden>
      <path
        d="M2 16 L10 2 L14 10 L18 2 L24 16"
        stroke="#eef1ee"
        strokeWidth="1.6"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
    <div className="leading-none">
      <div className="text-[15px] tracking-[0.34em] font-semibold">VOLT</div>
      <div className="volt-label mt-1 !text-[8px] !tracking-[0.26em]">
        ENGINEERED TO MOVE
      </div>
    </div>
  </div>
);

export default function Navigation() {
  const { audio } = useExperience();

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex items-center justify-between px-5 py-5 sm:px-10">
      <Mark />

      <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
        <div className="volt-label hidden items-center gap-2 sm:flex">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#9fe8dd]" />
          SCROLL TO DRIVE
        </div>
        <button
          aria-label={audio ? "Mute audio" : "Enable audio"}
          onClick={() => {
            const next = !audio;
            audioController.setEnabled(next);
            experienceStore.setAudio(next);
          }}
          className="group flex items-center gap-2 border border-white/10 bg-black/20 px-3 py-2 font-tech text-[10px] uppercase tracking-[0.18em] text-white/70 backdrop-blur-sm transition hover:border-[#9fe8dd]/40 hover:text-white"
        >
          <span
            className={`relative h-1.5 w-1.5 rounded-full ${
              audio ? "bg-[#9fe8dd]" : "bg-white/25"
            }`}
          />
          {audio ? "SOUND ON" : "SOUND OFF"}
        </button>
      </div>
    </header>
  );
}
