"use client";

import { useId } from "react";
import { formatSig } from "@orbital/core";

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

/** Keyboard-accessible range input with a numeric readout in display units. */
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
  const shown = formatSig(value * displayScale, 4);
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between text-sm">
        <label htmlFor={id} className="text-slate-300">
          {label}
        </label>
        <span className="font-mono text-xs text-slate-200">
          {shown} {unit}
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
        aria-describedby={description ? `${id}-desc` : undefined}
        onChange={(e) => onChange(e.target.valueAsNumber)}
        className="w-full accent-accent"
      />
      {description && (
        <p id={`${id}-desc`} className="text-xs text-slate-500">
          {description}
        </p>
      )}
    </div>
  );
}
