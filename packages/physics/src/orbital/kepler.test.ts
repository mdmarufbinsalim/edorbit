import { describe, expect, it } from "vitest";
import { EARTH, SUN, AU } from "@orbital/core/units/constants";
import {
  circularSpeed,
  classifyOrbit,
  elementsFromState,
  orbitalPeriod,
  visVivaSpeed,
} from "./kepler";
import { createTwoBodyModel } from "./two-body";

describe("Kepler / vis-viva", () => {
  it("Earth's orbital period is one sidereal year", () => {
    expect(orbitalPeriod(SUN.mu, AU) / 86_400).toBeCloseTo(365.26, 1);
  });

  it("ISS (~420 km) orbits in ~92.7 min at ~7.66 km/s", () => {
    const r = EARTH.equatorialRadius + 420e3;
    expect(orbitalPeriod(EARTH.mu, r) / 60).toBeCloseTo(92.7, 0);
    expect(circularSpeed(EARTH.mu, r) / 1000).toBeCloseTo(7.66, 2);
  });

  it("GEO radius gives a sidereal-day period", () => {
    expect(orbitalPeriod(EARTH.mu, 42_164_000) / 3600).toBeCloseTo(23.934, 2);
  });

  it("vis-viva reduces to circular speed when r = a", () => {
    expect(visVivaSpeed(EARTH.mu, 7e6, 7e6)).toBeCloseTo(circularSpeed(EARTH.mu, 7e6), 9);
  });

  it("vis-viva at r→a=∞ gives escape speed", () => {
    expect(visVivaSpeed(EARTH.mu, EARTH.meanRadius, Infinity) / 1000).toBeCloseTo(11.19, 2);
  });

  it("classifies conics", () => {
    expect(classifyOrbit(0)).toBe("circular");
    expect(classifyOrbit(0.5)).toBe("elliptical");
    expect(classifyOrbit(1)).toBe("parabolic");
    expect(classifyOrbit(2)).toBe("hyperbolic");
  });
});

describe("elementsFromState", () => {
  const mu = EARTH.mu;
  const rp = 7e6;

  it("recovers a circular orbit", () => {
    const el = elementsFromState(mu, [rp, 0, 0], [0, circularSpeed(mu, rp), 0]);
    expect(el.eccentricity).toBeLessThan(1e-12);
    expect(el.semiMajorAxis).toBeCloseTo(rp, 3);
    expect(el.type).toBe("circular");
  });

  it("recovers an ellipse launched at periapsis", () => {
    const e = 0.3;
    const a = rp / (1 - e);
    const el = elementsFromState(mu, [rp, 0, 0], [0, visVivaSpeed(mu, rp, a), 0]);
    expect(el.eccentricity).toBeCloseTo(e, 10);
    expect(el.semiMajorAxis / a).toBeCloseTo(1, 10);
    expect(el.periapsis / rp).toBeCloseTo(1, 10);
    expect(el.apoapsis / (a * (1 + e))).toBeCloseTo(1, 10);
  });

  it("flags hyperbolic trajectories as unbound", () => {
    const el = elementsFromState(mu, [rp, 0, 0], [0, 1.5 * Math.sqrt((2 * mu) / rp), 0]);
    expect(el.type).toBe("hyperbolic");
    expect(el.semiMajorAxis).toBeLessThan(0);
    expect(el.period).toBe(Infinity);
  });
});

describe("two-body model", () => {
  const mu = EARTH.mu;
  const rp = 7e6;
  const e = 0.4;
  const a = rp / (1 - e);
  const model = createTwoBodyModel({
    mu,
    bodyRadius: EARTH.meanRadius,
    position: [rp, 0, 0],
    velocity: [0, visVivaSpeed(mu, rp, a), 0],
  });

  it("conserves energy and angular momentum and reaches apoapsis at T/2", () => {
    const T = orbitalPeriod(mu, a);
    const steps = 20_000;
    const dt = T / 2 / steps;
    let s = model.initialize();
    const el0 = elementsFromState(mu, s.position, s.velocity);
    for (let i = 0; i < steps; i++) s = model.step(s, dt);
    const el = elementsFromState(mu, s.position, s.velocity);
    expect(Math.abs(el.specificEnergy / el0.specificEnergy - 1)).toBeLessThan(1e-6);
    expect(Math.abs(el.angularMomentum[2] / el0.angularMomentum[2] - 1)).toBeLessThan(1e-9);
    expect(s.position[0] / -(a * (1 + e))).toBeCloseTo(1, 4);
  });

  it("stops on impact with the central body", () => {
    const falling = createTwoBodyModel({
      mu,
      bodyRadius: EARTH.meanRadius,
      position: [rp, 0, 0],
      velocity: [0, 1000, 0],
    });
    let s = falling.initialize();
    for (let i = 0; i < 10_000 && !s.impacted; i++) s = falling.step(s, 1);
    expect(s.impacted).toBe(true);
    const frozen = falling.step(s, 1);
    expect(frozen).toBe(s);
  });
});
