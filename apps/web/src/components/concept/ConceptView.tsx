"use client";

import { Suspense, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useStore } from "zustand";
import Link from "next/link";
import { conceptRegistry, tagById, type AnyConceptModule } from "@edorbit/concepts";
import { tagHref } from "@/components/discovery/tag-links";
import type { StoryChapter } from "@edorbit/core";
import {
  EquationCard,
  Expandable,
  FormulaPlayground,
  LayerToggles,
  MissionList,
  ParameterSlider,
  QuizCard,
  ReadoutPanel,
  RichText,
  SimulationToolbar,
  SketchBox,
  SketchUnderline,
  tagChipClass,
  createSimulationController,
} from "@edorbit/ui";

/**
 * Generic learning page: hook → story → formula → playground → missions → nerd corner.
 * Renders any ConceptModule and contains no concept-specific logic.
 */
export function ConceptView({ slug }: { slug: string }) {
  const conceptModule = conceptRegistry.get(slug)?.module;
  if (!conceptModule) return null;
  return <ConceptPage concept={conceptModule} />;
}

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionTitle({
  kicker,
  children,
  id,
}: {
  kicker: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <div id={id} className="mb-10 scroll-mt-24">
      <p className="mb-2 text-sm tracking-wide text-muted">{kicker}</p>
      <h2 className="text-3xl leading-tight font-medium sm:text-4xl">{children}</h2>
    </div>
  );
}

function Chapter({
  chapter,
  index,
  concept,
}: {
  chapter: StoryChapter;
  index: number;
  concept: AnyConceptModule;
}) {
  const Widget = chapter.widget ? concept.widgets?.[chapter.widget] : undefined;
  return (
    <Reveal className="space-y-8">
      <div className="grid gap-4 md:grid-cols-[80px_minmax(0,1fr)]">
        <p className="text-5xl font-medium text-faint tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </p>
        <div className="max-w-2xl space-y-3">
          <h3 className="text-2xl leading-snug font-medium sm:text-3xl">{chapter.title}</h3>
          {chapter.body.map((p) => (
            <p key={p} className="text-lg leading-relaxed text-muted">
              <RichText text={p} />
            </p>
          ))}
        </div>
      </div>
      {Widget && (
        <SketchBox className="p-5 sm:p-8" padding={4} seed={index + 20}>
          <Suspense fallback={<p className="text-muted">Loading…</p>}>
            <Widget />
          </Suspense>
        </SketchBox>
      )}
      {chapter.quiz && (
        <div className="md:pl-[96px]">
          <QuizCard quiz={chapter.quiz} />
        </div>
      )}
    </Reveal>
  );
}

