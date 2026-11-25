"use client";

import { useMemo, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useElementSize } from "./useElementSize";
import { SKETCH_STROKE, seeded, smoothPath, type Point } from "./stroke";

/** Loose hand-drawn ellipse around inline content. `show` lets callers draw it on demand. */
export function SketchCircle({
  children,
  className = "",
  paddingX = 14,
  paddingY = 10,
  delay = 0,
  seed = 3,
  show,
}: {
  children: ReactNode;
  className?: string;
  paddingX?: number;
  paddingY?: number;
  delay?: number;
  seed?: number;
  /** When provided, draws/undraws with this flag instead of on scroll. */
  show?: boolean;
}) {
  const { ref, size } = useElementSize<HTMLSpanElement>();
  const w = size.width + paddingX * 2;
  const h = (size.height + paddingY * 2) * 1.1;
  const d = useMemo(() => {
    if (size.width < 4) return "";
    const rand = seeded(seed);
    const pts: Point[] = Array.from({ length: 16 }, (_, i) => {
      const j = 0.985 + rand() * 0.03;
      const a = (i / 16) * Math.PI * 2 - Math.PI / 2;
      return [w / 2 + Math.cos(a) * (w / 2) * j, h / 2 + Math.sin(a) * (h / 2) * j];
    });
    return smoothPath(pts, true);
  }, [size.width, w, h, seed]);

  const drawn = { pathLength: 1, opacity: 1 };
  const hidden = { pathLength: 0, opacity: 0 };
  return (
    <span className={`relative inline-block ${className}`}>
      <svg
        className="pointer-events-none absolute overflow-visible"
        style={{ left: -paddingX, top: -paddingY * 1.1, width: w, height: h }}
        aria-hidden="true"
      >
        {d && (
          <motion.path
            d={d}
            stroke="var(--ink)"
            strokeWidth={SKETCH_STROKE}
            fill="none"
            initial={hidden}
            {...(show === undefined
              ? { whileInView: drawn, viewport: { once: true, margin: "-40px" } }
              : { animate: show ? drawn : hidden })}
            transition={{ duration: show === undefined ? 0.98 : 0.5, delay, ease: "easeInOut" }}
          />
        )}
      </svg>
      <span ref={ref} className="relative">
        {children}
      </span>
    </span>
  );
}
