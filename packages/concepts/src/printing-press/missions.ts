import type { MissionDefinition } from "@edorbit/core";
import { isInOrder } from "@edorbit/history";
import { formatYear } from "@edorbit/history";
import type { NoParams } from "../types";
import { orderEvents } from "./data";
import { PROGRESS, firstEnglishTown, firstNonGermanTown, pressPagesDuring, RATES } from "./model";

const opened = (progress: Readonly<Record<string, unknown>>) => {
  const v = progress[PROGRESS.townsOpened];
  return Array.isArray(v) ? (v as string[]) : [];
};
const num = (v: unknown, fallback: number) => (typeof v === "number" ? v : fallback);

const abroad = firstNonGermanTown();
const england = firstEnglishTown();

export const missions: readonly MissionDefinition<NoParams>[] = [
  {
    id: "page",
    title: "Copy one whole page",
    goal: `In the race, copy all ${RATES.linesPerPage} lines of a page by hand.`,
    hint: `Keep tapping **Copy a line**. A page of the Gutenberg Bible has ${RATES.linesPerPage} lines.`,
    explain:
      "The race keeps both of you on the same clock. Each line costs a scribe a few minutes of work, while the press stamps whole pages over and over.",
    check: (_, p) => num(p[PROGRESS.raceLines], 0) >= RATES.linesPerPage,
    success: `By the time your one page was done, the press had printed about ${Math.round(pressPagesDuring(RATES.linesPerPage)).toLocaleString("en-US")} pages.`,
  },
  {
    id: "abroad",
    title: "Leave the German lands",
    goal: "On a map, find and tap the first town outside the German-speaking lands to get a press.",
    hint: "Drag the timeline slowly through the 1460s. Look south, near Rome.",
    explain:
      "Printing spread first through German towns, because Gutenberg's workers and apprentices were German. Then they took their skills abroad, often to rich cities that would buy books.",
    check: (_, p) => opened(p).includes(abroad.id),
    success: `${abroad.name}, ${formatYear(abroad)}. ${abroad.printer}, two German printers, set up in a monastery there.`,
  },
  {
    id: "order",
    title: "Put history in order",
    goal: `In the playground, put ${orderEvents.length} events in order, then check.`,
    hint: "The press comes first. The newspaper is the newest: it is from the 1600s.",
    explain:
      "Putting events in order is how historians start to untangle cause and effect. A cause has to come before the thing it causes.",
    check: (_, p) => p[PROGRESS.eventOrder] === true,
    success:
      "Press, Bible, Columbus, Luther, newspaper. In about 150 years print went from one workshop to news for anyone who could read.",
  },
  {
    id: "england",
    title: "Find England's first press",
    goal: "Tap the first press town in England on a map, and find out who ran it.",
    hint: "Look in the 1470s, right next to London.",
    explain:
      "England got printing later than Italy or France. A merchant who had learned to print abroad brought a press home.",
    check: (_, p) => opened(p).includes(england.id),
    success: `${england.name}, ${formatYear(england)}. ${england.printer} had learned printing in Bruges, where he printed the first book in English.`,
  },
];

export const eventsInOrder = (ids: readonly string[]) => isInOrder(ids, orderEvents);