function ConceptPage({ concept }: { concept: AnyConceptModule }) {
  const {
    metadata,
    lesson,
    equations,
    calculators = [],
    formula,
    simulation,
    missions,
    references,
    Scene,
  } = concept;
  const [{ engine, store }] = useState(() => createSimulationController(simulation));
  const params = useStore(store, (s) => s.params);
  const layers = useStore(store, (s) => s.layers);
  const playing = useStore(store, (s) => s.playing);
  const timeScale = useStore(store, (s) => s.timeScale);
  const actions = store.getState();

  const basicReadouts = simulation.readouts.filter((r) => r.basic);
  const nerdReadouts = simulation.readouts.filter((r) => !r.basic);
  const basicParams = simulation.parameterDefinitions.filter((p) => !p.advanced);
  const advancedParams = simulation.parameterDefinitions.filter((p) => p.advanced);
  const featuredEq = formula && equations.find((e) => e.id === formula.equationId);
  const featuredCalc = formula && calculators.find((c) => c.id === formula.calculatorId);

  const slider = (p: (typeof simulation.parameterDefinitions)[number]) => (
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
  );

  return (
    <article className="space-y-28 pb-28">
      <header className="pt-16 sm:pt-24">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-4 text-sm tracking-wide text-muted"
        >
          {metadata.estimatedMinutes} min · {metadata.difficulty}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.84, delay: 0.2 }}
          className="max-w-4xl text-4xl leading-tight font-medium sm:text-6xl"
        >
          <span className="relative inline-block">
            {metadata.title}
            <SketchUnderline
              className="absolute -bottom-3 left-0"
              width={320}
              height={18}
              delay={0.9}
            />
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-10 max-w-2xl text-xl text-muted"
        >
          {metadata.hook ?? metadata.question}
        </motion.p>
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 flex flex-wrap gap-2"
          aria-label="Tags"
        >
          {metadata.tags.map((id) => {
            const tag = tagById.get(id);
            return tag ? (
              <li key={id}>
                <Link href={tagHref([id])} className={tagChipClass()}>
                  {tag.label}
                </Link>
              </li>
            ) : null;
          })}
        </motion.ul>
        <motion.a
          href="#story"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 inline-block text-lg underline decoration-2 underline-offset-4"
        >
          Let&apos;s find out ↓
        </motion.a>
      </header>

      <section aria-label="Story" className="space-y-24">
        <div id="story" className="scroll-mt-24" />
        {lesson.story.map((ch, i) => (
          <Chapter key={ch.id} chapter={ch} index={i} concept={concept} />
        ))}
      </section>

      {formula && featuredEq && featuredCalc && (
        <section aria-labelledby="formula">
          <Reveal>
            <SectionTitle kicker="The secret formula" id="formula">
              {featuredEq.name}, in plain words
            </SectionTitle>
            <FormulaPlayground formula={formula} equation={featuredEq} calculator={featuredCalc} />
          </Reveal>
        </section>
      )}

      <section aria-labelledby="playground">
        <Reveal>
          <SectionTitle kicker="Your turn" id="playground">
            Launch something
          </SectionTitle>
        </Reveal>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <SketchBox
            className="h-[60vh] min-h-[380px]"
            innerClassName="h-full"
            padding={4}
            seed={41}
          >
            <div className="absolute inset-[6px] overflow-hidden">
              <Suspense fallback={<p className="p-6 text-muted">Loading 3D…</p>}>
                <Scene engine={engine} params={params} layers={layers} />
              </Suspense>
            </div>
            <p className="pointer-events-none absolute bottom-3 left-4 text-xs text-muted">
              Drag to spin · scroll to zoom
            </p>
          </SketchBox>
          <div className="space-y-7">
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
            <div className="space-y-5">{basicParams.map(slider)}</div>
            <ReadoutPanel engine={engine} readouts={basicReadouts} />
            <LayerToggles
              layers={simulation.visualLayers}
              values={layers}
              onChange={actions.setLayer}
            />
            <Expandable title="Nerd stats & extra controls">
              <div className="space-y-5">
                {advancedParams.map(slider)}
                {simulation.derivedControls
                  ?.filter((c) => c.advanced)
                  .map((c) => (
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
                <ReadoutPanel engine={engine} readouts={nerdReadouts} size="sm" />
                <button
                  type="button"
                  onClick={actions.resetParams}
                  className="text-sm underline decoration-2 underline-offset-4"
                >
                  Back to the start
                </button>
              </div>
            </Expandable>
          </div>
        </div>

        {missions.length > 0 && (
          <Reveal className="mt-16">
            <h3 className="mb-6 text-2xl font-medium">Missions</h3>
            <MissionList missions={missions} params={params} />
          </Reveal>
        )}
      </section>

      <section
        aria-label="For the curious"
        className="max-w-3xl border-t border-neutral-200 pt-10 dark:border-white/10"
      >
        <p className="mb-4 text-sm text-muted">For the curious</p>
        <Expandable title="All the maths">
          <div className="space-y-6">
            {equations.map((eq) => (
              <EquationCard key={eq.id} equation={eq} />
            ))}
          </div>
        </Expandable>
        <Expandable title="What this simulation leaves out">
          <ul className="list-disc space-y-2 pl-5 text-muted">
            {lesson.limitations.map((l) => (
              <li key={l}>
                <RichText text={l} />
              </li>
            ))}
          </ul>
        </Expandable>
        <Expandable title="Where this comes from">
          <ol className="list-decimal space-y-1 pl-5 text-sm text-muted">
            {references.map((r) => (
              <li key={r.title}>
                {r.authors && <>{r.authors}, </>}
                {r.url ? (
                  <a
                    href={r.url}
                    className="underline decoration-2 underline-offset-2"
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
        </Expandable>
      </section>
    </article>
  );
}
