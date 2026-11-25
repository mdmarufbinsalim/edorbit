/** Tags group concepts across subjects. Ids are kebab-case and stable; labels are for display. */
export type TagKind = "subject" | "topic" | "skill";

export interface TagDefinition {
  id: string;
  label: string;
  kind: TagKind;
}

export const TAG_KIND_LABELS: Record<TagKind, string> = {
  subject: "Subject",
  topic: "Topic",
  skill: "You'll practise",
};

/** Concepts that carry every one of `selected` (AND). An empty selection returns everything. */
export function filterByTags<T extends { tags: readonly string[] }>(
  items: readonly T[],
  selected: readonly string[],
): T[] {
  return items.filter((item) => selected.every((t) => item.tags.includes(t)));
}

/** Tags in use, with how many items carry each, in vocabulary order. */
export function tagCounts(
  vocabulary: readonly TagDefinition[],
  items: readonly { tags: readonly string[] }[],
) {
  return vocabulary
    .map((tag) => ({ tag, count: items.filter((i) => i.tags.includes(tag.id)).length }))
    .filter((t) => t.count > 0);
}

/** Problems with a concept's tags: unknown ids, duplicates, or no subject tag. */
export function validateTags(
  tags: readonly string[],
  vocabulary: readonly TagDefinition[],
): string[] {
  const errors: string[] = [];
  const byId = new Map(vocabulary.map((t) => [t.id, t]));
  for (const t of tags) if (!byId.has(t)) errors.push(`Unknown tag "${t}"`);
  if (new Set(tags).size !== tags.length) errors.push("Duplicate tags");
  if (!tags.some((t) => byId.get(t)?.kind === "subject"))
    errors.push("Needs at least one subject tag");
  return errors;
}

/** Parse/serialise the `?tags=a,b` query value. */
export const parseTagParam = (value: string | null | undefined): string[] =>
  value
    ? value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
export const tagParam = (tags: readonly string[]): string => tags.join(",");
