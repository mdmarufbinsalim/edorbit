import { describe, expect, it } from "vitest";
import { SimulationEngine } from "./engine";
import type { ScientificModel } from "./types";

const counter = (rate: number): ScientificModel<number, { rate: number }> => ({
  parameters: { rate },
  initialize: () => 0,
  step: (s, dt) => s + rate * dt,
});

describe("SimulationEngine", () => {
  it("does not advance while paused", () => {
    const e = new SimulationEngine(counter(1), { fixedTimestep: 0.1 });
    expect(e.tick(1)).toBe(0);
    expect(e.snapshot().state).toBe(0);
  });

  it("advances on fixed steps while playing", () => {
    const e = new SimulationEngine(counter(2), { fixedTimestep: 0.1 });
    e.play();
    e.tick(1);
    expect(e.snapshot().stepCount).toBe(10);
    expect(e.snapshot().state).toBeCloseTo(2);
    expect(e.snapshot().time).toBeCloseTo(1);
  });

  it("steps manually and resets", () => {
    const e = new SimulationEngine(counter(1), { fixedTimestep: 0.5 });
    e.step(3);
    expect(e.snapshot().time).toBeCloseTo(1.5);
    e.reset();
    expect(e.snapshot()).toEqual({ state: 0, time: 0, stepCount: 0 });
  });

  it("notifies subscribers and swaps models", () => {
    const e = new SimulationEngine(counter(1), { fixedTimestep: 1 });
    const seen: number[] = [];
    const off = e.subscribe((s) => seen.push(s.state));
    e.step();
    e.setModel(counter(5));
    e.step();
    off();
    e.step();
    expect(seen).toEqual([1, 0, 5]);
    expect(e.parameters.rate).toBe(5);
  });
});
