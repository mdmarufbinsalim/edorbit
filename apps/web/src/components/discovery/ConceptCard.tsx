import Link from "next/link";
import type { ConceptMetadata } from "@orbital/core";

export function ConceptCard({ concept }: { concept: ConceptMetadata }) {
  return (
    <Link
      href={`/concepts/${concept.slug}`}
      className="group block rounded-xl border border-space-700 bg-space-900/60 p-6 transition-colors hover:border-accent/60 focus-visible:outline-2 focus-visible:outline-accent"
    >
      <p className="font-mono text-xs uppercase tracking-widest text-accent-muted">
        {concept.category} · {concept.difficulty} · {concept.estimatedMinutes} min
      </p>
      <h2 className="mt-3 text-lg font-semibold text-slate-50 group-hover:text-accent">
        {concept.title}
      </h2>
      <p className="mt-2 text-sm text-slate-400">{concept.question}</p>
    </Link>
  );
}
