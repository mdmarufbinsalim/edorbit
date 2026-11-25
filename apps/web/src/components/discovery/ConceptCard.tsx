"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ConceptMetadata, TagDefinition } from "@edorbit/core";
import { IllustrationView, SketchBox, tagChipClass } from "@edorbit/ui";
import { tagHref } from "./tag-links";

export function ConceptCard({
  concept,
  available,
  index,
  tags,
}: {
  concept: ConceptMetadata;
  available: boolean;
  index: number;
  tags: readonly TagDefinition[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: "easeOut" }}
      whileHover={available ? { rotate: index % 2 === 0 ? -0.5 : 0.5, y: -4 } : {}}
      className={`h-full ${available ? "" : "opacity-60"}`}
    >
      <SketchBox className="h-full" padding={4} seed={index + 2} dashed={!available}>
        <Link
          href={`/concepts/${concept.slug}`}
          className="block p-6 sm:p-8"
          aria-label={available ? concept.title : `${concept.title} (coming soon)`}
        >
          {concept.illustration && (
            <IllustrationView
              illustration={concept.illustration}
              className="mb-6 w-full"
              delay={0.2 + index * 0.1}
            />
          )}
          <p className="mb-3 text-sm text-muted">
            {concept.estimatedMinutes} min · {concept.difficulty}
            {!available && " · coming soon"}
          </p>
          <h3 className="mb-3 text-2xl leading-snug font-medium">{concept.title}</h3>
          <p className="text-muted">{concept.hook ?? concept.description}</p>
        </Link>
        {tags.length > 0 && (
          <ul className="flex flex-wrap gap-2 px-6 pb-6 sm:px-8 sm:pb-8" aria-label="Tags">
            {tags.map((t) => (
              <li key={t.id}>
                <Link href={tagHref([t.id])} className={tagChipClass()}>
                  {t.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </SketchBox>
    </motion.div>
  );
}
