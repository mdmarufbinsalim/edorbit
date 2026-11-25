"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  TAG_KIND_LABELS,
  filterByTags,
  parseTagParam,
  tagCounts,
  type ConceptMetadata,
  type TagDefinition,
  type TagKind,
} from "@edorbit/core";
import { tagChipClass } from "@edorbit/ui";
import { ConceptCard } from "./ConceptCard";
import { tagHref } from "./tag-links";

export interface BrowsableConcept {
  metadata: ConceptMetadata;
  available: boolean;
  tags: readonly string[];
}

/** Concept grid with a tag filter bar. The selection lives in `?tags=` so filtered views are shareable. */
export function ConceptBrowser({
  concepts,
  vocabulary,
}: {
  concepts: readonly BrowsableConcept[];
  vocabulary: readonly TagDefinition[];
}) {
  const router = useRouter();
  const selected = parseTagParam(useSearchParams().get("tags"));
  const shown = filterByTags(concepts, selected);
  const counts = tagCounts(vocabulary, concepts);
  const byId = new Map(vocabulary.map((t) => [t.id, t]));
  const kinds = (Object.keys(TAG_KIND_LABELS) as TagKind[]).filter((k) =>
    counts.some((c) => c.tag.kind === k),
  );

  const toggle = (id: string) => {
    const next = selected.includes(id) ? selected.filter((t) => t !== id) : [...selected, id];
    router.replace(tagHref(next), { scroll: false });
  };

  return (
    <div className="space-y-10">
      <div className="space-y-3" role="group" aria-label="Filter by tag">
        {kinds.map((kind) => (
          <div key={kind} className="flex flex-wrap items-center gap-2">
            <span className="w-32 shrink-0 text-sm text-muted">{TAG_KIND_LABELS[kind]}</span>
            {counts
              .filter((c) => c.tag.kind === kind)
              .map(({ tag, count }) => (
                <button
                  key={tag.id}
                  type="button"
                  aria-pressed={selected.includes(tag.id)}
                  onClick={() => toggle(tag.id)}
                  className={tagChipClass(selected.includes(tag.id))}
                >
                  {tag.label} <span className="opacity-60">{count}</span>
                </button>
              ))}
          </div>
        ))}
        {selected.length > 0 && (
          <button
            type="button"
            onClick={() => router.replace(tagHref([]), { scroll: false })}
            className="text-sm underline decoration-2 underline-offset-4"
          >
            Clear filters
          </button>
        )}
      </div>

      <p className="text-sm text-muted" aria-live="polite">
        {shown.length} {shown.length === 1 ? "concept" : "concepts"}
        {selected.length > 0 &&
          ` tagged ${selected.map((id) => byId.get(id)?.label ?? id).join(" + ")}`}
      </p>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((c, i) => (
            <motion.div key={c.metadata.slug} layout exit={{ opacity: 0, scale: 0.96 }}>
              <ConceptCard
                concept={c.metadata}
                available={c.available}
                index={i}
                tags={c.tags.map((t) => byId.get(t)).filter((t): t is TagDefinition => !!t)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        {shown.length === 0 && (
          <p className="text-lg text-muted">
            Nothing with all those tags yet. Want to build one? See CONTRIBUTING.md.
          </p>
        )}
      </div>
    </div>
  );
}
