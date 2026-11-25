"use client";

import { Stars } from "@react-three/drei";

/** Decorative background stars (single instanced points object). Not a star catalogue. */
export function Starfield({ radius = 500, count = 4000 }: { radius?: number; count?: number }) {
  return (
    <Stars radius={radius} depth={50} count={count} factor={4} saturation={0} fade speed={0} />
  );
}
