import { describe, expect, it } from "vitest";
import { equirectangular, greatCircleDistance, polylinesToPath } from ".";

describe("geo", () => {
  it("measures great-circle distances", () => {
    // Paris to London is about 344 km.
    expect(greatCircleDistance([2.35, 48.86], [-0.13, 51.51]) / 1000).toBeCloseTo(344, -1);
    expect(greatCircleDistance([10, 50], [10, 50])).toBe(0);
    // One degree of latitude is about 111 km.
    expect(greatCircleDistance([0, 0], [0, 1]) / 1000).toBeCloseTo(111.2, 0);
  });

  it("fits the bounds to the width, with north up", () => {
    const p = equirectangular({ west: 0, east: 10, south: 40, north: 50 }, 100);
    expect(p.project([0, 50])).toEqual([0, 0]);
    const [x, y] = p.project([10, 40]);
    expect(x).toBeCloseTo(100);
    expect(y).toBeCloseTo(p.height);
    expect(p.height).toBeGreaterThan(100); // latitude is not squeezed
  });

  it("writes SVG paths", () => {
    const p = equirectangular({ west: 0, east: 10, south: 40, north: 50 }, 100);
    expect(
      polylinesToPath(
        [
          [
            [0, 50],
            [10, 50],
          ],
        ],
        p.project,
      ),
    ).toBe("M0.0 0.0L100.0 0.0");
  });
});
