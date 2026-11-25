import type { ComponentType } from "react";
import type {
  CalculatorDefinition,
  ConceptMetadata,
  EquationDefinition,
  FeaturedFormula,
  LessonDefinition,
  MissionDefinition,
  NumericParams,
  SceneProps,
  ScientificReference,
  SimulationSpec,
} from "@orbital/core";

/**
 * Everything a concept contributes. Story, equations, and references are
 * declarative data; models, widgets, and scenes are reviewed TypeScript.
 */
export interface ConceptModule<State, Params extends NumericParams> {
  metadata: ConceptMetadata;
  lesson: LessonDefinition;
  equations: readonly EquationDefinition[];
  calculators?: readonly CalculatorDefinition[];
  /** The one equation explained front and centre. */
  formula?: FeaturedFormula;
  simulation: SimulationSpec<State, Params>;
  missions: readonly MissionDefinition<Params>[];
  references: readonly ScientificReference[];
  /** Small hands-on 2D widgets referenced by story chapters. Lazily loaded. */
  widgets?: Readonly<Record<string, ComponentType>>;
  /** Lazily loaded 3D playground scene. */
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
