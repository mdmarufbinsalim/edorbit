import { createStore, type StoreApi } from "zustand/vanilla";
import { SimulationEngine, type NumericParams, type SimulationSpec } from "@edorbit/core";

export interface SimulationUIState<Params extends NumericParams> {
  params: Params;
  layers: Record<string, boolean>;
  playing: boolean;
  timeScale: number;
  setParams: (patch: Partial<Params>) => void;
  resetParams: () => void;
  setLayer: (id: string, visible: boolean) => void;
  play: () => void;
  pause: () => void;
  reset: () => void;
  step: (n?: number) => void;
  setTimeScale: (value: number) => void;
}

export interface SimulationController<State, Params extends NumericParams> {
  engine: SimulationEngine<State, Params>;
  store: StoreApi<SimulationUIState<Params>>;
}

/**
 * Connects UI state (Zustand) to the framework-agnostic engine.
 * Parameter changes rebuild the model; per-frame state never enters React.
 */
export function createSimulationController<State, Params extends NumericParams>(
  spec: SimulationSpec<State, Params>,
): SimulationController<State, Params> {
  const engine = new SimulationEngine(spec.createModel(spec.defaultParameters), {
    fixedTimestep: spec.fixedTimestep,
    timeScale: spec.defaultTimeScale,
  });
  const layers = Object.fromEntries(spec.visualLayers.map((l) => [l.id, l.defaultVisible]));

  const store = createStore<SimulationUIState<Params>>()((set, get) => ({
    params: spec.defaultParameters,
    layers,
    playing: false,
    timeScale: spec.defaultTimeScale,
    setParams: (patch) => {
      const params = { ...get().params, ...patch } as Params;
      engine.setModel(spec.createModel(params));
      set({ params });
    },
    resetParams: () => {
      engine.setModel(spec.createModel(spec.defaultParameters));
      set({ params: spec.defaultParameters });
    },
    setLayer: (id, visible) => set({ layers: { ...get().layers, [id]: visible } }),
    play: () => {
      engine.play();
      set({ playing: true });
    },
    pause: () => {
      engine.pause();
      set({ playing: false });
    },
    reset: () => engine.reset(),
    step: (n = 1) => engine.step(n),
    setTimeScale: (value) => {
      engine.timeScale = value;
      set({ timeScale: value });
    },
  }));

  return { engine, store };
}
