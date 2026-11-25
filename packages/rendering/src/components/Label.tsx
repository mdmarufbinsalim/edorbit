"use client";

import { Html } from "@react-three/drei";
import type { ReactNode } from "react";

/** Screen-space text annotation anchored to a 3D position. */
export function Label({
  children,
  position = [0, 0, 0],
  offsetY = 0.3,
}: {
  children: ReactNode;
  position?: [number, number, number];
  offsetY?: number;
}) {
  return (
    <Html
      position={[position[0], position[1] + offsetY, position[2]]}
      center
      zIndexRange={[10, 0]}
      style={{ pointerEvents: "none" }}
    >
      <span className="whitespace-nowrap rounded bg-space-950/80 px-1.5 py-0.5 font-mono text-[10px] text-slate-200">
        {children}
      </span>
    </Html>
  );
}
