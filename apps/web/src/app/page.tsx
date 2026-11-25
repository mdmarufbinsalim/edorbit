import { Suspense } from "react";
import { conceptRegistry, tagVocabulary } from "@orbital/concepts";
import { ConceptBrowser, type BrowsableConcept } from "@/components/discovery/ConceptBrowser";
import { Hero } from "@/components/discovery/Hero";

export default function HomePage() {
  // Only serialisable metadata crosses into the client browser.
  const concepts: BrowsableConcept[] = conceptRegistry
    .list()
    .map(({ metadata, module }) => ({ metadata, available: !!module, tags: metadata.tags }));
  return (
    <main>
      <Hero />
      <section id="concepts" className="site-px scroll-mt-24 pb-28">
        <Suspense>
          <ConceptBrowser concepts={concepts} vocabulary={tagVocabulary} />
        </Suspense>
      </section>
    </main>
  );
}
