"use client";

import { useMemo } from "react";
import { BufferGeometry, Float32BufferAttribute } from "three";

/**
 * Polylines laid flat on the ground plane (y = `height`), e.g. coastlines or
 * routes. Points are [x, z] in scene units; the caller does the projection.
 */
export function GroundLines({
  lines,
  color,
  opacity = 1,
  height = 0,
}: {
  lines: readonly (readonly (readonly [number, number])[])[];
  color: string;
  opacity?: number;
  height?: number;
}) {
  const geometry = useMemo(() => {
    const pts: number[] = [];
    for (const line of lines)
      for (let i = 1; i < line.length; i++) {
        const a = line[i - 1]!;
        const b = line[i]!;
        pts.push(a[0], height, a[1], b[0], height, b[1]);
      }
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(pts, 3));
    return g;
  }, [lines, height]);
  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </lineSegments>
  );
}
