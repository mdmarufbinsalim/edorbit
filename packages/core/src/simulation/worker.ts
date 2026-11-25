import type { ModelFactory } from "./types";

/**
 * Minimal Web Worker protocol for running expensive propagations off the main
 * thread. Functions cannot cross the worker boundary, so the worker module
 * imports its own model factory and calls `createWorkerHandler(factory)`.
 *
 * Worker side:  self.onmessage = (e) => self.postMessage(handler(e.data));
 * Main side:    worker.postMessage({ id, params, dt, steps }).
 */
export interface PropagateRequest<Params> {
  id: number;
  params: Params;
  dt: number;
  steps: number;
}

export interface PropagateResponse<State> {
  id: number;
  state: State;
}

export function createWorkerHandler<State, Params>(factory: ModelFactory<State, Params>) {
  return ({ id, params, dt, steps }: PropagateRequest<Params>): PropagateResponse<State> => {
    const model = factory(params);
    let state = model.initialize();
    for (let i = 0; i < steps; i++) state = model.step(state, dt);
    return { id, state };
  };
}
