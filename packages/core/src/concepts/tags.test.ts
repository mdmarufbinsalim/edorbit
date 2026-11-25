import { describe, expect, it } from "vitest";
import {
  filterByTags,
  parseTagParam,
  tagCounts,
  tagParam,
  validateTags,
  type TagDefinition,
} from "./tags";

const vocab: TagDefinition[] = [
  { id: "physics", label: "Physics", kind: "subject" },
  { id: "history", label: "History", kind: "subject" },
  { id: "space", label: "Space", kind: "topic" },
];
const items = [
  { id: "a", tags: ["physics", "space"] },
  { id: "b", tags: ["history", "space"] },
  { id: "c", tags: ["history"] },
];

describe("tags", () => {
  it("filters with AND semantics", () => {
    expect(filterByTags(items, []).map((i) => i.id)).toEqual(["a", "b", "c"]);
    expect(filterByTags(items, ["space"]).map((i) => i.id)).toEqual(["a", "b"]);
    expect(filterByTags(items, ["space", "history"]).map((i) => i.id)).toEqual(["b"]);
  });

  it("counts tags in vocabulary order", () => {
    expect(tagCounts(vocab, items).map((t) => [t.tag.id, t.count])).toEqual([
      ["physics", 1],
      ["history", 2],
      ["space", 2],
    ]);
  });

  it("validates against the vocabulary", () => {
    expect(validateTags(["physics", "space"], vocab)).toEqual([]);
    expect(validateTags(["space", "nope", "space"], vocab)).toHaveLength(3);
  });

  it("round-trips the query param", () => {
    expect(parseTagParam(tagParam(["a", "b"]))).toEqual(["a", "b"]);
    expect(parseTagParam(null)).toEqual([]);
  });
});
