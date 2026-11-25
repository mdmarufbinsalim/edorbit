import type { GravitationalParameter, Kilograms, Metres } from "./types";

/** Newtonian constant of gravitation (CODATA 2018), m³ kg⁻¹ s⁻². */
export const G = 6.6743e-11;

/** Astronomical unit (IAU 2012, exact), m. */
export const AU: Metres = 1.495978707e11;

export const EARTH = {
  mass: 5.9722e24 as Kilograms,
  /** Geocentric gravitational constant (IERS / WGS 84), m³/s². */
  mu: 3.986004418e14 as GravitationalParameter,
  /** Mean radius, m. */
  meanRadius: 6.371e6 as Metres,
  /** Equatorial radius (WGS 84), m. */
  equatorialRadius: 6.378137e6 as Metres,
} as const;

export const MOON = {
  mass: 7.342e22 as Kilograms,
  mu: 4.9028e12 as GravitationalParameter,
  meanRadius: 1.7374e6 as Metres,
  /** Semi-major axis of the lunar orbit, m. */
  semiMajorAxis: 3.844e8 as Metres,
} as const;

export const SUN = {
  mass: 1.98847e30 as Kilograms,
  /** Heliocentric gravitational constant (IAU 2015 nominal), m³/s². */
  mu: 1.32712440018e20 as GravitationalParameter,
  meanRadius: 6.957e8 as Metres,
} as const;
