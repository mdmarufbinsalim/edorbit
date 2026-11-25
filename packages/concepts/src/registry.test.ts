import { describe, expect, it } from "vitest";
import { validateConcept } from "@orbital/core";
import { conceptRegistry } from "./registry";

describe("concept registry", () => {
  it("registers the five launch concepts with unique slugs", () => {
    const slugs = conceptRegistry.list().map((c) => c.metadata.slug);
    expect(slugs).toHaveLength(5);
    expect(new Set(slugs).size).toBe(5);
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
