"use client";

import { useEffect, useState } from "react";
import { formatSig, type ReadoutDefinition, type SimulationEngine } from "@edorbit/core";

/** Polls the engine at a modest rate so values update without per-frame React renders. */
export function ReadoutPanel<State, Params>({
  engine,
  readouts,
  size = "lg",
  intervalMs = 150,
}: {
  engine: SimulationEngine<State, Params>;
  readouts: readonly ReadoutDefinition<State, Params>[];
  size?: "lg" | "sm";
  intervalMs?: number;
}) {
  const compute = () => {
    const { state } = engine.snapshot();
    return readouts.map((r) => {
      const v = r.value(state, engine.parameters);
      return typeof v === "number" ? formatSig(v, 4) : v;
    });
  };
  const [values, setValues] = useState(compute);
  useEffect(() => {
    const id = setInterval(() => setValues(compute()), intervalMs);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engine, readouts, intervalMs]);

  return (
    <dl
      aria-label="Live readouts"
      className={
        size === "lg"
          ? "grid grid-cols-2 gap-x-6 gap-y-4"
          : "grid grid-cols-2 gap-x-6 gap-y-1 text-sm"
      }
    >
      {readouts.map((r, i) => (
        <div key={r.id} title={r.description}>
          <dt className={size === "lg" ? "text-xs text-muted" : "text-muted"}>{r.label}</dt>
          <dd className={size === "lg" ? "text-2xl font-medium tabular-nums" : "tabular-nums"}>
            {values[i]} {r.unit && <span className="text-sm text-muted">{r.unit}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}
