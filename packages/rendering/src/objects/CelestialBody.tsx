"use client";

import type { ReactNode } from "react";

export interface CelestialBodyProps {
  /** Radius in scene units. */
  radius: number;
  color: string;
  emissive?: string;
  position?: [number, number, number];
  segments?: number;
  children?: ReactNode;
}

/** Shaded sphere for planets and moons. Textures can be added later without changing callers. */
export function CelestialBody({
  radius,
  color,
  emissive = "#000000",
  position = [0, 0, 0],
  segments = 64,
  children,
}: CelestialBodyProps) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[radius, segments, segments / 2]} />
      <meshStandardMaterial color={color} emissive={emissive} roughness={0.9} metalness={0} />
      {children}
    </mesh>
  );
}
