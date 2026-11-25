import { describe, expect, it } from "vitest";
import { createLinearScale, physicsToScene } from "./scale";

describe("scale helpers", () => {
  it("round-trips linear scale", () => {
    const s = createLinearScale(1e6);
    expect(s.toMetres(s.toScene(6.371e6))).toBeCloseTo(6.371e6);
  });
  it("maps the physics x–y plane onto the scene x–z plane", () => {
    expect(physicsToScene([1e6, 2e6, 3e6], 1e6)).toEqual([1, 3, -2]);
  });
});
