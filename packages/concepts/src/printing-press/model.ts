import { firstWhere, upTo } from "@edorbit/history";
import { pressTowns, townById, type PressTown } from "./data";

/* ---------- Copy by hand vs. print: approximate rates ---------- */

/**
 * All approximate, and labelled so on the page. Copying speeds varied a lot
 * with the scribe, the script and the book. Hand-press output estimates for
 * a two-person team run from about 1,000 to over 3,000 page impressions a day.
 */
export const RATES = {
  /** Pages a skilled scribe could copy in a working day. */
  scribePagesPerDay: 3,
  /** Pages a two-person press team could print in a working day, once the type was set. */
  pressPagesPerDay: 1_500,
  /** Lines per page in the Gutenberg Bible, which is why it is called the 42-line Bible. */
  linesPerPage: 42,
  hoursPerDay: 8,
  workingDaysPerYear: 250,
  /** A mid-sized book, for the books-per-year counters. */
  bookPages: 300,
} as const;

/** Working minutes a scribe spends on one line. */
export const MINUTES_PER_LINE =
  (RATES.hoursPerDay * 60) / (RATES.scribePagesPerDay * RATES.linesPerPage);

/** Pages the press prints in the time a scribe copies `lines` lines. */
export const pressPagesDuring = (lines: number) =>
  (lines * MINUTES_PER_LINE * RATES.pressPagesPerDay) / (RATES.hoursPerDay * 60);

/** Copies of a `RATES.bookPages`-page book made in a working year. */
export const booksPerYear = (pagesPerDay: number) =>
  (pagesPerDay * RATES.workingDaysPerYear) / RATES.bookPages;

/** Working days to copy one book by hand. */
export const daysToCopyBook = () => RATES.bookPages / RATES.scribePagesPerDay;

/** "2 h 40 min" style, for the race clock. */
export function formatWorkTime(minutes: number): string {
  const days = Math.floor(minutes / (RATES.hoursPerDay * 60));
  const rest = minutes - days * RATES.hoursPerDay * 60;
  const h = Math.floor(rest / 60);
  const m = Math.round(rest - h * 60);
  const parts = [days ? `${days} day${days > 1 ? "s" : ""}` : "", h ? `${h} h` : "", `${m} min`];
  return parts.filter(Boolean).join(" ");
}

/* ---------- The spread of presses ---------- */

export const MAP_YEARS = { from: 1450, to: 1500 } as const;

export const townsBy = (year: number) => upTo(pressTowns, year);

/** The first town on the map whose people did not speak German. */
export const firstNonGermanTown = (): PressTown =>
  firstWhere(pressTowns, (t) => t.language !== "German")!;

/** The first press town in England. */
export const firstEnglishTown = (): PressTown =>
  firstWhere(pressTowns, (t) => t.language === "English")!;

export const languages = [...new Set(pressTowns.map((t) => t.language))];

/** Share (0–1) of `towns` with a university, and on a major river. */
export function clusterStats(towns: readonly PressTown[]) {
  const n = towns.length || 1;
  return {
    count: towns.length,
    university: towns.filter((t) => t.university).length / n,
    river: towns.filter((t) => t.river).length / n,
  };
}

/* ---------- Progress keys shared by widgets and missions ---------- */

export const PROGRESS = {
  /** Lines the learner has copied in the race. */
  raceLines: "race-lines",
  /** Town ids the learner has opened on any map. */
  townsOpened: "towns-opened",
  /** True once the ordering challenge was checked and correct. */
  eventOrder: "event-order",
  /** Parts of the Bible page the learner has tapped. */
  pageParts: "page-parts",
} as const;

export const townLabel = (id: string) => townById.get(id)?.name ?? id;
