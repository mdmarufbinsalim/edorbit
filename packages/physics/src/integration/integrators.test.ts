import { describe, expect, it } from "vitest";
import { EARTH } from "@edorbit/core/units/constants";
import { length, dot } from "../common/vector";
import { pointMassAcceleration } from "../gravity/newton";
import { integrators, type IntegratorName, type PointState } from "./integrators";

const mu = EARTH.mu;
const r0 = 7_000_000;
const vc = Math.sqrt(mu / r0);
const period = 2 * Math.PI * Math.sqrt(r0 ** 3 / mu);
const accel = (p: PointState["position"]) => pointMassAcceleration(p, mu);
const energy = (s: PointState) => dot(s.velocity, s.velocity) / 2 - mu / length(s.position);

function propagate(name: IntegratorName, steps: number, orbits = 1) {
  const dt = (period * orbits) / steps;
  let s: PointState = { position: [r0, 0, 0], velocity: [0, vc, 0] };
  for (let i = 0; i < steps; i++) s = integrators[name](s, accel, dt);
  return s;
}

describe.each(["velocityVerlet", "leapfrog", "rk4"] as const)("%s", (name) => {
  it("returns a circular orbit to its start after one period", () => {
    const s = propagate(name, 2000);
    expect(Math.abs(s.position[0] - r0) / r0).toBeLessThan(1e-4);
    expect(Math.abs(s.position[1]) / r0).toBeLessThan(5e-3);
  });

  it("conserves energy over ten orbits", () => {
    const e0 = -mu / (2 * r0);
    const s = propagate(name, 20_000, 10);
    expect(Math.abs((energy(s) - e0) / e0)).toBeLessThan(1e-5);
  });
});
