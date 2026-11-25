import { describe, expect, it } from "vitest";
import {
  chronological,
  europeCoastlines,
  firstWhere,
  formatYear,
  isInOrder,
  upTo,
  EUROPE_BOUNDS,
} from ".";

const events = [
  { id: "b", year: 1492 },
  { id: "a", year: 1450, approximate: true },
  { id: "c", year: 1517 },
  { id: "d", year: 1517 },
];

describe("timeline helpers", () => {
  it("formats years honestly", () => {
    expect(formatYear({ year: 1454, approximate: true })).toBe("c. 1454");
    expect(formatYear({ year: 1469 })).toBe("1469");
    expect(formatYear({ year: -43 })).toBe("44 BCE");
  });
  it("filters and sorts", () => {
    expect(upTo(events, 1492).map((e) => e.id)).toEqual(["b", "a"]);
    expect(chronological(events).map((e) => e.id)).toEqual(["a", "b", "c", "d"]);
    expect(firstWhere(events, (e) => e.year > 1460)?.id).toBe("b");
  });
  it("checks orderings, allowing ties either way", () => {
    expect(isInOrder(["a", "b", "c", "d"], events)).toBe(true);
    expect(isInOrder(["a", "b", "d", "c"], events)).toBe(true);
    expect(isInOrder(["b", "a", "c", "d"], events)).toBe(false);
    expect(isInOrder(["a", "b", "c"], events)).toBe(false);
    expect(isInOrder(["a", "a", "c", "d"], events)).toBe(false);
    expect(isInOrder(["a", "b", "c", "x"], events)).toBe(false);
  });
});

describe("Europe coastline data", () => {
  it("stays inside its bounds", () => {
    const all = europeCoastlines.flat();
    expect(all.length).toBeGreaterThan(1000);
    for (const [lon, lat] of all) {
      expect(lon).toBeGreaterThanOrEqual(EUROPE_BOUNDS.west);
      expect(lon).toBeLessThanOrEqual(EUROPE_BOUNDS.east);
      expect(lat).toBeGreaterThanOrEqual(EUROPE_BOUNDS.south);
      expect(lat).toBeLessThanOrEqual(EUROPE_BOUNDS.north);
    }
  });
});
