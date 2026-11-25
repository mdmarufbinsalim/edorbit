import { conceptRegistry } from "@orbital/concepts";
import { ConceptCard } from "@/components/discovery/ConceptCard";
import { Hero } from "@/components/discovery/Hero";

export default function HomePage() {
  const concepts = conceptRegistry.list();
  return (
    <main>
      <Hero />
      <section id="concepts" className="site-px grid gap-8 pb-28 sm:grid-cols-2 lg:grid-cols-3">
        {concepts.map(({ metadata, module }, i) => (
          <ConceptCard key={metadata.slug} concept={metadata} available={!!module} index={i} />
        ))}
      </section>
    </main>
  );
}
