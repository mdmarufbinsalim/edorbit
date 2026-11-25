"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Quiz } from "@edorbit/core";
import { RichText } from "../components/RichText";
import { SketchCircle } from "../sketch/SketchCircle";

/** Quick multiple-choice check: pick an answer, the right one gets circled, then the why. */
export function QuizCard({ quiz }: { quiz: Quiz }) {
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;
  const right = picked === quiz.answerIndex;
  return (
    <div className="space-y-4">
      <p className="text-lg font-medium">
        <RichText text={quiz.question} />
      </p>
      <div className="flex flex-wrap gap-4" role="radiogroup">
        {quiz.choices.map((c, i) => (
          <button
            key={c}
            type="button"
            role="radio"
            aria-checked={picked === i}
            disabled={answered}
            onClick={() => setPicked(i)}
            className={`rounded-full border-2 px-5 py-2 text-lg transition ${answered ? (i === quiz.answerIndex ? "border-[var(--ink)]" : "border-dashed border-[var(--faint)] opacity-50") : "border-[var(--ink)] hover:-translate-y-0.5 hover:bg-[var(--ink)] hover:text-[var(--paper)]"} ${picked === i && !right ? "line-through" : ""}`}
          >
            <SketchCircle
              show={answered && i === quiz.answerIndex}
              paddingX={12}
              paddingY={6}
              seed={i + 4}
            >
              <RichText text={c} />
            </SketchCircle>
          </button>
        ))}
      </div>
      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <p className="font-medium">
              {right ? "Nailed it!" : "Not quite. The circled one is right."}
            </p>
            <p className="text-muted">
              <RichText text={quiz.why} />
            </p>
            <button
              type="button"
              onClick={() => setPicked(null)}
              className="text-sm underline decoration-2 underline-offset-4"
            >
              Try again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
