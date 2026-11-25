import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { conceptRegistry } from "@orbital/concepts";

export const dynamicParams = false;

export function generateStaticParams() {
  return conceptRegistry.list().map(({ metadata }) => ({ slug: metadata.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/concepts/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const concept = conceptRegistry.get(slug);
  return concept
    ? { title: concept.metadata.title, description: concept.metadata.description }
    : {};
}

export default async function ConceptPage({ params }: PageProps<"/concepts/[slug]">) {
  const { slug } = await params;
  const concept = conceptRegistry.get(slug);
  if (!concept) notFound();
  const { metadata } = concept;

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <Link
        href="/"
        className="font-mono text-xs tracking-widest text-accent-muted hover:text-accent"
      >
        ← ALL CONCEPTS
      </Link>
      <h1 className="mt-6 text-4xl font-semibold text-slate-50">{metadata.title}</h1>
      <p className="mt-4 text-lg text-slate-300">{metadata.question}</p>
      <p className="mt-2 text-slate-400">{metadata.description}</p>
      <p className="mt-12 rounded-lg border border-dashed border-space-700 p-6 text-sm text-slate-500">
        The learning page (introduction, explanation, mathematics, simulation, experiments,
        references) is built in Phase 1. See checklist.md.
      </p>
    </main>
  );
}
