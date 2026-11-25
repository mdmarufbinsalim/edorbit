import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { conceptRegistry } from "@orbital/concepts";
import { ConceptView } from "@/components/concept/ConceptView";

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
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Link
        href="/"
        className="font-mono text-xs tracking-widest text-accent-muted hover:text-accent"
      >
        ← ALL CONCEPTS
      </Link>
      <div className="mt-6">
        {concept.module ? (
          <ConceptView slug={slug} />
        ) : (
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold text-slate-50">{metadata.title}</h1>
            <p className="text-lg text-slate-300">{metadata.question}</p>
            <p className="text-slate-400">{metadata.description}</p>
            <p className="rounded-lg border border-dashed border-space-700 p-6 text-sm text-slate-500">
              This concept is planned and not yet implemented. Contributions are welcome — see
              CONTRIBUTING.md.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
