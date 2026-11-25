import type { ParameterDefinition, VisualLayerDefinition } from "../concepts/types";
import type { SimulationEngine } from "./engine";
import type { ScientificModel } from "./types";

export type NumericParams = Record<string, number>;

/** A live value derived from the current state, shown in the data readout. */
export interface ReadoutDefinition<State, Params> {
  id: string;
  label: string;
  unit: string;
  /** Numbers are formatted with significant figures; strings are shown as-is. */
  value: (state: State, params: Params) => number | string;
  description?: string;
  /** Shown by default; others live under "nerd stats". */
  basic?: boolean;
}

/**
 * A control that edits one or more parameters through a derived quantity,
 * e.g. "eccentricity" setting the launch speed. Must be backed by physics.
 */
export interface DerivedControlDefinition<Params> {
  id: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  get: (params: Params) => number;
  set: (value: number, params: Params) => Partial<Params>;
  description?: string;
  advanced?: boolean;
}

export interface TimeScaleOption {
  label: string;
  value: number;
}

export interface SimulationSpec<State, Params extends NumericParams> {
  defaultParameters: Params;
  parameterDefinitions: readonly ParameterDefinition<keyof Params & string>[];
  derivedControls?: readonly DerivedControlDefinition<Params>[];
  visualLayers: readonly VisualLayerDefinition[];
  readouts: readonly ReadoutDefinition<State, Params>[];
  createModel: (params: Params) => ScientificModel<State, Params>;
  /** Physics timestep in simulated seconds. */
  fixedTimestep: number;
  timeScales: readonly TimeScaleOption[];
  defaultTimeScale: number;
}

/** Props every concept scene receives. Framework-agnostic so core stays React-free. */
export interface SceneProps<State, Params> {
  engine: SimulationEngine<State, Params>;
  params: Params;
  layers: Readonly<Record<string, boolean>>;
}
