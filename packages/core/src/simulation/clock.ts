import type { ClockOptions } from "./types";

/**
 * Fixed-timestep accumulator. Converts variable real-time frame intervals into
 * a whole number of fixed physics steps, so results do not depend on frame rate.
 */
export class SimulationClock {
  readonly fixedTimestep: number;
  timeScale: number;
  readonly maxStepsPerFrame: number;
  private accumulator = 0;

  constructor({ fixedTimestep, timeScale = 1, maxStepsPerFrame = 1000 }: ClockOptions) {
    if (!(fixedTimestep > 0)) throw new RangeError("fixedTimestep must be positive");
    this.fixedTimestep = fixedTimestep;
    this.timeScale = timeScale;
    this.maxStepsPerFrame = maxStepsPerFrame;
  }

  /**
   * Register `realDeltaSeconds` of wall-clock time and return how many
   * fixed steps the caller should run now.
   */
  advance(realDeltaSeconds: number): number {
    this.accumulator += Math.max(0, realDeltaSeconds) * this.timeScale;
    let steps = Math.floor(this.accumulator / this.fixedTimestep);
    if (steps > this.maxStepsPerFrame) {
      steps = this.maxStepsPerFrame;
      this.accumulator = 0;
    } else {
      this.accumulator -= steps * this.fixedTimestep;
    }
    return steps;
  }

  /** Fraction of a step left in the accumulator, for render interpolation. */
  get alpha(): number {
    return this.accumulator / this.fixedTimestep;
  }

  reset(): void {
    this.accumulator = 0;
  }
}
