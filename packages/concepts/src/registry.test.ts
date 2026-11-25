import { describe, expect, it } from "vitest";
import { validateConcept, validateTags } from "@edorbit/core";
import { tagVocabulary } from "./tags";
import { conceptRegistry } from "./registry";

describe("concept registry", () => {
  it("registers concepts with unique slugs", () => {
    const slugs = conceptRegistry.list().map((c) => c.metadata.slug);
    expect(slugs.length).toBeGreaterThan(0);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it.each(conceptRegistry.list())(
    "$metadata.slug uses known tags with a subject",
    ({ metadata }) => {
      expect(validateTags(metadata.tags, tagVocabulary)).toEqual([]);
    },
  );

  it("tag ids are unique", () => {
    const ids = tagVocabulary.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(conceptRegistry.list().filter((e) => e.module))(
    "$metadata.slug passes validation",
    ({ module }) => {
      const m = module!;
      expect(
        validateConcept({
          lesson: m.lesson,
          equations: m.equations,
          calculators: m.calculators ?? [],
          ...(m.formula ? { formula: m.formula } : {}),
          missions: m.missions,
          defaultParameters: m.simulation.defaultParameters,
          parameterDefinitions: m.simulation.parameterDefinitions,
          visualLayers: m.simulation.visualLayers,
          readoutIds: m.simulation.readouts.map((r) => r.id),
          widgetIds: Object.keys(m.widgets ?? {}),
        }),
      ).toEqual([]);
    },
  );
});
