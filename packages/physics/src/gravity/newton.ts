import { G } from "@orbital/core/units/constants";
import { length, scale, sub, type Vec3 } from "../common/vector";

/** Magnitude of Newtonian gravitational force F = GMm / r², in newtons. */
export function gravitationalForce(M: number, m: number, r: number): number {
  if (!(r > 0)) throw new RangeError("Separation r must be positive");
  return (G * M * m) / (r * r);
}

/**
 * Gravitational acceleration at `position` due to a point mass with
 * gravitational parameter `mu` located at `source`: a = -μ r̂ / r².
 */
export function pointMassAcceleration(position: Vec3, mu: number, source: Vec3 = [0, 0, 0]): Vec3 {
  const r = sub(position, source);
  const d = length(r);
  if (!(d > 0)) throw new RangeError("Position coincides with the point mass");
  return scale(r, -mu / (d * d * d));
}
