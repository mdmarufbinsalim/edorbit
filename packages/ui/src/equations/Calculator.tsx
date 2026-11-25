"use client";

import { useId, useState } from "react";
import { formatSig, type CalculatorDefinition } from "@orbital/core";

/** Live calculator: editing any input recomputes every output. */
export function Calculator({ calculator }: { calculator: CalculatorDefinition }) {
  const baseId = useId();
  const [values, setValues] = useState<Record<string, number>>(() =>
    Object.fromEntries(calculator.inputs.map((i) => [i.key, i.defaultValue])),
  );

  return (
    <form
      aria-label={calculator.title}
      onSubmit={(e) => e.preventDefault()}
      className="space-y-3 rounded-lg border border-accent/30 bg-space-900/60 p-5"
    >
      <h3 className="font-semibold text-accent">{calculator.title}</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {calculator.inputs.map((input) => (
          <label key={input.key} htmlFor={`${baseId}-${input.key}`} className="text-sm">
            <span className="block text-slate-400">
              {input.label} ({input.unit})
            </span>
            <input
              id={`${baseId}-${input.key}`}
              type="number"
              value={values[input.key]}
              min={input.min}
              max={input.max}
              step={input.step ?? "any"}
              onChange={(e) => setValues((v) => ({ ...v, [input.key]: e.target.valueAsNumber }))}
              className="mt-1 w-full rounded border border-space-700 bg-space-950 px-2 py-1 font-mono"
            />
          </label>
        ))}
      </div>
      <output
        htmlFor={calculator.inputs.map((i) => `${baseId}-${i.key}`).join(" ")}
        className="block space-y-1"
      >
        {calculator.outputs.map((out) => {
          let result: string;
          try {
            const r = out.compute(values);
            result = Number.isNaN(r) ? "—" : formatSig(r, 5);
          } catch (err) {
            result = err instanceof Error ? err.message : "—";
          }
          return (
            <p key={out.label} className="font-mono text-sm">
              <span className="text-slate-400">{out.label} = </span>
              <span className="text-slate-50">{result}</span>{" "}
              <span className="text-slate-500">{out.unit}</span>
            </p>
          );
        })}
      </output>
    </form>
  );
}
