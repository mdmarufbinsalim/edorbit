import { describe, expect, it } from "vitest";
import { orbitalPeriod } from "@orbital/physics";
import { calculators } from "./calculators";
import { experiments } from "./experiments";
import { MU, initialElements } from "./model";
import { simulation } from "./simulation";

const exp = (id: string) => {
  const e = experiments.find((x) => x.id === id)!;
  return { ...simulation.defaultParameters, ...e.setup };
};
const calc = (id: string) => calculators.find((c) => c.id === id)!;

describe("orbital-motion experiments are physically correct", () => {
  it("circular: e ≈ 0 at ~7.06 km/s", () => {
    const p = exp("circular");
    expect(p.v0 / 1000).toBeCloseTo(7.06, 2);
    expect(initialElements(p).eccentricity).toBeLessThan(1e-3);
  });

  it("faster: ellipse with launch point at periapsis, e ≈ 0.32", () => {
    const el = initialElements(exp("faster"));
    expect(el.type).toBe("elliptical");
    expect(el.eccentricity).toBeCloseTo(0.3225, 2);
    expect(el.periapsis / 8e6).toBeCloseTo(1, 4);
  });

  it("double-a: period ratio is 2^(3/2)", () => {
    const ratio = initialElements(exp("double-a")).period / orbitalPeriod(MU, 8e6);
    expect(ratio).toBeCloseTo(2 ** 1.5, 3);
  });

  it("equal-areas: e = 0.7", () => {
    expect(initialElements(exp("equal-areas")).eccentricity).toBeCloseTo(0.7, 3);
  });

  it("escape: energy ≈ 0 (parabolic)", () => {
    const el = initialElements(exp("escape"));
    expect(Math.abs(el.specificEnergy) / (MU / 8e6)).toBeLessThan(1e-3);
    expect(el.eccentricity).toBeCloseTo(1, 3);
  });
});

describe("orbital-motion calculators reproduce worked examples", () => {
  it("ISS period ≈ 92.97 min", () => {
    expect(calc("kepler-calc").outputs[0]!.compute({ a: 6798.137 })).toBeCloseTo(92.97, 1);
  });
  it("GTO perigee speed ≈ 10.15 km/s", () => {
    expect(calc("vis-viva-calc").outputs[0]!.compute({ r: 6678, a: 24421 })).toBeCloseTo(10.15, 2);
  });
  it("force on 1000 kg at 6771 km ≈ 8.69 kN", () => {
    expect(
      calc("gravitation-calc").outputs[0]!.compute({ M: 5.9722e24, m: 1000, r: 6771 }),
    ).toBeCloseTo(8694, -1);
  });
});

describe("orbital-motion derived control", () => {
  it("eccentricity control round-trips", () => {
    const ctl = simulation.derivedControls![0]!;
    const patch = ctl.set(0.5, simulation.defaultParameters);
    expect(ctl.get({ ...simulation.defaultParameters, ...patch })).toBeCloseTo(0.5, 3);
  });
});
