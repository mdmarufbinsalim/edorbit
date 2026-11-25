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
    ? {
        title: concept.metadata.title,
        description: concept.metadata.hook ?? concept.metadata.description,
      }
    : {};
}

export default async function ConceptPage({ params }: PageProps<"/concepts/[slug]">) {
  const { slug } = await params;
  const concept = conceptRegistry.get(slug);
  if (!concept) notFound();
  const { metadata } = concept;

  return (
    <main className="site-px">
      {concept.module ? (
        <ConceptView slug={slug} />
      ) : (
        <div className="max-w-3xl space-y-6 py-24">
          <h1 className="text-4xl leading-tight font-medium sm:text-6xl">{metadata.title}</h1>
          <p className="text-xl text-muted">{metadata.hook ?? metadata.question}</p>
          <p className="text-lg">This one is still being built.</p>
          <Link href="/" className="inline-block text-lg underline decoration-2 underline-offset-4">
            ← Try another concept
          </Link>
        </div>
      )}
    </main>
  );
}
