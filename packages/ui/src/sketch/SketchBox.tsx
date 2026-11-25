"use client";

import { useMemo, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useElementSize } from "./useElementSize";
import { SKETCH_STROKE, seeded } from "./stroke";

/** Box with slightly wobbly hand-drawn corners that draws itself in. */
export function SketchBox({
  children,
  className = "",
  padding = 3,
  seed = 7,
  dashed = false,
}: {
  children: ReactNode;
  className?: string;
  padding?: number;
  seed?: number;
  dashed?: boolean;
}) {
  const { ref, size } = useElementSize<HTMLDivElement>();
  const d = useMemo(() => {
    if (size.width < 4 || size.height < 4) return "";
    const rand = seeded(seed);
    const j = () => (rand() - 0.5) * 3;
    const x0 = padding,
      y0 = padding,
      x1 = size.width - padding,
      y1 = size.height - padding;
    return `M ${x0 + j()} ${y0 + j()} L ${x1 + j()} ${y0 + j()} L ${x1 + j()} ${y1 + j()} L ${x0 + j()} ${y1 + j()} Z`;
  }, [size, padding, seed]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        aria-hidden="true"
      >
        {d && (
          <motion.path
            d={d}
            stroke="var(--ink)"
            strokeWidth={SKETCH_STROKE}
            strokeDasharray={dashed ? "6 8" : undefined}
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 1.12, ease: "easeInOut" }}
          />
        )}
      </svg>
      <div className="relative">{children}</div>
    </div>
  );
}
