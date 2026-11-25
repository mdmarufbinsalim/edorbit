import { SimulationClock } from "./clock";
import type { ScientificModel } from "./types";

export interface EngineSnapshot<State> {
  state: State;
  time: number;
  stepCount: number;
}

export interface EngineOptions {
  fixedTimestep: number;
  timeScale?: number;
  maxStepsPerFrame?: number;
}

/**
 * Framework-agnostic simulation lifecycle: play / pause / reset / step / snapshot.
 * Rendering calls `tick(realDelta)` each frame; physics advances on a fixed timestep.
 */
export class SimulationEngine<State, Params> {
  private model: ScientificModel<State, Params>;
  private readonly clock: SimulationClock;
  private state: State;
  private time = 0;
  private stepCount = 0;
  private running = false;
  private readonly listeners = new Set<(s: EngineSnapshot<State>) => void>();

  constructor(model: ScientificModel<State, Params>, options: EngineOptions) {
    this.model = model;
    this.clock = new SimulationClock(options);
    this.state = model.initialize();
  }

  get isRunning(): boolean {
    return this.running;
  }
  get timeScale(): number {
    return this.clock.timeScale;
  }
  set timeScale(value: number) {
    this.clock.timeScale = value;
  }
  get parameters(): Params {
    return this.model.parameters;
  }

  play(): void {
    this.running = true;
  }
  pause(): void {
    this.running = false;
  }

  /** Re-initialise from the current model's initial conditions. */
  reset(): void {
    this.state = this.model.initialize();
    this.time = 0;
    this.stepCount = 0;
    this.clock.reset();
    this.emit();
  }

  /** Swap in a model built from new parameters and reset to its initial state. */
  setModel(model: ScientificModel<State, Params>): void {
    this.model = model;
    this.reset();
  }

  /** Advance exactly `n` fixed steps regardless of play state. */
  step(n = 1): void {
    const dt = this.clock.fixedTimestep;
    for (let i = 0; i < n; i++) {
      this.state = this.model.step(this.state, dt);
      this.time += dt;
      this.stepCount++;
    }
    this.emit();
  }

  /** Called once per rendered frame with real elapsed seconds. Returns steps taken. */
  tick(realDeltaSeconds: number): number {
    if (!this.running) return 0;
    const n = this.clock.advance(realDeltaSeconds);
    if (n > 0) this.step(n);
    return n;
  }

  snapshot(): EngineSnapshot<State> {
    return { state: this.state, time: this.time, stepCount: this.stepCount };
  }

  subscribe(listener: (s: EngineSnapshot<State>) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(): void {
    const snap = this.snapshot();
    for (const l of this.listeners) l(snap);
  }
}
