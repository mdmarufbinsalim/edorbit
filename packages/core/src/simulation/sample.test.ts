import { describe, expect, it } from "vitest";
import { sampleTrajectory } from "./sample";
import { createWorkerHandler } from "./worker";
import type { ScientificModel } from "./types";

const linear = (p: { v: number }): ScientificModel<number, { v: number }> => ({
  parameters: p,
  initialize: () => 0,
  step: (s, dt) => s + p.v * dt,
});

describe("sampleTrajectory", () => {
  it("samples every n steps and honours stop", () => {
    expect(sampleTrajectory(linear({ v: 1 }), { dt: 1, steps: 6, every: 2 }, (s) => s)).toEqual([
      0, 2, 4, 6,
    ]);
    expect(
      sampleTrajectory(linear({ v: 1 }), { dt: 1, steps: 10, stop: (s) => s >= 3 }, (s) => s),
    ).toEqual([0, 1, 2, 3]);
  });
});

describe("createWorkerHandler", () => {
  it("propagates a model from params", () => {
    const handle = createWorkerHandler(linear);
    expect(handle({ id: 7, params: { v: 2 }, dt: 0.5, steps: 4 })).toEqual({ id: 7, state: 4 });
  });
});
