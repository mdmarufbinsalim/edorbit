import { SKETCH_STROKE } from "./stroke";

/** A clean ink-outlined planet for 2D widgets. Geometric, never wobbly. */
export function SketchPlanet({
  cx = 0,
  cy = 0,
  r,
  fill = "var(--paper)",
  label,
}: {
  cx?: number;
  cy?: number;
  r: number;
  fill?: string;
  label?: string;
}) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={fill} stroke="var(--ink)" strokeWidth={SKETCH_STROKE} />
      {label && (
        <text x={cx} y={cy + 5} textAnchor="middle" fontSize={14} fill="var(--ink)">
          {label}
        </text>
      )}
    </g>
  );
}
