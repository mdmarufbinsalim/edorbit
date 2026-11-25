/**
 * A scientific model advances an immutable state by a fixed timestep.
 * It must be deterministic and must not depend on rendering or UI code.
 */
export interface ScientificModel<State, Params> {
  readonly parameters: Params;
  initialize(): State;
  /** Advance the state by `dt` seconds of simulated time. Must not mutate `state`. */
  step(state: State, dt: number): State;
}

export type ModelFactory<State, Params> = (parameters: Params) => ScientificModel<State, Params>;

export interface ClockOptions {
  /** Fixed physics timestep in simulated seconds. */
  fixedTimestep: number;
  /** Simulated seconds per real second. */
  timeScale?: number;
  /** Upper bound on physics steps per frame, to avoid a spiral of death. */
  maxStepsPerFrame?: number;
}
