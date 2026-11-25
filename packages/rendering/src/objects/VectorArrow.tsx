"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { ArrowHelper, Color, Vector3 } from "three";

export interface ArrowSample {
  origin: readonly [number, number, number];
  /** Direction and magnitude in scene units (already scaled for display). */
  vector: readonly [number, number, number];
}

const scratch = new Vector3();

/** Arrow for force, velocity or acceleration. Reads `get()` each frame. */
export function VectorArrow({
  get,
  color = "#90e0ef",
  minLength = 1e-6,
}: {
  get: () => ArrowSample;
  color?: string;
  minLength?: number;
}) {
  const arrow = useMemo(
    () => new ArrowHelper(new Vector3(1, 0, 0), new Vector3(), 1, new Color(color)),
    [color],
  );
  const ref = useRef<ArrowHelper>(null);

  useFrame(() => {
    const a = ref.current;
    if (!a) return;
    const { origin, vector } = get();
    const len = Math.hypot(vector[0], vector[1], vector[2]);
    a.visible = len > minLength;
    if (!a.visible) return;
    a.position.set(origin[0], origin[1], origin[2]);
    a.setDirection(scratch.set(vector[0] / len, vector[1] / len, vector[2] / len));
    a.setLength(len, Math.min(0.25 * len, 0.4), Math.min(0.12 * len, 0.2));
  });

  return <primitive ref={ref} object={arrow} />;
}
