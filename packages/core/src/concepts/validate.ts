import type {
  CalculatorDefinition,
  EquationDefinition,
  ExperimentDefinition,
  LessonDefinition,
  ParameterDefinition,
  VisualLayerDefinition,
} from "./types";

/** The data-only subset of a concept that can be validated without React. */
export interface ValidatableConcept {
  lesson: LessonDefinition;
  equations: readonly EquationDefinition[];
  calculators?: readonly CalculatorDefinition[];
  experiments: readonly ExperimentDefinition<Record<string, number>>[];
  defaultParameters: Readonly<Record<string, number>>;
  parameterDefinitions: readonly ParameterDefinition[];
  visualLayers: readonly VisualLayerDefinition[];
  readoutIds: readonly string[];
}

const duplicates = (ids: readonly string[]) => ids.filter((id, i) => ids.indexOf(id) !== i);

/** Returns a list of human-readable problems; an empty list means the concept is consistent. */
export function validateConcept(c: ValidatableConcept): string[] {
  const errors: string[] = [];
  const eqIds = c.equations.map((e) => e.id);
  for (const d of duplicates(eqIds)) errors.push(`Duplicate equation id "${d}"`);
  for (const d of duplicates(c.lesson.sections.map((s) => s.id)))
    errors.push(`Duplicate section id "${d}"`);
  for (const d of duplicates(c.visualLayers.map((l) => l.id)))
    errors.push(`Duplicate layer id "${d}"`);
  for (const d of duplicates(c.experiments.map((e) => e.id)))
    errors.push(`Duplicate experiment id "${d}"`);

  for (const s of c.lesson.sections)
    for (const id of s.equationIds ?? [])
      if (!eqIds.includes(id)) errors.push(`Section "${s.id}" references unknown equation "${id}"`);

  for (const calc of c.calculators ?? [])
    if (!eqIds.includes(calc.equationId))
      errors.push(`Calculator "${calc.id}" references unknown equation "${calc.equationId}"`);

  const params = new Map(c.parameterDefinitions.map((p) => [p.key, p]));
  const inRange = (key: string, v: number, where: string) => {
    const p = params.get(key);
    if (!p) errors.push(`${where}: unknown parameter "${key}"`);
    else if (v < p.min || v > p.max)
      errors.push(`${where}: ${key}=${v} outside [${p.min}, ${p.max}]`);
  };
  for (const p of c.parameterDefinitions) {
    if (!(p.min < p.max)) errors.push(`Parameter "${p.key}" has min >= max`);
    const v = c.defaultParameters[p.key];
    if (v === undefined) errors.push(`Parameter "${p.key}" has no default`);
    else inRange(p.key, v, "Default");
  }

  for (const ex of c.experiments) {
    for (const [k, v] of Object.entries(ex.setup))
      if (v !== undefined) inRange(k, v, `Experiment "${ex.id}"`);
    if (ex.choices && ex.answerIndex !== undefined && !(ex.answerIndex in ex.choices))
      errors.push(`Experiment "${ex.id}" answerIndex out of range`);
    for (const w of ex.watch ?? [])
      if (!c.readoutIds.includes(w))
        errors.push(`Experiment "${ex.id}" watches unknown readout "${w}"`);
  }
  return errors;
}
