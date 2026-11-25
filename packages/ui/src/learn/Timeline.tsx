"use client";

import { useEffect, useId, useRef, useState } from "react";

export interface TimelineMark {
  value: number;
  label: string;
}

export interface TimelineProps {
  label: string;
  min: number;
  max: number;
  value: number;
  step?: number;
  onChange: (value: number) => void;
  /** Labelled ticks under the track, e.g. key dates. */
  marks?: readonly TimelineMark[];
  /** How the current value is shown, e.g. a year or a date. */
  format?: (value: number) => string;
  /** Adds a play button that steps forward to `max`. */
  playable?: boolean;
  /** Steps per second while playing. */
  speed?: number;
}

/** A scrubbable timeline with labelled marks and an optional play button. Keyboard accessible. */
export function Timeline({
  label,
  min,
  max,
  value,
  step = 1,
  onChange,
  marks = [],
  format = String,
  playable = false,
  speed = 6,
}: TimelineProps) {
  const id = useId();
  const [playing, setPlaying] = useState(false);
  const latest = useRef({ value, onChange });
  useEffect(() => {
    latest.current = { value, onChange };
  });

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      const { value: v, onChange: change } = latest.current;
      const next = Math.min(max, v + step);
      change(next);
      if (next >= max) setPlaying(false);
    }, 1000 / speed);
    return () => window.clearInterval(timer);
  }, [playing, max, step, speed]);

  const pct = (v: number) => ((v - min) / (max - min)) * 100;
  const shown = format(value);

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm text-muted">
          {label}
        </label>
        <span className="text-3xl font-medium tabular-nums">{shown}</span>
      </div>
      <div className="flex items-center gap-4">
        {playable && (
          <button
            type="button"
            onClick={() => {
              if (!playing && value >= max) onChange(min);
              setPlaying((p) => !p);
            }}
            className="shrink-0 rounded-full border-2 border-[var(--ink)] px-4 py-1 text-sm transition hover:-translate-y-0.5"
          >
            {playing ? "Pause" : value >= max ? "Replay" : "Play"}
          </button>
        )}
        <div className="relative min-w-0 flex-1 pb-6">
          <input
            id={id}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            aria-valuetext={shown}
            onChange={(e) => {
              setPlaying(false);
              onChange(e.target.valueAsNumber);
            }}
            className="sketch-range w-full"
          />
          {marks.map((m) => (
            <span
              key={`${m.value}-${m.label}`}
              aria-hidden="true"
              className="absolute top-7 -translate-x-1/2 text-[11px] whitespace-nowrap text-muted"
              style={{ left: `${pct(m.value)}%` }}
            >
              <span className="mx-auto mb-0.5 block h-2 w-px bg-[var(--faint)]" />
              {m.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
