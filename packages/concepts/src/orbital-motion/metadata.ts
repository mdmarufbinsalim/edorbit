import type { ConceptMetadata } from "@orbital/core";

export const metadata: ConceptMetadata = {
  id: "orbital-motion",
  slug: "orbital-motion",
  title: "Why don't satellites fall down?",
  question: "Why do moons and satellites go round and round instead of crashing or flying away?",
  description: "Fire a cannon into orbit and discover Kepler's three laws.",
  category: "Physics",
  difficulty: "beginner",
  estimatedMinutes: 20,
  hook: "Spoiler: the space station is falling. All the time.",
  doodle: {
    viewBox: "0 0 120 80",
    d: "M60 40 m-12 0 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0 M60 40 m-48 0 a48 26 0 1 0 96 0 a48 26 0 1 0 -96 0 M106 34 l4 6 l-6 3",
  },
  tags: ["gravity", "kepler", "vis-viva", "ellipse"],
};
