import { useMemo } from "react";
import { SKETCH_STROKE, seeded, smoothPath, type Point } from "./stroke";

/** A hand-drawn planet outline (slightly wobbly circle) for 2D widgets. */
export function SketchPlanet({
  cx = 0,
  cy = 0,
  r,
  seed = 11,
  fill = "var(--paper)",
  label,
}: {
  cx?: number;
  cy?: number;
  r: number;
  seed?: number;
  fill?: string;
  label?: string;
}) {
  const d = useMemo(() => {
    const rand = seeded(seed);
    const pts: Point[] = Array.from({ length: 20 }, (_, i) => {
      const a = (i / 20) * Math.PI * 2;
      const j = 1 + (rand() - 0.5) * 0.035;
      return [cx + Math.cos(a) * r * j, cy + Math.sin(a) * r * j];
    });
    return smoothPath(pts, true);
  }, [cx, cy, r, seed]);
  return (
    <g>
      <path d={d} fill={fill} stroke="var(--ink)" strokeWidth={SKETCH_STROKE} />
      {label && (
        <text x={cx} y={cy + 5} textAnchor="middle" fontSize={14} fill="var(--ink)">
          {label}
        </text>
      )}
    </g>
  );
}
