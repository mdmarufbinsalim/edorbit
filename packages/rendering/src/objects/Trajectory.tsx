"use client";

import { Line } from "@react-three/drei";

/** Static polyline for a predicted path. Points are in scene units. */
export function Trajectory({
  points,
  color = "#4cc9f0",
  dashed = false,
  opacity = 0.8,
}: {
  points: readonly (readonly [number, number, number])[];
  color?: string;
  dashed?: boolean;
  opacity?: number;
}) {
  if (points.length < 2) return null;
  return (
    <Line
      points={points as [number, number, number][]}
      color={color}
      lineWidth={1.5}
      dashed={dashed}
      dashSize={0.3}
      gapSize={0.2}
      transparent
      opacity={opacity}
    />
  );
}
