"use client";

import { useId } from "react";
import { formatSig } from "@edorbit/core";

export interface ParameterSliderProps {
  label: string;
  unit: string;
  /** Value in SI (model) units. */
  value: number;
  min: number;
  max: number;
  step: number;
  /** Multiply SI values by this for display, e.g. 1/1000 for km. */
  displayScale?: number;
  description?: string;
  onChange: (value: number) => void;
}

/** Ink-line range input with a big, friendly value readout. Keyboard accessible. */
export function ParameterSlider({
  label,
  unit,
  value,
  min,
  max,
  step,
  displayScale = 1,
  description,
  onChange,
}: ParameterSliderProps) {
  const id = useId();
  const shown = formatSig(value * displayScale, 3);
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm text-muted">
          {label}
        </label>
        <span className="text-lg font-medium tabular-nums">
          {shown} <span className="text-sm text-muted">{unit}</span>
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={`${shown} ${unit}`}
        aria-describedby={description ? `${id}-d` : undefined}
        onChange={(e) => onChange(e.target.valueAsNumber)}
        className="sketch-range w-full"
      />
      {description && (
        <p id={`${id}-d`} className="text-xs text-muted">
          {description}
        </p>
      )}
    </div>
  );
}
