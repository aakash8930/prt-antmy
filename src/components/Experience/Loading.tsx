"use client";

import { useEffect, useState } from "react";
import { assetManager, type LoadState } from "@/rendering/AssetManager";
import { experienceStore } from "@/experience/ExperienceStore";

const pad = (v: number, l = 3) => String(v).padStart(l, "0");

export default function Loading() {
  const [state, setState] = useState<LoadState>(assetManager.getState());
  const [enabled, setEnabled] = useState(experienceStore.get().enabled);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const off = assetManager.subscribe((s) => setState(s));
    const offStore = experienceStore.subscribe(() => {
      setEnabled(experienceStore.get().enabled);
    });
    return () => {
      off();
      offStore();
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const t = window.setTimeout(() => setDone(true), 900);
    return () => window.clearTimeout(t);
  }, [enabled]);

  if (done) return null;

  const pct = state.percent || 0;
  const critical = state.assets.filter((a) => a.critical).length;
  const criticalLoaded = Math.max(
    0,
    Math.min(critical, state.loaded - (state.total - critical)),
  );

  return (
    <div className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-[#07090a]">
      <div className="w-full max-w-[420px] px-6">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[28px] font-semibold tracking-[0.34em]">
              VOLT
            </div>
            <div className="volt-label mt-2 !text-[9px]">
              SYSTEM INITIALIZATION
            </div>
          </div>
          <div className="volt-mono text-[26px] text-white/90">{pct}%</div>
        </div>

        <div className="mt-10 space-y-3">
          <Row label="ASSETS" value={`${pad(state.loaded)} / ${pad(state.total)}`} />
          <Row label="GEOMETRY" value={state.ready ? "READY" : "BUILDING"} />
          <Row
            label="SHADERS"
            value={pct > 12 ? "READY" : "COMPILING"}
          />
          <Row label="ENVIRONMENT" value={pct > 40 ? "READY" : "LOADING"} />
        </div>

        <div className="mt-10 h-px w-full bg-white/10">
          <div
            className="h-px bg-[#9fe8dd] transition-[width] duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>

        <button
          onClick={() => window.dispatchEvent(new CustomEvent("volt:engage"))}
          className="mt-8 flex w-full items-center justify-between border border-white/12 bg-white/[0.02] px-4 py-3 font-tech text-[10px] uppercase tracking-[0.22em] text-white/60 transition hover:border-[#9fe8dd]/40 hover:text-white"
        >
          <span>{enabled ? "SYSTEM ENGAGED" : "CLICK OR SCROLL TO ENGAGE"}</span>
          <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between font-tech text-[11px] uppercase tracking-[0.16em]">
    <span className="text-white/35">{label}</span>
    <span className="volt-mono text-white/75">{value}</span>
  </div>
);
