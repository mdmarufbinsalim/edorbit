import { sampleTrajectory } from "@edorbit/core";
import { length, type Vec3 } from "@edorbit/physics";
import { BODY_RADIUS, createModel, formatDuration, initialElements } from "../model";

/** Newton's thought experiment: same launch point, different speeds, real two-body physics. */
export const ALTITUDE = 1_000_000; // a "mountain" poking above the atmosphere
export const VIEW = 300;
export const EARTH_PX = 110;
const S = EARTH_PX / BODY_RADIUS;
// Physics (x, y) → screen with the launch point at the top, moving right.
export const toSvg = (p: Vec3): [number, number] => [p[1] * S, -p[0] * S];

export type Outcome = { kind: "splat" | "circle" | "oval" | "escape"; text: string };

export function simulateShot(v0: number) {
  const params = { altitude: ALTITUDE, v0, flightPathAngle: 0 };
  const el = initialElements(params);
  const dt = 10;
  const steps = Number.isFinite(el.period) ? Math.min(Math.ceil(el.period / dt) + 2, 20_000) : 4000;
  let last: { position: Vec3; impacted: boolean } | null = null;
  const points = sampleTrajectory(
    createModel(params),
    { dt, steps, every: 3, stop: (s) => s.impacted || length(s.position) > 9 * BODY_RADIUS },
    (s) => {
      last = s;
      return toSvg(s.position);
    },
  );
  const end = last as { position: Vec3; impacted: boolean } | null;
  let outcome: Outcome;
  if (end?.impacted) {
    const angle = Math.atan2(end.position[1], end.position[0]);
    const ground = (angle < 0 ? angle + 2 * Math.PI : angle) * BODY_RADIUS;
    outcome = {
      kind: "splat",
      text: `Splat! It landed ${Math.round(ground / 1000).toLocaleString("en-US")} km away.`,
    };
  } else if (el.specificEnergy >= 0)
    outcome = { kind: "escape", text: "Bye-bye! Too fast for Earth to ever pull it back." };
  else if (el.eccentricity < 0.03)
    outcome = {
      kind: "circle",
      text: "Orbit! It keeps falling, but the ground keeps curving away.",
    };
  else if (el.apoapsis > 4.5 * BODY_RADIUS)
    outcome = {
      kind: "oval",
      text: `A giant oval! It swings out to ${Math.round((el.apoapsis - BODY_RADIUS) / 1000).toLocaleString("en-US")} km, way off the picture, and comes back ${formatDuration(el.period)} later.`,
    };
  else outcome = { kind: "oval", text: "Orbit, an oval one! It swings out and comes back round." };
  return {
    points,
    outcome,
    d: "M " + points.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L "),
  };
}
