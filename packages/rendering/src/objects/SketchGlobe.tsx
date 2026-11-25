"use client";

import { useMemo } from "react";
import { BufferGeometry, Float32BufferAttribute } from "three";

/** Paper-white sphere with ink latitude/longitude lines, matching the 2D sketch style. */
export function SketchGlobe({
  radius,
  ink,
  paper,
  lines = 8,
}: {
  radius: number;
  ink: string;
  paper: string;
  lines?: number;
}) {
  const grid = useMemo(() => {
    const pts: number[] = [];
    const seg = 96;
    const r = radius * 1.002;
    for (let i = 1; i < lines; i++) {
      const lat = -Math.PI / 2 + (i * Math.PI) / lines;
      for (let j = 0; j < seg; j++) {
        const a0 = (j / seg) * 2 * Math.PI,
          a1 = ((j + 1) / seg) * 2 * Math.PI;
        pts.push(
          r * Math.cos(lat) * Math.cos(a0),
          r * Math.sin(lat),
          r * Math.cos(lat) * Math.sin(a0),
        );
        pts.push(
          r * Math.cos(lat) * Math.cos(a1),
          r * Math.sin(lat),
          r * Math.cos(lat) * Math.sin(a1),
        );
      }
    }
    for (let i = 0; i < lines; i++) {
      const lon = (i * Math.PI) / lines;
      for (let j = 0; j < seg; j++) {
        const t0 = (j / seg) * 2 * Math.PI,
          t1 = ((j + 1) / seg) * 2 * Math.PI;
        pts.push(
          r * Math.cos(t0) * Math.cos(lon),
          r * Math.sin(t0),
          r * Math.cos(t0) * Math.sin(lon),
        );
        pts.push(
          r * Math.cos(t1) * Math.cos(lon),
          r * Math.sin(t1),
          r * Math.cos(t1) * Math.sin(lon),
        );
      }
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(pts, 3));
    return g;
  }, [radius, lines]);

  return (
    <group>
      <mesh>
        <sphereGeometry args={[radius, 48, 24]} />
        <meshBasicMaterial
          color={paper}
          polygonOffset
          polygonOffsetFactor={1}
          polygonOffsetUnits={1}
        />
      </mesh>
      <lineSegments geometry={grid}>
        <lineBasicMaterial color={ink} transparent opacity={0.55} />
      </lineSegments>
    </group>
  );
}
