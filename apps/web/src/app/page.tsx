import { conceptRegistry } from "@orbital/concepts";
import { ConceptCard } from "@/components/discovery/ConceptCard";

export default function HomePage() {
  const concepts = conceptRegistry.list();
  return (
    <main className="mx-auto max-w-6xl px-6 py-20">
      <h1 className="font-mono text-sm tracking-[0.4em] text-accent">ORBITAL</h1>
      <p className="mt-6 max-w-2xl text-3xl font-semibold text-slate-50 sm:text-4xl">
        Understand the mathematics. Explore the phenomenon. Experiment with the physics.
      </p>
      <section aria-label="Concepts" className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {concepts.map(({ metadata, module }) => (
          <ConceptCard key={metadata.slug} concept={metadata} available={!!module} />
        ))}
      </section>
    </main>
  );
}
