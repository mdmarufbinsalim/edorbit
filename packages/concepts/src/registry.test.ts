import { describe, expect, it } from "vitest";
import { conceptRegistry } from "./registry";

describe("concept registry", () => {
  it("registers the five launch concepts with unique slugs", () => {
    const slugs = conceptRegistry.list().map((c) => c.metadata.slug);
    expect(slugs).toHaveLength(5);
    expect(new Set(slugs).size).toBe(5);
  });
});
