import type { ScientificModel } from "./types";

/**
 * Propagate a throwaway copy of a model to sample a predicted path.
 * Used for drawing future trajectories; the live simulation is unaffected.
 */
export function sampleTrajectory<State, Params, T>(
  model: ScientificModel<State, Params>,
  options: { dt: number; steps: number; every?: number; stop?: (s: State) => boolean },
  select: (s: State) => T,
): T[] {
  const { dt, steps, every = 1, stop } = options;
  let s = model.initialize();
  const out: T[] = [select(s)];
  for (let i = 1; i <= steps; i++) {
    s = model.step(s, dt);
    if (i % every === 0) out.push(select(s));
    if (stop?.(s)) {
      if (i % every !== 0) out.push(select(s));
      break;
    }
  }
  return out;
}
