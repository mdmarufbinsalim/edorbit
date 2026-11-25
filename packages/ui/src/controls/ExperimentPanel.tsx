"use client";

import { useState } from "react";
import type { ExperimentDefinition } from "@orbital/core";
import { RichText } from "../components/RichText";

type Phase = "predict" | "running";

/** Guided experiment flow: read the question → predict → run → compare. */
export function ExperimentPanel<Params>({
  experiments,
  onRun,
  activeId,
}: {
  experiments: readonly ExperimentDefinition<Params>[];
  onRun: (experiment: ExperimentDefinition<Params>) => void;
  activeId?: string | null;
}) {
  const [selected, setSelected] = useState(experiments[0]?.id ?? "");
  const [phase, setPhase] = useState<Phase>("predict");
  const [choice, setChoice] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const ex = experiments.find((e) => e.id === selected);
  if (!ex) return null;

  const select = (id: string) => {
    setSelected(id);
    setPhase("predict");
    setChoice(null);
    setNote("");
  };

  return (
    <div className="space-y-4">
      <div role="tablist" aria-label="Experiments" className="flex flex-wrap gap-2">
        {experiments.map((e) => (
          <button
            key={e.id}
            role="tab"
            type="button"
            aria-selected={e.id === selected}
            onClick={() => select(e.id)}
            className={`rounded border px-3 py-1 text-sm ${e.id === selected ? "border-accent text-accent" : "border-space-700 text-slate-300"}`}
          >
            {e.title}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        className="space-y-3 rounded-lg border border-space-700 bg-space-900/60 p-5"
      >
        <p className="text-slate-100">
          <RichText text={ex.question} />
        </p>
        <p className="text-sm text-slate-400">
          <RichText text={ex.predictionPrompt} />
        </p>
        {ex.choices ? (
          <fieldset className="space-y-1" disabled={phase === "running"}>
            <legend className="sr-only">Your prediction</legend>
            {ex.choices.map((c, i) => (
              <label key={c} className="flex items-center gap-2 text-sm text-slate-300">
                <input
                  type="radio"
                  name={`pred-${ex.id}`}
                  checked={choice === i}
                  onChange={() => setChoice(i)}
                />
                <RichText text={c} />
              </label>
            ))}
          </fieldset>
        ) : (
          <textarea
            aria-label="Your prediction"
            value={note}
            disabled={phase === "running"}
            onChange={(e) => setNote(e.target.value)}
            className="w-full rounded border border-space-700 bg-space-950 p-2 text-sm"
            rows={2}
          />
        )}
        <button
          type="button"
          onClick={() => {
            onRun(ex);
            setPhase("running");
          }}
          className="rounded border border-accent px-3 py-1 text-sm text-accent hover:bg-accent/10"
        >
          {phase === "running" && activeId === ex.id ? "Run again" : "Run experiment"}
        </button>
        {phase === "running" && (
          <div className="space-y-2 border-t border-space-700 pt-3 text-sm">
            {ex.choices && choice !== null && ex.answerIndex !== undefined && (
              <p className={choice === ex.answerIndex ? "text-emerald-400" : "text-amber-300"}>
                {choice === ex.answerIndex
                  ? "Your prediction matches the model."
                  : "The model disagrees with your prediction."}{" "}
                Expected: <RichText text={ex.choices[ex.answerIndex] ?? ""} />
              </p>
            )}
            {!ex.choices && note && <p className="text-slate-400">Your prediction: {note}</p>}
            <p className="text-slate-300">
              <RichText text={ex.explanation} />
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
