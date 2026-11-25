import { describe, expect, it, afterEach } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Calculator } from "./Calculator";

afterEach(cleanup);

describe("Calculator", () => {
  it("recomputes outputs when an input changes", () => {
    render(
      <Calculator
        calculator={{
          id: "c",
          equationId: "e",
          title: "Square",
          inputs: [{ key: "x", label: "x", unit: "m", defaultValue: 3 }],
          outputs: [{ label: "x²", unit: "m²", compute: ({ x }) => (x ?? 0) ** 2 }],
        }}
      />,
    );
    expect(screen.getByText("9")).toBeTruthy();
    fireEvent.change(screen.getByLabelText(/x \(m\)/), { target: { value: "12" } });
    expect(screen.getByText("144")).toBeTruthy();
  });
});
