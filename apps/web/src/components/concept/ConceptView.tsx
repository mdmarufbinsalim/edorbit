"use client";

import { Suspense, useState } from "react";
import { useStore } from "zustand";
import { conceptRegistry, type AnyConceptModule } from "@orbital/concepts";
import type { ExperimentDefinition } from "@orbital/core";
import {
  Calculator,
  EquationCard,
  Equation,
  ExperimentPanel,
  LayerToggles,
  LimitationCallout,
  ParameterSlider,
  ReadoutPanel,
  RichText,
  Section,
  SectionNav,
  SimulationToolbar,
  createSimulationController,
} from "@orbital/ui";

const NAV = [
  { id: "introduction", label: "Introduction" },
  { id: "explanation", label: "Explanation" },
  { id: "mathematics", label: "Mathematics" },
  { id: "simulation", label: "Simulation" },
  { id: "experiments", label: "Experiments" },
  { id: "references", label: "References" },
];

/**
 * Generic learning page. Renders any ConceptModule; contains no concept-specific logic.
 * The client looks the module up by slug because modules contain functions and components.
 */
export function ConceptView({ slug }: { slug: string }) {
  const conceptModule = conceptRegistry.get(slug)?.module;
  if (!conceptModule) return null;
  return <ConceptLearningPage module={conceptModule} />;
}

function ConceptLearningPage({ module }: { module: AnyConceptModule }) {
  const {
    metadata,
    lesson,
    equations,
    calculators = [],
    simulation,
    experiments,
    references,
    Scene,
  } = module;
  const [{ engine, store }] = useState(() => createSimulationController(simulation));
  const params = useStore(store, (s) => s.params);
  const layers = useStore(store, (s) => s.layers);
  const playing = useStore(store, (s) => s.playing);
  const timeScale = useStore(store, (s) => s.timeScale);
  const actions = store.getState();
  const [activeExperiment, setActiveExperiment] = useState<ExperimentDefinition | null>(null);

  const runExperiment = (ex: ExperimentDefinition) => {
    actions.pause();
    actions.setParams(ex.setup);
    actions.play();
    setActiveExperiment(ex);
    document.getElementById("simulation")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="space-y-16">
      <header className="space-y-4">
        <p className="font-mono text-xs uppercase tracking-widest text-accent-muted">
          {metadata.category} · {metadata.difficulty} · {metadata.estimatedMinutes} min
        </p>
        <h1 className="text-4xl font-semibold text-slate-50">{metadata.title}</h1>
        <p className="text-lg text-slate-300">{metadata.question}</p>
        <SectionNav items={NAV} />
      </header>

      <Section id="introduction" title="Introduction">
        <p className="text-slate-300">
          <RichText text={lesson.introduction} />
        </p>
        <p className="text-slate-300">
          <span className="font-semibold text-slate-100">Why it matters. </span>
          <RichText text={lesson.whyItMatters} />
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-semibold text-slate-100">Real-world examples</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-400">
              {lesson.realWorldExamples.map((x) => (
                <li key={x}>
                  <RichText text={x} />
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-100">You will learn to</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-400">
              {lesson.learningObjectives.map((x) => (
                <li key={x}>
                  <RichText text={x} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section id="explanation" title="Scientific explanation">
        {lesson.sections.map((s) => (
          <div key={s.id} id={s.id} className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-100">{s.heading}</h3>
            {s.body.map((para) => (
              <p key={para} className="text-slate-300">
                <RichText text={para} />
              </p>
            ))}
            {s.equationIds?.map((id) => {
              const eq = equations.find((e) => e.id === id);
              return eq ? (
                <a
                  key={id}
                  href={`#eq-${id}`}
                  className="block overflow-x-auto text-slate-200 hover:text-accent"
                >
                  <Equation latex={eq.latex} label={eq.name} />
                </a>
              ) : null;
            })}
          </div>
        ))}
      </Section>

      <Section id="mathematics" title="Mathematical foundation">
        <div className="grid gap-4 lg:grid-cols-2">
          {equations.map((eq) => (
            <div key={eq.id} className="space-y-4">
              <EquationCard equation={eq} />
              {calculators
                .filter((c) => c.equationId === eq.id)
                .map((c) => (
                  <Calculator key={c.id} calculator={c} />
                ))}
            </div>
          ))}
        </div>
      </Section>

      <Section id="simulation" title="Interactive simulation">
        <LimitationCallout items={lesson.limitations} />
        <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
          <div className="relative h-[60vh] min-h-[360px] overflow-hidden rounded-lg border border-space-700">
            <Suspense fallback={<p className="p-6 text-sm text-slate-500">Loading 3D scene…</p>}>
              <Scene engine={engine} params={params} layers={layers} />
            </Suspense>
          </div>
          <div className="space-y-5 rounded-lg border border-space-700 bg-space-900/60 p-4">
            <SimulationToolbar
              playing={playing}
              timeScale={timeScale}
              timeScales={simulation.timeScales}
              onPlay={actions.play}
              onPause={actions.pause}
              onReset={actions.reset}
              onStep={() => actions.step()}
              onTimeScale={actions.setTimeScale}
            />
            <div className="space-y-3">
              {simulation.parameterDefinitions.map((p) => (
                <ParameterSlider
                  key={p.key}
                  label={p.label}
                  unit={p.unit}
                  value={params[p.key]}
                  min={p.min}
                  max={p.max}
                  step={p.step}
                  displayScale={p.displayScale ?? 1}
                  {...(p.description ? { description: p.description } : {})}
                  onChange={(v) => actions.setParams({ [p.key]: v })}
                />
              ))}
              {simulation.derivedControls?.map((c) => (
                <ParameterSlider
                  key={c.id}
                  label={c.label}
                  unit={c.unit}
                  value={c.get(params)}
                  min={c.min}
                  max={c.max}
                  step={c.step}
                  {...(c.description ? { description: c.description } : {})}
                  onChange={(v) => actions.setParams(c.set(v, params))}
                />
              ))}
              <button
                type="button"
                onClick={actions.resetParams}
                className="text-xs text-slate-400 underline hover:text-accent"
              >
                Restore default parameters
              </button>
            </div>
            <LayerToggles
              layers={simulation.visualLayers}
              values={layers}
              onChange={actions.setLayer}
            />
            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-300">Live readouts</h3>
              <ReadoutPanel
                engine={engine}
                readouts={simulation.readouts}
                highlight={activeExperiment?.watch ?? []}
              />
            </div>
          </div>
        </div>
      </Section>

      <Section id="experiments" title="Guided experiments">
        <ExperimentPanel
          experiments={experiments}
          onRun={runExperiment}
          activeId={activeExperiment?.id ?? null}
        />
      </Section>

      <Section id="references" title="Further reading and references">
        <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-400">
          {references.map((r) => (
            <li key={r.title}>
              {r.authors && <>{r.authors}, </>}
              {r.url ? (
                <a
                  href={r.url}
                  className="text-accent hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  <em>{r.title}</em>
                </a>
              ) : (
                <em>{r.title}</em>
              )}
              . {r.source}
              {r.year && <>, {r.year}</>}.
            </li>
          ))}
        </ol>
      </Section>
    </div>
  );
}
