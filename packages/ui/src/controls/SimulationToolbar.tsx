"use client";

import type { TimeScaleOption } from "@orbital/core";

export interface SimulationToolbarProps {
  playing: boolean;
  timeScale: number;
  timeScales: readonly TimeScaleOption[];
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStep: () => void;
  onTimeScale: (value: number) => void;
}

const btn =
  "rounded border border-space-700 px-3 py-1 text-sm hover:border-accent focus-visible:outline-2 focus-visible:outline-accent";

export function SimulationToolbar(p: SimulationToolbarProps) {
  return (
    <div
      role="toolbar"
      aria-label="Simulation controls"
      className="flex flex-wrap items-center gap-2"
    >
      <button type="button" className={btn} onClick={p.playing ? p.onPause : p.onPlay}>
        {p.playing ? "Pause" : "Play"}
      </button>
      <button type="button" className={btn} onClick={p.onStep} disabled={p.playing}>
        Step
      </button>
      <button type="button" className={btn} onClick={p.onReset}>
        Reset
      </button>
      <label className="ml-auto flex items-center gap-2 text-sm text-slate-400">
        Speed
        <select
          value={p.timeScale}
          onChange={(e) => p.onTimeScale(Number(e.target.value))}
          className="rounded border border-space-700 bg-space-950 px-2 py-1 text-slate-200"
        >
          {p.timeScales.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
