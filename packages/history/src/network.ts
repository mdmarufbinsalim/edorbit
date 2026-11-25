import { greatCircleDistance, type LonLat } from "@edorbit/core";

export interface RouteNetwork {
  places: Readonly<Record<string, LonLat>>;
  /** Undirected routes between place ids. */
  routes: readonly (readonly [string, string])[];
}

export interface SpreadOptions {
  /** How far a copy travels per day, in metres. */
  metresPerDay: number;
  /** Days a town takes to print its own copies after one arrives. */
  reprintDays: number;
}

/**
 * Thought-experiment model of a text spreading through a network of towns:
 * a copy travels along routes at a steady speed, and each town that receives
 * one reprints it after a fixed delay and sends copies onward.
 *
 * Returns the day each reachable town has its own printed copies (the start
 * town is day 0). Unreachable towns are left out. Distances are great-circle,
 * so real road and river journeys were longer.
 */
export function spreadDays(
  network: RouteNetwork,
  start: string,
  { metresPerDay, reprintDays }: SpreadOptions,
): Map<string, number> {
  if (!(metresPerDay > 0)) throw new Error("metresPerDay must be positive");
  const adjacent = new Map<string, { to: string; days: number }[]>();
  for (const [a, b] of network.routes) {
    const pa = network.places[a];
    const pb = network.places[b];
    if (!pa || !pb) throw new Error(`Route ${a}–${b} uses an unknown place`);
    const days = greatCircleDistance(pa, pb) / metresPerDay;
    adjacent.set(a, [...(adjacent.get(a) ?? []), { to: b, days }]);
    adjacent.set(b, [...(adjacent.get(b) ?? []), { to: a, days }]);
  }
  // Dijkstra. The network is small, so a linear scan for the next town is fine.
  const done = new Map<string, number>();
  const best = new Map<string, number>([[start, 0]]);
  while (best.size > 0) {
    let next: string | undefined;
    for (const [id, d] of best) if (next === undefined || d < best.get(next)!) next = id;
    const day = best.get(next!)!;
    best.delete(next!);
    done.set(next!, day);
    for (const { to, days } of adjacent.get(next!) ?? []) {
      if (done.has(to)) continue;
      const arrive = day + days + reprintDays;
      if (arrive < (best.get(to) ?? Infinity)) best.set(to, arrive);
    }
  }
  return done;
}
