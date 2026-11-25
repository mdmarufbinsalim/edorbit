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
  "rounded-full border-[2.5px] border-[var(--ink)] px-4 py-1.5 text-sm font-medium transition hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-40";

export function SimulationToolbar(p: SimulationToolbarProps) {
  return (
    <div
      role="toolbar"
      aria-label="Simulation controls"
      className="flex flex-wrap items-center gap-2"
    >
      <button
        type="button"
        className={`${btn} bg-[var(--ink)] text-[var(--paper)]`}
        onClick={p.playing ? p.onPause : p.onPlay}
      >
        {p.playing ? "Pause" : "Play"}
      </button>
      <button type="button" className={btn} onClick={p.onReset}>
        Restart
      </button>
      <button type="button" className={btn} onClick={p.onStep} disabled={p.playing}>
        Step
      </button>
      <label className="ml-auto flex items-center gap-2 text-sm text-muted">
        Speed
        <select
          value={p.timeScale}
          onChange={(e) => p.onTimeScale(Number(e.target.value))}
          className="rounded-full border-[2.5px] border-[var(--ink)] bg-[var(--paper)] px-3 py-1 text-[var(--ink)]"
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
