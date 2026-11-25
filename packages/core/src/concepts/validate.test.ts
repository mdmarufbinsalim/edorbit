import { describe, expect, it } from "vitest";
import { validateConcept, type ValidatableConcept } from "./validate";

const base: ValidatableConcept = {
  lesson: {
    introduction: "",
    whyItMatters: "",
    realWorldExamples: [],
    learningObjectives: [],
    sections: [{ id: "s", heading: "S", body: [], equationIds: ["eq"] }],
    limitations: [],
  },
  equations: [{ id: "eq", name: "Eq", latex: "x", description: "", variables: [] }],
  experiments: [
    {
      id: "x",
      title: "",
      question: "",
      setup: { v: 5 },
      predictionPrompt: "",
      explanation: "",
      watch: ["r"],
    },
  ],
  defaultParameters: { v: 1 },
  parameterDefinitions: [{ key: "v", label: "v", unit: "", min: 0, max: 10, step: 1 }],
  visualLayers: [{ id: "a", label: "A", defaultVisible: true }],
  readoutIds: ["r"],
};

describe("validateConcept", () => {
  it("accepts a consistent concept", () => {
    expect(validateConcept(base)).toEqual([]);
  });

  it("reports broken references and out-of-range values", () => {
    const errors = validateConcept({
      ...base,
      lesson: {
        ...base.lesson,
        sections: [{ id: "s", heading: "", body: [], equationIds: ["missing"] }],
      },
      defaultParameters: { v: 99 },
      experiments: [{ ...base.experiments[0]!, setup: { w: 1 }, watch: ["nope"] }],
    });
    expect(errors).toHaveLength(4);
  });
});
