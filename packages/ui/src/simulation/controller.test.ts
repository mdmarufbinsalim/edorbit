import { describe, expect, it } from "vitest";
import type { SimulationSpec } from "@orbital/core";
import { createSimulationController } from "./controller";

const spec: SimulationSpec<number, { v: number }> = {
  defaultParameters: { v: 1 },
  parameterDefinitions: [{ key: "v", label: "v", unit: "", min: 0, max: 10, step: 1 }],
  visualLayers: [{ id: "trail", label: "Trail", defaultVisible: true }],
  readouts: [],
  createModel: (p) => ({ parameters: p, initialize: () => 0, step: (s, dt) => s + p.v * dt }),
  fixedTimestep: 1,
  timeScales: [{ label: "1×", value: 1 }],
  defaultTimeScale: 1,
};

describe("createSimulationController", () => {
  it("rebuilds the model when parameters change", () => {
    const { engine, store } = createSimulationController(spec);
    store.getState().step(2);
    expect(engine.snapshot().state).toBe(2);
    store.getState().setParams({ v: 5 });
    expect(engine.snapshot().state).toBe(0);
    store.getState().step();
    expect(engine.snapshot().state).toBe(5);
  });

  it("tracks play state, layers and time scale", () => {
    const { engine, store } = createSimulationController(spec);
    store.getState().play();
    expect(engine.isRunning).toBe(true);
    store.getState().setTimeScale(10);
    expect(engine.timeScale).toBe(10);
    store.getState().setLayer("trail", false);
    expect(store.getState().layers.trail).toBe(false);
    store.getState().resetParams();
    expect(store.getState().params.v).toBe(1);
  });
});
