/** One pen for every hand-drawn mark, so nothing reads as a different line weight. */
export const SKETCH_STROKE = 2.5;

/** Small deterministic PRNG so sketch jitter is identical on server and client. */
export function seeded(seed: number) {
  let s = Math.abs(Math.floor(seed * 9973)) % 2147483647 || 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export type Point = [number, number];

/** Catmull-Rom → cubic Bézier through points; `closed` loops back to the start. */
export function smoothPath(points: Point[], closed = false): string {
  const n = points.length;
  if (n < 2) return "";
  const at = (i: number): Point =>
    closed ? points[(i + n) % n]! : points[Math.max(0, Math.min(n - 1, i))]!;
  let d = `M ${points[0]![0]} ${points[0]![1]} `;
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const p0 = at(i - 1),
      p1 = at(i),
      p2 = at(i + 1),
      p3 = at(i + 2);
    d += `C ${p1[0] + (p2[0] - p0[0]) / 6} ${p1[1] + (p2[1] - p0[1]) / 6}, ${p2[0] - (p3[0] - p1[0]) / 6} ${p2[1] - (p3[1] - p1[1]) / 6}, ${p2[0]} ${p2[1]} `;
  }
  return closed ? d + "Z" : d;
}
