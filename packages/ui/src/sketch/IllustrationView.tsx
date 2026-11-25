"use client";

import { motion } from "framer-motion";
import type { Illustration } from "@orbital/core";
import { SKETCH_STROKE } from "./stroke";

/** Draws a data-only illustration stroke by stroke when it scrolls into view. */
export function IllustrationView({
  illustration,
  className = "",
  delay = 0,
  stagger = 0.08,
}: {
  illustration: Illustration;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  return (
    <svg
      viewBox={illustration.viewBox}
      className={className}
      role="img"
      aria-label={illustration.alt}
      fill="none"
    >
      {illustration.strokes.map((s, i) => (
        <motion.path
          key={i}
          d={s.d}
          stroke={s.faint ? "var(--muted)" : "var(--ink)"}
          strokeWidth={s.width ?? SKETCH_STROKE}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={s.dashed ? "1 7" : undefined}
          fill={s.fill ? "var(--paper)" : "none"}
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{
            pathLength: { duration: 0.9, delay: delay + i * stagger, ease: "easeInOut" },
            opacity: { duration: 0.2, delay: delay + i * stagger },
          }}
        />
      ))}
    </svg>
  );
}
