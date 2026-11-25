import { EARTH, type ScientificModel } from "@orbital/core";
import {
  createTwoBodyModel,
  elementsFromState,
  type OrbitalElements,
  type TwoBodyState,
  type Vec3,
} from "@orbital/physics";

/** User-facing parameters, SI units. Launch is from the +x axis in the x–y plane. */
export type OrbitalMotionParams = {
  /** Launch height above Earth's mean surface, m. */
  altitude: number;
  /** Launch speed, m/s. */
  v0: number;
  /** Flight-path angle above local horizontal, degrees. */
  flightPathAngle: number;
};

export const MU = EARTH.mu;
export const BODY_RADIUS = EARTH.meanRadius;

export const radiusOf = (p: Pick<OrbitalMotionParams, "altitude">) => BODY_RADIUS + p.altitude;

export function initialState(p: OrbitalMotionParams): { position: Vec3; velocity: Vec3 } {
  const g = (p.flightPathAngle * Math.PI) / 180;
  return { position: [radiusOf(p), 0, 0], velocity: [p.v0 * Math.sin(g), p.v0 * Math.cos(g), 0] };
}

/** Two-body model exposed with the concept's own (user-facing) parameters. */
export function createModel(
  p: OrbitalMotionParams,
): ScientificModel<TwoBodyState, OrbitalMotionParams> {
  const model = createTwoBodyModel({ mu: MU, bodyRadius: BODY_RADIUS, ...initialState(p) });
  return { parameters: p, initialize: model.initialize, step: model.step };
}

/** Launch speed that gives eccentricity e when starting horizontally at r0 (r0 becomes periapsis). */
export const speedForEccentricity = (r0: number, e: number): number =>
  Math.sqrt((MU * (1 + e)) / r0);

const cache = new WeakMap<object, OrbitalElements>();
/** Memoised elements per state object, so several readouts share one computation. */
export function elementsOf(state: TwoBodyState): OrbitalElements {
  let el = cache.get(state);
  if (!el) {
    el = elementsFromState(MU, state.position, state.velocity);
    cache.set(state, el);
  }
  return el;
}

export function initialElements(p: OrbitalMotionParams): OrbitalElements {
  const s = initialState(p);
  return elementsFromState(MU, s.position, s.velocity);
}

/** Does the orbit dip below the surface (a crash, sooner or later)? */
export const hitsGround = (el: OrbitalElements) => el.periapsis <= BODY_RADIUS;

/** Kid-friendly name for an orbit's shape. */
export function shapeName(el: OrbitalElements, impacted = false): string {
  if (impacted) return "crashed";
  if (el.specificEnergy >= 0) return "escaping!";
  if (hitsGround(el)) return "falling to Earth";
  return el.eccentricity < 0.02 ? "circle" : "oval";
}

/** "1 h 33 min", "2.3 days", or "never comes back". */
export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds)) return "never comes back";
  if (seconds < 3600) return `${Math.round(seconds / 60)} min`;
  if (seconds < 2 * 86400) {
    const h = Math.floor(seconds / 3600);
    return `${h} h ${Math.round((seconds - h * 3600) / 60)} min`;
  }
  return `${(seconds / 86400).toFixed(1)} days`;
}
