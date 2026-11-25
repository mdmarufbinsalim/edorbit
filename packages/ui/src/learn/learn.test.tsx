import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { QuizCard } from "./QuizCard";
import { MissionList } from "./MissionList";
import { ParameterSlider } from "../controls/ParameterSlider";

// framer-motion and SketchCircle measure elements.
globalThis.ResizeObserver ??= class {
  observe() {}
  disconnect() {}
  unobserve() {}
} as unknown as typeof ResizeObserver;
globalThis.IntersectionObserver ??= class {
  observe() {}
  disconnect() {}
  unobserve() {}
  takeRecords() {
    return [];
  }
} as unknown as typeof IntersectionObserver;

afterEach(cleanup);

describe("QuizCard", () => {
  it("reveals the answer and the explanation", () => {
    render(
      <QuizCard
        quiz={{ question: "2 × 2?", choices: ["3", "4"], answerIndex: 1, why: "Because maths." }}
      />,
    );
    fireEvent.click(screen.getByRole("radio", { name: "3" }));
    expect(screen.getByText(/Not quite/)).toBeTruthy();
    expect(screen.getByText("Because maths.")).toBeTruthy();
  });
});

describe("MissionList", () => {
  it("ticks missions whose check passes", () => {
    render(
      <MissionList
        params={{ v: 5 }}
        missions={[
          {
            id: "a",
            title: "Go fast",
            goal: "v > 3",
            hint: "",
            check: (p: { v: number }) => p.v > 3,
            success: "Zoom!",
          },
          {
            id: "b",
            title: "Go slow",
            goal: "v < 1",
            hint: "Slow down",
            check: (p: { v: number }) => p.v < 1,
            success: "",
          },
        ]}
      />,
    );
    expect(screen.getByText("1 of 2 missions complete")).toBeTruthy();
    expect(screen.getByText("Zoom!")).toBeTruthy();
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
    expect(screen.getByText("7,000")).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Distance"), { target: { value: "8000000" } });
    expect(onChange).toHaveBeenCalledWith(8e6);
  });
});
