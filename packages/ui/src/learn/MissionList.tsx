"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { MissionDefinition } from "@orbital/core";
import { RichText } from "../components/RichText";
import { SketchCheck } from "../sketch/SketchCheck";

/** Missions tick themselves off as soon as the current parameters satisfy their physics check. */
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
    <div className="space-y-5">
      <p className="text-sm text-muted" aria-live="polite">
        {count} of {missions.length} missions complete
      </p>
      <ul className="space-y-5">
        {missions.map((m, i) => (
          <li key={m.id} className="flex gap-4">
            <SketchCheck done={done[i] ?? false} />
            <div className="space-y-1">
              <p className="text-lg font-medium">{m.title}</p>
              <p className="text-muted">
                <RichText text={m.goal} />
              </p>
              <AnimatePresence initial={false}>
                {done[i] ? (
                  <motion.p
                    key="win"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <RichText text={m.success} />
                  </motion.p>
                ) : (
                  <details className="text-sm text-muted">
                    <summary className="cursor-pointer underline decoration-dotted underline-offset-4">
                      Need a hint?
                    </summary>
                    <p className="mt-1">
                      <RichText text={m.hint} />
                    </p>
                  </details>
                )}
              </AnimatePresence>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
