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
  /** One playful line shown under the title, e.g. "Spoiler: the ISS is falling." */
  hook?: string;
  /** Hand-drawn preview: SVG path data drawn in ink on the discovery card. */
  doodle?: { viewBox: string; d: string };
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
  /** Intuition or derivation sketch, plain text with optional $inline math$. */
  intuition?: string;
  workedExample?: WorkedExample;
}

export interface WorkedExample {
  prompt: string;
  /** Each step is a LaTeX expression. */
  steps: readonly string[];
  result: string;
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
  /** Optional multiple-choice predictions; `answerIndex` marks the correct one. */
  choices?: readonly string[];
  answerIndex?: number;
  /** Readout ids the user should watch while the experiment runs. */
  watch?: readonly string[];
  explanation: string;
}

export interface CalculatorInput {
  key: string;
  label: string;
  unit: string;
  defaultValue: number;
  min?: number;
  max?: number;
  step?: number;
}

export interface CalculatorOutput {
  label: string;
  unit: string;
  /** Inputs are in the display units declared on each input. */
  compute: (inputs: Readonly<Record<string, number>>) => number;
}

/** Interactive calculator bound to an equation. Changing an input recomputes outputs. */
export interface CalculatorDefinition {
  id: string;
  equationId: string;
  title: string;
  inputs: readonly CalculatorInput[];
  outputs: readonly CalculatorOutput[];
}

export interface ScientificReference {
  title: string;
  authors?: string;
  source: string;
  year?: number;
  url?: string;
}
