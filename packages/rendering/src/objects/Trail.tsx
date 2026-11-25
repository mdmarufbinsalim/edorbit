"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { BufferAttribute, BufferGeometry, LineBasicMaterial, Line as ThreeLine } from "three";

/**
 * Ring-buffer trail of recent positions, updated in place each frame.
 * `get()` returns the current point in scene units; changing `resetKey` clears it.
 */
export function Trail({
  get,
  maxPoints = 2000,
  color = "#f4a261",
  minSpacing = 0.01,
  resetKey,
}: {
  get: () => readonly [number, number, number];
  maxPoints?: number;
  color?: string;
  minSpacing?: number;
  resetKey?: unknown;
}) {
  const line = useMemo(() => {
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(new Float32Array(maxPoints * 3), 3));
    geometry.setDrawRange(0, 0);
    return new ThreeLine(
      geometry,
      new LineBasicMaterial({ color, transparent: true, opacity: 0.9 }),
    );
    // resetKey intentionally recreates the buffer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxPoints, color, resetKey]);
  const ref = useRef<ThreeLine>(null);
  const count = useRef(0);
  const last = useRef<readonly [number, number, number] | null>(null);

  useEffect(() => {
    count.current = 0;
    last.current = null;
    return () => {
      line.geometry.dispose();
      (line.material as LineBasicMaterial).dispose();
    };
  }, [line]);

  useFrame(() => {
    const obj = ref.current;
    if (!obj) return;
    const p = get();
    const l = last.current;
    if (l) {
      const d = Math.hypot(p[0] - l[0], p[1] - l[1], p[2] - l[2]);
      if (d < minSpacing) return;
      if (d > 1e3) count.current = 0; // discontinuity
    }
    const attr = obj.geometry.getAttribute("position") as BufferAttribute;
    const arr = attr.array as Float32Array;
    if (count.current >= maxPoints) {
      arr.copyWithin(0, 3);
      count.current = maxPoints - 1;
    }
    arr.set(p, count.current * 3);
    count.current++;
    last.current = p;
    attr.needsUpdate = true;
    obj.geometry.setDrawRange(0, count.current);
    obj.geometry.computeBoundingSphere();
  });

  return <primitive ref={ref} object={line} />;
}
