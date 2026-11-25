import type { ConceptMetadata } from "@orbital/core";

export const metadata: ConceptMetadata = {
  id: "hohmann-transfer",
  slug: "hohmann-transfer",
  title: "How do rockets change orbits?",
  question: "How do spacecraft move from one orbit to another efficiently?",
  description:
    "Transfer ellipses, impulsive burns, delta-v budgets, and transfer time between coplanar circular orbits.",
  category: "Orbital mechanics",
  difficulty: "intermediate",
  estimatedMinutes: 20,
  hook: "The laziest way to change orbits. Two kicks and coast.",
  doodle: {
    viewBox: "0 0 120 80",
    d: "M60 40 m-14 0 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0 M60 40 m-34 0 a34 34 0 1 0 68 0 a34 34 0 1 0 -68 0 M74 40 C 74 20, 26 16, 26 40",
  },
  tags: ["delta-v", "maneuvers", "transfer orbit"],
};
