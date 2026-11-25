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
    alt: "A cannon on a mountain at the top of the Earth. One shot curves down and lands. Another, faster one goes all the way round as an orbit.",
    strokes: [
      // the orbit: concentric with Earth, passing the cannon's muzzle
      { d: "M 24 196 A 141 141 0 0 1 296 196", dashed: true },
      { d: "M 268.5 131.9 L 270 141.8 L 260.7 138.2" },
      // Earth's horizon
      { d: "M 44 200 A 120 120 0 0 1 276 200 Z", fill: true },
      // mountain and cannon
      { d: "M 146 112 L 160 92 L 174 112", fill: true },
      { d: "M 156 85 L 174 85 L 174 91 L 156 91 Z", fill: true, width: 2.2 },
      // a slower shot that lands
      { d: "M 176 88 Q 199 86 205 119" },
      // a quiet sky
      { d: "M 74 50 a 12 12 0 1 1 -24 0 a 12 12 0 1 1 24 0 Z", faint: true, width: 2 },
      { d: "M 252 34 L 252 46 M 246 40 L 258 40", faint: true, width: 2 },
    ],
  },
};
