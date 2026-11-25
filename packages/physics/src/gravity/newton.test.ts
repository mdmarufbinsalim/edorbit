import { describe, expect, it } from "vitest";
import { EARTH } from "@edorbit/core/units/constants";
import { length } from "../common/vector";
import { gravitationalForce, pointMassAcceleration } from "./newton";

describe("Newtonian gravity", () => {
  it("gives ~9.82 m/s² at Earth's mean radius", () => {
    const a = pointMassAcceleration([EARTH.meanRadius, 0, 0], EARTH.mu);
    expect(length(a)).toBeCloseTo(9.82, 2);
    expect(a[0]).toBeLessThan(0);
  });

  it("follows the inverse-square law", () => {
    const f1 = gravitationalForce(EARTH.mass, 1, EARTH.meanRadius);
    const f2 = gravitationalForce(EARTH.mass, 1, 2 * EARTH.meanRadius);
    expect(f1 / f2).toBeCloseTo(4, 12);
  });

  it("rejects zero separation", () => {
    expect(() => gravitationalForce(1, 1, 0)).toThrow(RangeError);
  });
});
