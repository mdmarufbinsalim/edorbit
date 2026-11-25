"use client";

import { useEffect, useState } from "react";
import { formatSig, type ReadoutDefinition, type SimulationEngine } from "@orbital/core";

/**
 * Polls the engine at a modest rate so live values update without
 * re-rendering React on every animation frame.
 */
export function ReadoutPanel<State, Params>({
  engine,
  readouts,
  highlight = [],
  intervalMs = 150,
}: {
  engine: SimulationEngine<State, Params>;
  readouts: readonly ReadoutDefinition<State, Params>[];
  highlight?: readonly string[];
  intervalMs?: number;
}) {
  const compute = () => {
    const { state, time } = engine.snapshot();
    const params = engine.parameters;
    return {
      time,
      values: readouts.map((r) => {
        const v = r.value(state, params);
        return typeof v === "number" ? formatSig(v, 5) : v;
      }),
    };
  };
  const [data, setData] = useState(compute);

  useEffect(() => {
    const id = setInterval(() => setData(compute()), intervalMs);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engine, readouts, intervalMs]);

  return (
    <dl
      aria-label="Live readouts"
      aria-live="off"
      className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-xs"
    >
      <dt className="text-slate-500">Elapsed time</dt>
      <dd className="text-right text-slate-200">{formatSig(data.time / 60, 4)} min</dd>
      {readouts.map((r, i) => (
        <div
          key={r.id}
          className={`contents ${highlight.includes(r.id) ? "[&>*]:text-accent" : ""}`}
        >
          <dt className="text-slate-500" title={r.description}>
            {r.label}
          </dt>
          <dd className="text-right text-slate-200">
            {data.values[i]} {r.unit}
          </dd>
        </div>
      ))}
    </dl>
  );
}
