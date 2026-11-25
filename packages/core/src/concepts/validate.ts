import type {
  CalculatorDefinition,
  Debate,
  EquationDefinition,
  FeaturedFormula,
  LessonDefinition,
  MissionDefinition,
  ParameterDefinition,
  VisualLayerDefinition,
} from "./types";

/** The data-only subset of a concept that can be validated without React. */
export interface ValidatableConcept {
  lesson: LessonDefinition;
  equations: readonly EquationDefinition[];
  calculators?: readonly CalculatorDefinition[];
  formula?: FeaturedFormula;
  missions: readonly MissionDefinition<never>[];
  /** Simulation fields; omit for concepts without a numerical simulation. */
  defaultParameters?: Readonly<Record<string, number>>;
  parameterDefinitions?: readonly ParameterDefinition[];
  visualLayers?: readonly VisualLayerDefinition[];
  readoutIds?: readonly string[];
  /** Widget keys the concept provides. */
  widgetIds: readonly string[];
  /** Widgets used outside the story: the featured idea and the playground. */
  extraWidgetIds?: readonly string[];
  debates?: readonly Debate[];
  /** Ids of the concept's sources, so debates can be checked against them. */
  sourceIds?: readonly string[];
}

const duplicates = (ids: readonly string[]) => ids.filter((id, i) => ids.indexOf(id) !== i);

/** Returns a list of human-readable problems; an empty list means the concept is consistent. */
export function validateConcept(c: ValidatableConcept): string[] {
  const errors: string[] = [];
  const eqIds = c.equations.map((e) => e.id);
  const calcIds = (c.calculators ?? []).map((x) => x.id);
  const dup = (label: string, ids: readonly string[]) =>
    duplicates(ids).forEach((d) => errors.push(`Duplicate ${label} id "${d}"`));
  dup("equation", eqIds);
  dup(
    "chapter",
    c.lesson.story.map((s) => s.id),
  );
  dup(
    "layer",
    (c.visualLayers ?? []).map((l) => l.id),
  );
  dup(
    "mission",
    c.missions.map((m) => m.id),
  );
  dup("readout", c.readoutIds ?? []);
  dup("source", c.sourceIds ?? []);

  for (const ch of c.lesson.story) {
    if (ch.widget && !c.widgetIds.includes(ch.widget))
      errors.push(`Chapter "${ch.id}" uses unknown widget "${ch.widget}"`);
    if (ch.quiz && !(ch.quiz.answerIndex in ch.quiz.choices))
      errors.push(`Chapter "${ch.id}" quiz answerIndex out of range`);
  }
  for (const calc of c.calculators ?? [])
    if (!eqIds.includes(calc.equationId))
      errors.push(`Calculator "${calc.id}" references unknown equation "${calc.equationId}"`);
  if (c.formula) {
    if (!eqIds.includes(c.formula.equationId))
      errors.push(`Formula references unknown equation "${c.formula.equationId}"`);
    if (!calcIds.includes(c.formula.calculatorId))
      errors.push(`Formula references unknown calculator "${c.formula.calculatorId}"`);
  }
  for (const w of c.extraWidgetIds ?? [])
    if (!c.widgetIds.includes(w)) errors.push(`Unknown widget "${w}"`);
  for (const d of c.debates ?? []) {
    if (d.perspectives.length < 2)
      errors.push(`Debate "${d.question}" needs at least two perspectives`);
    for (const p of d.perspectives)
      if (p.sourceId && !(c.sourceIds ?? []).includes(p.sourceId))
        errors.push(`Debate cites unknown source "${p.sourceId}"`);
  }
  for (const p of c.parameterDefinitions ?? []) {
    if (!(p.min < p.max)) errors.push(`Parameter "${p.key}" has min >= max`);
    const v = c.defaultParameters?.[p.key];
    if (v === undefined) errors.push(`Parameter "${p.key}" has no default`);
    else if (v < p.min || v > p.max)
      errors.push(`Default: ${p.key}=${v} outside [${p.min}, ${p.max}]`);
  }
  return errors;
}
