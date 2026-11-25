import { describe, expect, it } from "vitest";
import { SimulationClock } from "./clock";

describe("SimulationClock", () => {
  it("produces the same number of steps regardless of frame slicing", () => {
    const a = new SimulationClock({ fixedTimestep: 0.01 });
    const b = new SimulationClock({ fixedTimestep: 0.01 });
    const stepsA = a.advance(1.0);
    let stepsB = 0;
    for (let i = 0; i < 60; i++) stepsB += b.advance(1 / 60);
    expect(stepsA).toBe(100);
    expect(Math.abs(stepsB - stepsA)).toBeLessThanOrEqual(1);
  });

  it("applies time scale", () => {
    const clock = new SimulationClock({ fixedTimestep: 1, timeScale: 10 });
    expect(clock.advance(1)).toBe(10);
  });

  it("caps steps per frame", () => {
    const clock = new SimulationClock({ fixedTimestep: 1, maxStepsPerFrame: 5 });
    expect(clock.advance(100)).toBe(5);
    expect(clock.alpha).toBe(0);
  });

  it("rejects non-positive timesteps", () => {
    expect(() => new SimulationClock({ fixedTimestep: 0 })).toThrow(RangeError);
  });
});
