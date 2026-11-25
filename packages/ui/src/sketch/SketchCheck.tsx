"use client";

import { motion } from "framer-motion";
import { SKETCH_STROKE } from "./stroke";

/** Hand-drawn tick that draws in when `done` becomes true; an empty sketchy box otherwise. */
export function SketchCheck({ done, size = 28 }: { done: boolean; size?: number }) {
  return (
    <svg
      viewBox="0 0 28 28"
      width={size}
      height={size}
      className="shrink-0 overflow-visible"
      aria-hidden="true"
    >
      <path
        d="M3.5 4.2 L24.3 3.6 L24.8 24.4 L3.9 24.9 Z"
        stroke="var(--ink)"
        strokeWidth={SKETCH_STROKE * 0.7}
        fill="none"
        strokeLinejoin="round"
      />
      <motion.path
        d="M7 15 C 9 17, 11 19, 12 21 C 15 14, 19 9, 27 2"
        stroke="var(--ink)"
        strokeWidth={SKETCH_STROKE}
        fill="none"
        strokeLinecap="round"
        initial={false}
        animate={{ pathLength: done ? 1 : 0, opacity: done ? 1 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
    </svg>
  );
}
