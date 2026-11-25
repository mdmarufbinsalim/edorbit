"use client";

import { useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";

/** Group whose position is read from `get()` every frame, without React re-renders. */
export function Follow({
  get,
  children,
}: {
  get: () => readonly [number, number, number];
  children: ReactNode;
}) {
  const ref = useRef<Group>(null);
  useFrame(() => {
    const p = get();
    ref.current?.position.set(p[0], p[1], p[2]);
  });
  return <group ref={ref}>{children}</group>;
}
