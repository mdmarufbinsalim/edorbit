import { describe, expect, it, vi, afterEach } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ExperimentPanel } from "./ExperimentPanel";
import { ParameterSlider } from "./ParameterSlider";

afterEach(cleanup);

describe("ExperimentPanel", () => {
  it("applies the experiment and compares the prediction", () => {
    const onRun = vi.fn();
    render(
      <ExperimentPanel
        experiments={[
          {
            id: "double",
            title: "Double it",
            question: "What if a doubles?",
            setup: { a: 2 },
            predictionPrompt: "Predict T.",
            choices: ["×2", "×2.83"],
            answerIndex: 1,
            explanation: "Kepler's third law.",
          },
        ]}
        onRun={onRun}
      />,
    );
    fireEvent.click(screen.getByLabelText("×2"));
    fireEvent.click(screen.getByRole("button", { name: "Run experiment" }));
    expect(onRun).toHaveBeenCalledWith(expect.objectContaining({ id: "double" }));
    expect(screen.getByText(/disagrees/)).toBeTruthy();
    expect(screen.getByText("Kepler's third law.")).toBeTruthy();
  });
});

describe("ParameterSlider", () => {
  it("shows display units and reports SI values", () => {
    const onChange = vi.fn();
    render(
      <ParameterSlider
        label="Distance"
        unit="km"
        value={7e6}
        min={0}
        max={1e7}
        step={1000}
        displayScale={1e-3}
        onChange={onChange}
      />,
    );
    expect(screen.getByText("7,000 km")).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Distance"), { target: { value: "8000000" } });
    expect(onChange).toHaveBeenCalledWith(8e6);
  });
});
