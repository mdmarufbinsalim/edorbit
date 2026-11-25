import type { EquationDefinition } from "@edorbit/core";
import { Equation } from "./Equation";
import { RichText } from "../components/RichText";

/** Compact equation reference for the "for the curious" section. */
export function EquationCard({ equation }: { equation: EquationDefinition }) {
  return (
    <article
      id={`eq-${equation.id}`}
      className="space-y-3 border-t border-neutral-200 pt-5 dark:border-white/10"
    >
      <h4 className="font-medium">{equation.name}</h4>
      <div className="overflow-x-auto text-xl">
        <Equation latex={equation.latex} label={equation.name} />
      </div>
      <p className="text-muted">
        <RichText text={equation.description} />
      </p>
      {equation.variables.length > 0 && (
        <ul className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
          {equation.variables.map((v) => (
            <li key={v.symbol}>
              <Equation latex={v.symbol} display={false} />{" "}
              <span className="text-muted">{v.name}</span>
              {v.unit !== "—" && <span className="text-faint"> ({v.unit})</span>}
            </li>
          ))}
        </ul>
      )}
      {equation.assumptions && equation.assumptions.length > 0 && (
        <p className="text-sm text-muted">
          <span className="font-medium text-[var(--ink)]">Assumes: </span>
          {equation.assumptions.join(" ")}
        </p>
      )}
      {equation.workedExample && (
        <details className="text-sm">
          <summary className="cursor-pointer underline decoration-dotted underline-offset-4">
            Worked example
          </summary>
          <p className="mt-2 text-muted">
            <RichText text={equation.workedExample.prompt} />
          </p>
          <div className="overflow-x-auto">
            {equation.workedExample.steps.map((s) => (
              <Equation key={s} latex={s} />
            ))}
          </div>
          <p>
            <RichText text={equation.workedExample.result} />
          </p>
        </details>
      )}
    </article>
  );
}
