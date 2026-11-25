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

export interface Quiz {
  question: string;
  choices: readonly string[];
  answerIndex: number;
  /** Shown after answering, right or wrong. */
  why: string;
}

/** One short beat of the story: a sentence or two, an optional hands-on widget, an optional quiz. */
export interface StoryChapter {
  id: string;
  title: string;
  /** Keep it short: 1–3 sentences per paragraph, $inline math$ allowed. */
  body: readonly string[];
  /** Key into the concept's `widgets` map. */
  widget?: string;
  quiz?: Quiz;
}

export interface LessonDefinition {
  story: readonly StoryChapter[];
  /** Explicit statement of what the model simplifies or ignores. */
  limitations: readonly string[];
}

/** The one equation a concept puts front and centre, explained symbol by symbol in plain words. */
export interface FeaturedFormula {
  equationId: string;
  /** Plain-language one-liner for the whole equation. */
  tagline: string;
  symbols: readonly { symbol: string; plain: string }[];
  /** Calculator that turns the formula into a playground. */
  calculatorId: string;
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
  /** Hidden behind "more controls" to keep the default view simple. */
  advanced?: boolean;
}

export interface VisualLayerDefinition {
  id: string;
  label: string;
  defaultVisible: boolean;
}

/** A goal the learner reaches by changing parameters. `check` must use the real model. */
export interface MissionDefinition<Params = Record<string, number>> {
  id: string;
  title: string;
  goal: string;
  hint: string;
  check: (params: Params) => boolean;
  /** Celebration + the physics behind it, shown on success. */
  success: string;
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
  /** Optional fun comparison for the result, e.g. "faster than a bullet". */
  say?: (value: number) => string;
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
