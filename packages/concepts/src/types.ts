import type { ComponentType } from "react";
import type {
  CalculatorDefinition,
  ConceptMetadata,
  Debate,
  EquationDefinition,
  FeaturedFormula,
  LessonDefinition,
  MissionDefinition,
  NumericParams,
  SceneProps,
  SimulationSpec,
  Source,
} from "@edorbit/core";

/** A widget shown in its own section rather than inside a story chapter. */
export interface FeaturedWidget {
  /** Small line above the heading, e.g. "The secret formula" or "A real page". */
  kicker: string;
  title: string;
  /** Key into the concept's `widgets` map. */
  widget: string;
}

export interface PlaygroundDefinition {
  title: string;
  /**
   * Key into `widgets` for a playground that is not a simulation, e.g. a map
   * sandbox. Omit when the concept has `simulation` and `Scene`.
   */
  widget?: string;
}

/**
 * Everything a concept contributes. Story, equations, and references are
 * declarative data; models, widgets, and scenes are reviewed TypeScript.
 *
 * A concept can be story + widgets + missions only. `simulation` and `Scene`
 * are for model-driven concepts and come as a pair.
 */
export interface ConceptModule<State, Params extends NumericParams> {
  metadata: ConceptMetadata;
  lesson: LessonDefinition;
  equations: readonly EquationDefinition[];
  calculators?: readonly CalculatorDefinition[];
  /** The one equation explained front and centre. */
  formula?: FeaturedFormula;
  /** A featured idea that is not a formula, such as a primary source to explore. */
  featured?: FeaturedWidget;
  simulation?: SimulationSpec<State, Params>;
  /** Lazily loaded 3D playground scene, driven by `simulation`. */
  Scene?: ComponentType<SceneProps<State, Params>>;
  playground?: PlaygroundDefinition;
  missions: readonly MissionDefinition<Params>[];
  references: readonly Source[];
  /** Real disagreements among experts, each with at least two views. */
  debates?: readonly Debate[];
  /** Small hands-on widgets referenced by chapters, `featured` and `playground`. Lazily loaded. */
  widgets?: Readonly<Record<string, ComponentType>>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyConceptModule = ConceptModule<any, any>;

/** A registry entry: metadata always, module once the concept is implemented. */
export interface ConceptEntry {
  metadata: ConceptMetadata;
  module?: AnyConceptModule;
}

/** Identity helper that infers State and Params for concept authors. */
export const defineConcept = <State, Params extends NumericParams>(
  module: ConceptModule<State, Params>,
): ConceptModule<State, Params> => module;

/** Concepts with no numerical simulation have no parameters. */
export type NoParams = Record<string, never>;
