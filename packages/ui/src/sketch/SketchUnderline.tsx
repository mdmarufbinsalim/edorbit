"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { SKETCH_STROKE, seeded, smoothPath, type Point } from "./stroke";

/** Wavy hand-drawn underline that draws itself in when scrolled into view. */
export function SketchUnderline({
  className = "",
  width = 240,
  height = 16,
  delay = 0,
  seed = 1,
}: {
  className?: string;
  width?: number;
  height?: number;
  delay?: number;
  seed?: number;
}) {
  const d = useMemo(() => {
    const rand = seeded(seed + width);
    const periods = 2.25 + rand() * 0.5;
    const phase = rand() * Math.PI * 2;
    const pts: Point[] = Array.from({ length: 22 }, (_, i) => {
      const t = i / 21;
      return [
        2 + t * (width - 4),
        height / 2 +
          Math.sin(t * periods * Math.PI * 2 + phase) * height * 0.34 * Math.sin(t * Math.PI),
      ];
    });
    return smoothPath(pts);
  }, [width, height, seed]);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      style={{ maxWidth: "100%" }}
      className={className}
      aria-hidden="true"
    >
      <motion.path
        d={d}
        stroke="var(--ink)"
        strokeWidth={SKETCH_STROKE}
        fill="none"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.98, delay, ease: "easeInOut" }}
      />
    </svg>
  );
}
