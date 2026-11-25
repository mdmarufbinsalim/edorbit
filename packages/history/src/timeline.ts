import type { HistoricalYear } from "./types";

/** "c. 1454" for approximate years, "1469" otherwise, "44 BCE" before year 1. */
export function formatYear({ year, approximate }: HistoricalYear): string {
  const y = year < 1 ? `${1 - year} BCE` : String(year);
  return approximate ? `c. ${y}` : y;
}

/** Items that had happened by the end of `year`. */
export const upTo = <T extends HistoricalYear>(items: readonly T[], year: number): T[] =>
  items.filter((i) => i.year <= year);

/** Earliest first. Stable, so items in the same year keep their given order. */
export const chronological = <T extends HistoricalYear>(items: readonly T[]): T[] =>
  [...items].sort((a, b) => a.year - b.year);

/** The earliest item that matches, or undefined. */
export const firstWhere = <T extends HistoricalYear>(
  items: readonly T[],
  match: (item: T) => boolean,
): T | undefined => chronological(items.filter(match))[0];

/**
 * True when `ids` lists every event exactly once, earliest first. Events in
 * the same year may come in either order.
 */
export function isInOrder<T extends HistoricalYear & { id: string }>(
  ids: readonly string[],
  events: readonly T[],
): boolean {
  if (ids.length !== events.length || new Set(ids).size !== ids.length) return false;
  const byId = new Map(events.map((e) => [e.id, e]));
  const years = ids.map((id) => byId.get(id)?.year);
  if (years.some((y) => y === undefined)) return false;
  return years.every((y, i) => i === 0 || y! >= years[i - 1]!);
}
