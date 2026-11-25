import type { EquationDefinition } from "@orbital/core";
import { Equation } from "./Equation";
import { RichText } from "../components/RichText";

/** Equation with its name, purpose, variables, units, assumptions, validity and worked example. */
export function EquationCard({ equation }: { equation: EquationDefinition }) {
  const { workedExample: ex } = equation;
  return (
    <article
      id={`eq-${equation.id}`}
      className="space-y-3 rounded-lg border border-space-700 bg-space-900/60 p-5"
    >
      <h3 className="font-semibold text-slate-50">{equation.name}</h3>
      <div className="overflow-x-auto text-lg">
        <Equation latex={equation.latex} label={equation.name} />
      </div>
      <p className="text-sm text-slate-300">
        <RichText text={equation.description} />
      </p>
      {equation.variables.length > 0 && (
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Variables in {equation.name}</caption>
          <thead className="text-xs uppercase text-slate-500">
            <tr>
              <th className="py-1 pr-3">Symbol</th>
              <th className="py-1 pr-3">Quantity</th>
              <th className="py-1 pr-3">Unit</th>
              <th className="py-1">Meaning</th>
            </tr>
          </thead>
          <tbody>
            {equation.variables.map((v) => (
              <tr key={v.symbol} className="border-t border-space-700 align-top">
                <td className="py-1 pr-3">
                  <Equation latex={v.symbol} display={false} />
                </td>
                <td className="py-1 pr-3">{v.name}</td>
                <td className="py-1 pr-3 font-mono text-xs">{v.unit}</td>
                <td className="py-1 text-slate-400">{v.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {equation.intuition && (
        <p className="text-sm text-slate-400">
          <span className="font-semibold text-slate-300">Intuition: </span>
          <RichText text={equation.intuition} />
        </p>
      )}
      {equation.assumptions && equation.assumptions.length > 0 && (
        <div className="text-sm">
          <p className="font-semibold text-slate-300">Assumptions</p>
          <ul className="list-disc pl-5 text-slate-400">
            {equation.assumptions.map((a) => (
              <li key={a}>
                <RichText text={a} />
              </li>
            ))}
          </ul>
        </div>
      )}
      {equation.validity && (
        <p className="text-sm text-slate-400">
          <span className="font-semibold text-slate-300">Valid when: </span>
          <RichText text={equation.validity} />
        </p>
      )}
      {ex && (
        <details className="text-sm">
          <summary className="cursor-pointer font-semibold text-slate-300">Worked example</summary>
          <p className="mt-2 text-slate-400">
            <RichText text={ex.prompt} />
          </p>
          <div className="mt-2 space-y-1 overflow-x-auto">
            {ex.steps.map((s) => (
              <Equation key={s} latex={s} />
            ))}
          </div>
          <p className="mt-2 text-slate-200">
            <RichText text={ex.result} />
          </p>
        </details>
      )}
    </article>
  );
}
