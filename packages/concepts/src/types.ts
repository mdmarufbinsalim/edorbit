import type { ComponentType } from "react";
import type {
  CalculatorDefinition,
  ConceptMetadata,
  EquationDefinition,
  ExperimentDefinition,
  LessonDefinition,
  NumericParams,
  SceneProps,
  ScientificReference,
  SimulationSpec,
} from "@orbital/core";

/**
 * Everything a concept contributes. Data (lesson, equations, references) is
 * declarative; executable parts (model, scene) are reviewed TypeScript.
 */
export interface ConceptModule<State, Params extends NumericParams> {
  metadata: ConceptMetadata;
  lesson: LessonDefinition;
  equations: readonly EquationDefinition[];
  calculators?: readonly CalculatorDefinition[];
  simulation: SimulationSpec<State, Params>;
  experiments: readonly ExperimentDefinition<Params>[];
  references: readonly ScientificReference[];
  /** Lazily loaded 3D scene. */
  Scene: ComponentType<SceneProps<State, Params>>;
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
