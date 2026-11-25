"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { MissionDefinition } from "@edorbit/core";
import { RichText } from "../components/RichText";
import { SketchCheck } from "../sketch/SketchCheck";

type Panel = "hint" | "explain" | null;

function Reveal({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div className="pt-2">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Mission<Params>({ mission, done }: { mission: MissionDefinition<Params>; done: boolean }) {
  const [panel, setPanel] = useState<Panel>(null);
  const toggle = (p: Exclude<Panel, null>) => setPanel((cur) => (cur === p ? null : p));
  const btn = (p: Exclude<Panel, null>) =>
    `rounded-full border-2 px-3 py-0.5 text-sm transition ${panel === p ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]" : "border-[var(--ink)] hover:-translate-y-0.5"}`;
  return (
    <li className="flex gap-4">
      <SketchCheck done={done} />
      <div className="min-w-0 flex-1 space-y-2">
        <p className="text-lg font-medium">{mission.title}</p>
        <p className="text-muted">
          <RichText text={mission.goal} />
        </p>
        <Reveal show={done}>
          <p>
            <RichText text={mission.success} />
          </p>
        </Reveal>
        <div className="flex flex-wrap gap-2 pt-1">
          {!done && (
            <button
              type="button"
              aria-expanded={panel === "hint"}
              onClick={() => toggle("hint")}
              className={btn("hint")}
            >
              Hint
            </button>
          )}
          <button
            type="button"
            aria-expanded={panel === "explain"}
            onClick={() => toggle("explain")}
            className={btn("explain")}
          >
            Explain
          </button>
        </div>
        <Reveal show={panel === "hint" && !done}>
          <p className="text-muted">
            <RichText text={mission.hint} />
          </p>
        </Reveal>
        <Reveal show={panel === "explain"}>
          <p className="text-muted">
            <RichText text={mission.explain} />
          </p>
        </Reveal>
      </div>
    </li>
  );
}

/** Missions tick themselves off as soon as the current parameters satisfy their check. */
export function MissionList<Params>({
  missions,
  params,
}: {
  missions: readonly MissionDefinition<Params>[];
  params: Params;
}) {
  const done = missions.map((m) => m.check(params));
  const count = done.filter(Boolean).length;
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted" aria-live="polite">
        {count} of {missions.length} missions complete
      </p>
      <ul className="grid gap-8 md:grid-cols-2">
        {missions.map((m, i) => (
          <Mission key={m.id} mission={m} done={done[i] ?? false} />
        ))}
      </ul>
    </div>
  );
}
