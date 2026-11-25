"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ConceptMetadata } from "@orbital/core";
import { SketchBox } from "@orbital/ui";

export function ConceptCard({
  concept,
  available,
  index,
}: {
  concept: ConceptMetadata;
  available: boolean;
  index: number;
}) {
  const body = (
    <SketchBox className="h-full p-6 sm:p-8" padding={4} seed={index + 2} dashed={!available}>
      {concept.doodle && (
        <svg
          viewBox={concept.doodle.viewBox}
          className="mb-6 h-20 w-auto"
          fill="none"
          aria-hidden="true"
        >
          <motion.path
            d={concept.doodle.d}
            stroke="var(--ink)"
            strokeWidth={2.5}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.3 + index * 0.1, ease: "easeInOut" }}
          />
        </svg>
      )}
      <p className="mb-3 text-sm text-muted">
        {concept.category} · {concept.estimatedMinutes} min · {concept.difficulty}
        {!available && " · coming soon"}
      </p>
      <h3 className="mb-3 text-2xl leading-snug font-medium">{concept.title}</h3>
      <p className="text-muted">{concept.hook ?? concept.description}</p>
    </SketchBox>
  );
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: "easeOut" }}
      whileHover={available ? { rotate: index % 2 === 0 ? -0.6 : 0.6, y: -4 } : {}}
      className={`h-full ${available ? "" : "opacity-60"}`}
    >
      {available ? (
        <Link href={`/concepts/${concept.slug}`} className="block h-full">
          {body}
        </Link>
      ) : (
        <Link
          href={`/concepts/${concept.slug}`}
          className="block h-full"
          aria-label={`${concept.title} (coming soon)`}
        >
          {body}
        </Link>
      )}
    </motion.div>
  );
}
