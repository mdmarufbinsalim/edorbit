import { describe, expect, it } from "vitest";
import { formatQuantity, formatSig } from "./format";

describe("formatSig", () => {
  it("rounds to significant figures", () => {
    expect(formatSig(7546.49, 4)).toBe("7,546");
    expect(formatSig(0.012345, 3)).toBe("0.0123");
  });
  it("uses scientific notation for extremes", () => {
    expect(formatSig(3.986e14, 4)).toBe("3.986 × 10^14");
  });
  it("handles infinities and zero", () => {
    expect(formatSig(Infinity)).toBe("∞");
    expect(formatSig(0)).toBe("0");
    expect(formatQuantity(1.5, "km/s")).toBe("1.5 km/s");
  });
});
