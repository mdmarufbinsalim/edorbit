/**
 * Declarative concept contracts. These types are framework-agnostic so that
 * lesson content can be validated and rendered by any front end. The React
 * scene for a concept lives in @orbital/concepts, not here.
 */

export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface ConceptMetadata {
  id: string;
  slug: string;
  title: string;
  /** The question the concept answers, e.g. "Why does the Moon create two tidal bulges?" */
  question: string;
  description: string;
  category: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  tags: readonly string[];
}

export interface VariableDefinition {
  symbol: string;
  name: string;
  unit: string;
  description: string;
}

export interface EquationDefinition {
  id: string;
  name: string;
  latex: string;
  description: string;
  variables: readonly VariableDefinition[];
  assumptions?: readonly string[];
  validity?: string;
}

export interface LessonSection {
  id: string;
  heading: string;
  /** Plain paragraphs; inline math may be written as $...$. */
  body: readonly string[];
  equationIds?: readonly string[];
}

export interface LessonDefinition {
  introduction: string;
  whyItMatters: string;
  realWorldExamples: readonly string[];
  learningObjectives: readonly string[];
  sections: readonly LessonSection[];
  /** Explicit statement of what the model simplifies or ignores. */
  limitations: readonly string[];
}

export interface ParameterDefinition<Key extends string = string> {
  key: Key;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  /** Optional display scale, e.g. 1/1000 to show metres as km. */
  displayScale?: number;
  description?: string;
}

export interface VisualLayerDefinition {
  id: string;
  label: string;
  defaultVisible: boolean;
}

export interface ExperimentDefinition<Params = Record<string, number>> {
  id: string;
  title: string;
  question: string;
  /** Parameter overrides applied when the experiment starts. */
  setup: Partial<Params>;
  predictionPrompt: string;
  explanation: string;
}

export interface ScientificReference {
  title: string;
  authors?: string;
  source: string;
  year?: number;
  url?: string;
}
