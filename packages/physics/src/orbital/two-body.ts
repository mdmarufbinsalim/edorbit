import type { ScientificModel } from "@orbital/core/simulation/types";
import { length, type Vec3 } from "../common/vector";
import { pointMassAcceleration } from "../gravity/newton";
import { integrators, type IntegratorName, type PointState } from "../integration/integrators";

export interface TwoBodyParams {
  /** Gravitational parameter of the central body, m³/s². */
  mu: number;
  /** Radius of the central body, m. Propagation stops on impact. */
  bodyRadius: number;
  position: Vec3;
  velocity: Vec3;
  integrator?: IntegratorName;
}

export interface TwoBodyState extends PointState {
  acceleration: Vec3;
  /** True once the orbiter has hit the central body's surface. */
  impacted: boolean;
}

/**
 * Restricted two-body problem: a test particle around a fixed point mass.
 * Central body assumed spherical and much more massive than the orbiter.
 */
export function createTwoBodyModel(
  params: TwoBodyParams,
): ScientificModel<TwoBodyState, TwoBodyParams> {
  const integrate = integrators[params.integrator ?? "velocityVerlet"];
  const accel = (p: Vec3) => pointMassAcceleration(p, params.mu);
  return {
    parameters: params,
    initialize: () => ({
      position: params.position,
      velocity: params.velocity,
      acceleration: accel(params.position),
      impacted: length(params.position) <= params.bodyRadius,
    }),
    step: (state, dt) => {
      if (state.impacted) return state;
      const next = integrate(state, accel, dt);
      const impacted = length(next.position) <= params.bodyRadius;
      return { ...next, acceleration: accel(next.position), impacted };
    },
  };
}
