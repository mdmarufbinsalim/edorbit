import type { ConceptMetadata } from "@orbital/core";

export const metadata: ConceptMetadata = {
  id: "tidal-forces",
  slug: "tidal-forces",
  title: "Why does the Moon make tides?",
  question: "Why does the Moon create two tidal bulges on Earth?",
  description:
    "Differential gravitational acceleration, the equilibrium tide model, and spring and neap tides.",
  category: "Orbital mechanics",
  difficulty: "intermediate",
  estimatedMinutes: 25,
  hook: "Why the sea goes up and down twice a day.",
  doodle: {
    viewBox: "0 0 120 80",
    d: "M40 40 m-22 0 a22 18 0 1 0 44 0 a22 18 0 1 0 -44 0 M40 40 m-14 0 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0 M104 40 m-7 0 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0",
  },
  tags: ["tides", "differential gravity", "moon", "sun"],
};
