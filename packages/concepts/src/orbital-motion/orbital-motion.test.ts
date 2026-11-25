import { describe, expect, it } from "vitest";
import { EARTH } from "@edorbit/core";
import { orbitalPeriod } from "@edorbit/physics";
import { calculators, formula } from "./calculators";
import { lesson } from "./lesson";
import { missions } from "./missions";
import {
  initialElements,
  shapeName,
  speedForEccentricity,
  radiusOf,
  formatDuration,
} from "./model";
import { simulation } from "./simulation";
import { simulateShot } from "./widgets/cannon-physics";
import { yearsAt } from "./widgets/KeplerYears";

const mission = (id: string) => missions.find((m) => m.id === id)!;
const base = simulation.defaultParameters;

describe("missions are achievable with their hints", () => {
  it("circle: 1,600 km at 7.07 km/s", () => {
    expect(mission("circle").check({ ...base, altitude: 1_600_000, v0: 7_070 })).toBe(true);
    expect(mission("circle").check(base)).toBe(false);
  });
  it("iss: 420 km at 7.66 km/s", () => {
    expect(mission("iss").check({ ...base, altitude: 420_000, v0: 7_660 })).toBe(true);
  });
  it("geo: 35,800 km at 3.07 km/s", () => {
    expect(mission("geo").check({ ...base, altitude: 35_800_000, v0: 3_070 })).toBe(true);
  });
  it("escape: √2 × circle speed", () => {
    const vc = Math.sqrt(EARTH.mu / radiusOf(base));
    expect(mission("escape").check({ ...base, v0: Math.SQRT2 * vc + 1 })).toBe(true);
    expect(mission("escape").check({ ...base, v0: 1.3 * vc })).toBe(false);
  });
  it("all missions are reachable inside the slider ranges", () => {
    const [alt, v] = simulation.parameterDefinitions;
    for (const p of [
      { altitude: 420_000, v0: 7_660 },
      { altitude: 35_800_000, v0: 3_070 },
    ]) {
      expect(p.altitude).toBeGreaterThanOrEqual(alt!.min);
      expect(p.altitude).toBeLessThanOrEqual(alt!.max);
      expect(p.v0).toBeGreaterThanOrEqual(v!.min);
    }
  });
});

describe("story claims hold", () => {
  it("cannon speeds in the hint give splat → circle → oval → escape", () => {
    expect(simulateShot(4_000).outcome.kind).toBe("splat");
    expect(simulateShot(7_400).outcome.kind).toBe("circle");
    expect(simulateShot(9_000).outcome.kind).toBe("oval");
    expect(simulateShot(11_000).outcome.kind).toBe("escape");
  });
  it("gravity at the ISS is ~90% of surface gravity", () => {
    const ratio = (EARTH.meanRadius / (EARTH.meanRadius + 420e3)) ** 2;
    expect(ratio).toBeGreaterThan(0.87);
    expect(ratio).toBeLessThan(0.91);
  });
  it("twice Earth's distance gives a ~2.83-year year", () => {
    expect(yearsAt(2)).toBeCloseTo(2 ** 1.5, 2);
    const q = lesson.story.find((c) => c.id === "years")!.quiz!;
    expect(q.choices[q.answerIndex]).toContain("2.8");
  });
  it("ISS lap ≈ 93 min, ~16 sunrises/day", () => {
    const T = orbitalPeriod(EARTH.mu, EARTH.meanRadius + 420e3);
    expect(T / 60).toBeCloseTo(92.8, 0);
    expect(Math.round(86400 / T)).toBe(16);
  });
});

describe("formula playground", () => {
  const calc = calculators.find((c) => c.id === formula.calculatorId)!;
  it("ISS speed ≈ 7.66 km/s at 420 km", () => {
    expect(calc.outputs[0]!.compute({ h: 420 })).toBeCloseTo(7.66, 2);
    expect(calc.outputs[0]!.say!(7.66)).toContain("27,576 km/h");
  });
  it("geostationary lap ≈ 23.93 h", () => {
    expect(calc.outputs[1]!.compute({ h: 35_793 })).toBeCloseTo(23.93, 1);
  });
});

describe("model helpers", () => {
  it("names shapes", () => {
    const r = radiusOf(base);
    expect(shapeName(initialElements({ ...base, v0: speedForEccentricity(r, 0) }))).toBe("circle");
    expect(shapeName(initialElements({ ...base, v0: speedForEccentricity(r, 0.4) }))).toBe("oval");
    expect(shapeName(initialElements({ ...base, v0: 2_000 }))).toBe("falling to Earth");
    expect(shapeName(initialElements({ ...base, v0: 12_000 }))).toBe("escaping!");
  });
  it("formats durations", () => {
    expect(formatDuration(5580)).toBe("1 h 33 min");
    expect(formatDuration(1800)).toBe("30 min");
    expect(formatDuration(Infinity)).toBe("never comes back");
  });
  it("eccentricity control round-trips", () => {
    const ctl = simulation.derivedControls![0]!;
    expect(ctl.get({ ...base, ...ctl.set(0.5, base) })).toBeCloseTo(0.5, 2);
  });
});
