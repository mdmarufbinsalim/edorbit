import { cross, dot, length, scale, sub, type Vec3 } from "../common/vector";

/** Vis-viva: orbital speed v = √(μ(2/r − 1/a)). Use a = Infinity for parabolic, a < 0 for hyperbolic. */
export function visVivaSpeed(mu: number, r: number, a: number): number {
  const inv = Number.isFinite(a) ? 1 / a : 0;
  const v2 = mu * (2 / r - inv);
  if (v2 < 0) throw new RangeError("r lies outside the orbit (2/r < 1/a)");
  return Math.sqrt(v2);
}

/** Circular orbital speed √(μ/r). */
export const circularSpeed = (mu: number, r: number): number => Math.sqrt(mu / r);

/** Kepler's third law: T = 2π √(a³/μ). Only defined for bound orbits (a > 0). */
export function orbitalPeriod(mu: number, a: number): number {
  if (!(a > 0)) throw new RangeError("Period is defined only for bound orbits (a > 0)");
  return 2 * Math.PI * Math.sqrt(a ** 3 / mu);
}

/** Specific orbital energy ε = v²/2 − μ/r, J/kg. */
export const specificOrbitalEnergy = (mu: number, r: number, v: number): number =>
  (v * v) / 2 - mu / r;

/** Semi-major axis from energy: a = −μ / (2ε). Infinity when ε = 0. */
export const semiMajorAxisFromEnergy = (mu: number, energy: number): number =>
  energy === 0 ? Infinity : -mu / (2 * energy);

export type OrbitType = "circular" | "elliptical" | "parabolic" | "hyperbolic";

export interface OrbitalElements {
  /** Semi-major axis, m (negative for hyperbolic, Infinity for parabolic). */
  semiMajorAxis: number;
  eccentricity: number;
  eccentricityVector: Vec3;
  /** Specific angular momentum vector h = r × v, m²/s. */
  angularMomentum: Vec3;
  specificEnergy: number;
  periapsis: number;
  /** Apoapsis distance, m; Infinity for unbound orbits. */
  apoapsis: number;
  /** Period, s; Infinity for unbound orbits. */
  period: number;
  type: OrbitType;
}

/** Classify by eccentricity with a small tolerance. */
export function classifyOrbit(e: number, tol = 1e-6): OrbitType {
  if (e < tol) return "circular";
  if (Math.abs(e - 1) < tol) return "parabolic";
  return e < 1 ? "elliptical" : "hyperbolic";
}

/** Two-body orbital elements from a Cartesian state vector (r, v) about a body with parameter μ. */
export function elementsFromState(mu: number, r: Vec3, v: Vec3): OrbitalElements {
  const rMag = length(r);
  const vMag = length(v);
  const h = cross(r, v);
  const hMag = length(h);
  const eVec = sub(scale(cross(v, h), 1 / mu), scale(r, 1 / rMag));
  const e = length(eVec);
  const energy = specificOrbitalEnergy(mu, rMag, vMag);
  const a = semiMajorAxisFromEnergy(mu, energy);
  // Periapsis from the angular momentum: p = h²/μ, rp = p/(1+e). Valid for all conics.
  const periapsis = (hMag * hMag) / mu / (1 + e);
  const bound = e < 1 && a > 0;
  return {
    semiMajorAxis: a,
    eccentricity: e,
    eccentricityVector: eVec,
    angularMomentum: h,
    specificEnergy: energy,
    periapsis,
    apoapsis: bound ? a * (1 + e) : Infinity,
    period: bound ? orbitalPeriod(mu, a) : Infinity,
    type: classifyOrbit(e),
  };
}

/** Flight-path speed check helper: dot(r, v) = 0 at the apsides. */
export const radialVelocity = (r: Vec3, v: Vec3): number => dot(r, v) / length(r);
