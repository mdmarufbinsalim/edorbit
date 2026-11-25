import { add, scale, type Vec3 } from "../common/vector";

/** Position/velocity state for a single body, SI units. */
export interface PointState {
  position: Vec3;
  velocity: Vec3;
}

/** Acceleration as a function of position (conservative, velocity-independent force). */
export type AccelerationFn = (position: Vec3) => Vec3;

export type Integrator = (state: PointState, accel: AccelerationFn, dt: number) => PointState;

/**
 * Velocity Verlet. Symplectic, 2nd order, time-reversible. Bounded energy error
 * for conservative systems; preferred default for orbital propagation.
 */
export const velocityVerlet: Integrator = ({ position, velocity }, accel, dt) => {
  const a0 = accel(position);
  const p1 = add(add(position, scale(velocity, dt)), scale(a0, 0.5 * dt * dt));
  const a1 = accel(p1);
  return { position: p1, velocity: add(velocity, scale(add(a0, a1), 0.5 * dt)) };
};

/** Leapfrog, kick-drift-kick form. Symplectic, 2nd order. */
export const leapfrog: Integrator = ({ position, velocity }, accel, dt) => {
  const vHalf = add(velocity, scale(accel(position), 0.5 * dt));
  const p1 = add(position, scale(vHalf, dt));
  return { position: p1, velocity: add(vHalf, scale(accel(p1), 0.5 * dt)) };
};

/**
 * Classical 4th-order Runge-Kutta. Very accurate per step but not symplectic:
 * energy drifts secularly over long integrations.
 */
export const rk4: Integrator = ({ position: p, velocity: v }, accel, dt) => {
  const k1v = accel(p);
  const k1p = v;
  const k2v = accel(add(p, scale(k1p, dt / 2)));
  const k2p = add(v, scale(k1v, dt / 2));
  const k3v = accel(add(p, scale(k2p, dt / 2)));
  const k3p = add(v, scale(k2v, dt / 2));
  const k4v = accel(add(p, scale(k3p, dt)));
  const k4p = add(v, scale(k3v, dt));
  const comb = (a: Vec3, b: Vec3, c: Vec3, d: Vec3) =>
    scale(add(add(a, scale(b, 2)), add(scale(c, 2), d)), dt / 6);
  return { position: add(p, comb(k1p, k2p, k3p, k4p)), velocity: add(v, comb(k1v, k2v, k3v, k4v)) };
};

export const integrators = { velocityVerlet, leapfrog, rk4 } as const;
export type IntegratorName = keyof typeof integrators;
