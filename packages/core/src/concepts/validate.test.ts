import { describe, expect, it } from "vitest";
import { validateConcept, type ValidatableConcept } from "./validate";

const base: ValidatableConcept = {
  lesson: {
    story: [
      {
        id: "a",
        title: "A",
        body: [],
        widget: "w",
        quiz: { question: "", choices: ["x", "y"], answerIndex: 1, why: "" },
      },
    ],
    limitations: [],
  },
  equations: [{ id: "eq", name: "Eq", latex: "x", description: "", variables: [] }],
  calculators: [{ id: "c", equationId: "eq", title: "", inputs: [], outputs: [] }],
  formula: { equationId: "eq", calculatorId: "c", tagline: "", symbols: [] },
  missions: [{ id: "m", title: "", goal: "", hint: "", check: () => true, success: "" }],
  defaultParameters: { v: 1 },
  parameterDefinitions: [{ key: "v", label: "v", unit: "", min: 0, max: 10, step: 1 }],
  visualLayers: [{ id: "l", label: "L", defaultVisible: true }],
  readoutIds: ["r"],
  widgetIds: ["w"],
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
        story: [
          {
            id: "a",
            title: "",
            body: [],
            widget: "nope",
            quiz: { question: "", choices: [], answerIndex: 0, why: "" },
          },
        ],
      },
      formula: { equationId: "missing", calculatorId: "missing", tagline: "", symbols: [] },
      defaultParameters: { v: 99 },
      readoutIds: ["r", "r"],
    });
    expect(errors).toHaveLength(6);
  });
});
