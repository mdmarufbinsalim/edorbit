"use client";

import type { ReactNode } from "react";

/** Small sphere marking a point (orbiter, apsis). Size is visual only, not to scale. */
export function Marker({
  position = [0, 0, 0],
  size = 0.12,
  color = "#ffffff",
  children,
}: {
  position?: [number, number, number];
  size?: number;
  color?: string;
  children?: ReactNode;
}) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[size, 16, 8]} />
      <meshBasicMaterial color={color} />
      {children}
    </mesh>
  );
}
