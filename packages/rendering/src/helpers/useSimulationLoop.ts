"use client";

import { useFrame } from "@react-three/fiber";
import type { SimulationEngine } from "@edorbit/core";

/**
 * Drives the engine from the render loop. Real frame time is clamped so a
 * backgrounded tab does not request thousands of physics steps on return.
 */
export function useSimulationLoop<State, Params>(
  engine: SimulationEngine<State, Params>,
  maxFrameSeconds = 0.1,
) {
  useFrame((_, delta) => {
    engine.tick(Math.min(delta, maxFrameSeconds));
  });
}
