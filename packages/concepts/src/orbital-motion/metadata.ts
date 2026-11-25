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
  tags: [
    "physics",
    "space",
    "gravity",
    "motion",
    "history-of-science",
    "experimenting",
    "predicting",
    "using-formulas",
  ],
  illustration: {
    viewBox: "0 0 320 200",
    alt: "A satellite on a dashed circular orbit around Earth. One arrow shows it moving sideways along the orbit, another shows gravity pulling it towards Earth.",
    strokes: [
      // orbit, well clear of Earth
      { d: "M 80 100 a 80 80 0 1 1 160 0 a 80 80 0 1 1 -160 0", dashed: true },
      // Earth
      { d: "M 118 100 a 42 42 0 1 1 84 0 a 42 42 0 1 1 -84 0 Z", fill: true },
      // satellite
      { d: "M 222.6 43.4 a 6 6 0 1 1 -12 0 a 6 6 0 1 1 12 0 Z", width: 3, fill: true },
      // sideways speed: along the orbit
      { d: "M 223 50 L 245 72 M 242.4 63.4 L 245 72 L 236.4 69.4" },
      // gravity: towards Earth
      { d: "M 210.2 49.8 L 198.2 61.8 M 205.9 59.5 L 198.2 61.8 L 200.6 54.2", faint: true },
      // one quiet star
      { d: "M 52 36 L 52 46 M 47 41 L 57 41", faint: true, width: 2 },
    ],
  },
};
