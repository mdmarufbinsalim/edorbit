import { firstWhere, spreadDays, upTo, type SpreadOptions } from "@edorbit/history";
import { pressTowns, routes, THESES_START, townById, type PressTown } from "./data";

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

/* ---------- 1517: a thought experiment ---------- */

/** Luther's Theses are traditionally dated 31 October 1517. Day 0 of the model. */
export const THESES_DATE = { year: 1517, month: 10, day: 31 } as const;
/** Days from 31 October to 31 December 1517. */
export const DAYS_TO_YEAR_END = 61;

export const SPREAD_DEFAULTS = { kmPerDay: 30, reprintDays: 21 } as const;
export const SPREAD_RANGES = {
  kmPerDay: { min: 10, max: 60, step: 5 },
  reprintDays: { min: 3, max: 40, step: 1 },
} as const;

const network = {
  places: Object.fromEntries(
    pressTowns.filter((t) => t.year <= THESES_DATE.year).map((t) => [t.id, t.lonLat]),
  ),
  routes,
};

/** Day each town has its own printed copies, for a given travel speed and reprint time. */
export const thesesSpread = ({
  kmPerDay,
  reprintDays,
}: {
  kmPerDay: number;
  reprintDays: number;
}) =>
  spreadDays(network, THESES_START, {
    metresPerDay: kmPerDay * 1000,
    reprintDays,
  } satisfies SpreadOptions);

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/** Calendar date `days` after 31 October 1517 (Julian calendar, as used then). */
export function dateAfterTheses(days: number): string {
  let year: number = THESES_DATE.year;
  let month: number = THESES_DATE.month - 1;
  let day = THESES_DATE.day + Math.floor(days);
  for (;;) {
    const len = DAYS_IN_MONTH[month]! + (month === 1 && year % 4 === 0 ? 1 : 0);
    if (day <= len) break;
    day -= len;
    month++;
    if (month === 12) {
      month = 0;
      year++;
    }
  }
  return `${day} ${MONTHS[month]} ${year}`;
}

/* ---------- Progress keys shared by widgets and missions ---------- */

export const PROGRESS = {
  /** Lines the learner has copied in the race. */
  raceLines: "race-lines",
  /** Town ids the learner has opened on any map. */
  townsOpened: "towns-opened",
  /** True once the ordering challenge was checked and correct. */
  eventOrder: "event-order",
  /** Current settings of the 1517 thought experiment. */
  spreadKmPerDay: "spread-km-per-day",
  spreadReprintDays: "spread-reprint-days",
  /** Parts of the Bible page the learner has tapped. */
  pageParts: "page-parts",
} as const;

export const townLabel = (id: string) => townById.get(id)?.name ?? id;
