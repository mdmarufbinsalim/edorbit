import { describe, expect, it } from "vitest";
import { lesson } from "./lesson";
import { missions, eventsInOrder } from "./missions";
import { ORDER_START, orderEvents, pressTowns, townById } from "./data";
import {
  PROGRESS,
  booksPerYear,
  daysToCopyBook,
  firstEnglishTown,
  firstNonGermanTown,
  RATES,
} from "./model";
import { references } from "./references";

const m = (id: string) => missions.find((x) => x.id === id)!;
const quiz = (id: string) => lesson.story.find((c) => c.id === id)!.quiz!;
const sourceIds = new Set(references.map((r) => r.id));

describe("data", () => {
  it("every town and event cites known sources", () => {
    for (const t of [...pressTowns, ...orderEvents])
      for (const s of t.sourceIds) expect(sourceIds.has(s)).toBe(true);
  });
});

describe("story claims hold", () => {
  it("a 300-page book takes about 100 working days by hand", () => {
    expect(daysToCopyBook()).toBe(100);
    expect(quiz("by-hand").choices[quiz("by-hand").answerIndex]).toContain("100");
    expect(booksPerYear(RATES.pressPagesPerDay)).toBeGreaterThan(100 * booksPerYear(3));
  });
  it("Venice got a press before Westminster (London)", () => {
    expect(townById.get("venice")!.year).toBeLessThan(townById.get("westminster")!.year);
    expect(quiz("spreads").choices[quiz("spreads").answerIndex]).toBe("Venice");
  });
  it("Paris is not one of the 1517 reprint towns", () => {
    expect(quiz("viral").choices[quiz("viral").answerIndex]).toBe("Paris");
  });
});

describe("missions are achievable with their hints", () => {
  it("page", () => {
    expect(m("page").check({}, {})).toBe(false);
    expect(m("page").check({}, { [PROGRESS.raceLines]: 42 })).toBe(true);
  });
  it("abroad: Subiaco is the first non-German press town", () => {
    expect(firstNonGermanTown().id).toBe("subiaco");
    expect(m("abroad").check({}, { [PROGRESS.townsOpened]: ["subiaco"] })).toBe(true);
  });
  it("england: Westminster, William Caxton", () => {
    expect(firstEnglishTown().id).toBe("westminster");
    expect(firstEnglishTown().printer).toBe("William Caxton");
    expect(m("england").check({}, { [PROGRESS.townsOpened]: ["westminster"] })).toBe(true);
  });
  it("order: the start order is wrong, the dated order is right", () => {
    expect(eventsInOrder(ORDER_START)).toBe(false);
    expect(eventsInOrder(["press", "bible", "columbus", "luther", "newspaper"])).toBe(true);
    expect(m("order").check({}, { [PROGRESS.eventOrder]: true })).toBe(true);
  });
});
