import type { ConceptMetadata } from "./types";

/**
 * Minimal registry used by the application shell. It knows only metadata, so
 * the shell never imports concept-specific physics or scenes.
 */
export class ConceptRegistry<Entry extends { metadata: ConceptMetadata }> {
  private readonly bySlug = new Map<string, Entry>();

  constructor(entries: readonly Entry[] = []) {
    for (const entry of entries) this.register(entry);
  }

  register(entry: Entry): void {
    const { slug } = entry.metadata;
    if (this.bySlug.has(slug)) throw new Error(`Duplicate concept slug: ${slug}`);
    this.bySlug.set(slug, entry);
  }

  get(slug: string): Entry | undefined {
    return this.bySlug.get(slug);
  }

  list(): Entry[] {
    return [...this.bySlug.values()];
  }
}
