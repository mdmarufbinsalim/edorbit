"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  formatSig,
  type CalculatorDefinition,
  type FeaturedFormula,
  type EquationDefinition,
} from "@edorbit/core";
import { Equation } from "../equations/Equation";
import { RichText } from "../components/RichText";
import { SketchCircle } from "../sketch/SketchCircle";
import { ParameterSlider } from "../controls/ParameterSlider";

/** The featured equation: tap a symbol to learn what it means, drag the sliders to play with it. */
export function FormulaPlayground({
  formula,
  equation,
  calculator,
}: {
  formula: FeaturedFormula;
  equation: EquationDefinition;
  calculator: CalculatorDefinition;
}) {
  const [active, setActive] = useState(0);
  const [values, setValues] = useState<Record<string, number>>(() =>
    Object.fromEntries(calculator.inputs.map((i) => [i.key, i.defaultValue])),
  );
  const sym = formula.symbols[active];

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
      <div className="space-y-6">
        <div className="overflow-x-auto py-2 text-3xl sm:text-4xl">
          <Equation latex={equation.latex} label={equation.name} />
        </div>
        <p className="text-lg text-muted">{formula.tagline}</p>
        <div>
          <p className="mb-3 text-sm text-muted">Tap a letter to see what it means</p>
          <div className="flex flex-wrap gap-6">
            {formula.symbols.map((s, i) => (
              <button
                key={s.symbol}
                type="button"
                aria-pressed={i === active}
                onClick={() => setActive(i)}
                className="text-2xl"
              >
                <SketchCircle show={i === active} paddingX={12} paddingY={8} seed={i + 9}>
                  <Equation latex={s.symbol} display={false} />
                </SketchCircle>
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            {sym && (
              <motion.p
                key={sym.symbol}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="mt-4 min-h-12 text-lg"
              >
                <Equation latex={sym.symbol} display={false} /> = <RichText text={sym.plain} />
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      <form
        aria-label={calculator.title}
        onSubmit={(e) => e.preventDefault()}
        className="space-y-6"
      >
        {calculator.inputs.map((input) => (
          <ParameterSlider
            key={input.key}
            label={input.label}
            unit={input.unit}
            value={values[input.key] ?? input.defaultValue}
            min={input.min ?? 0}
            max={input.max ?? input.defaultValue * 10}
            step={input.step ?? 1}
            onChange={(v) => setValues((old) => ({ ...old, [input.key]: v }))}
          />
        ))}
        <output className="block space-y-3">
          {calculator.outputs.map((out) => {
            let value: number | null = null;
            try {
              value = out.compute(values);
            } catch {
              value = null;
            }
            return (
              <div key={out.label}>
                <p className="text-sm text-muted">{out.label}</p>
                <p className="text-4xl font-medium tabular-nums">
                  {value === null || Number.isNaN(value) ? "—" : formatSig(value, 3)}{" "}
                  <span className="text-lg text-muted">{out.unit}</span>
                </p>
                {value !== null && out.say && <p className="mt-1 text-muted">{out.say(value)}</p>}
              </div>
            );
          })}
        </output>
      </form>
    </div>
  );
}
