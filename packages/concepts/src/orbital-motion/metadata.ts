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
    alt: "Newton's cannon on a mountain at the top of the Earth. Two shots curve down and land, a third goes all the way round as an orbit, passing a little satellite.",
    strokes: [
      // stars and moon (background)
      { d: "M38 30 L38 42 M32 36 L44 36", width: 2, faint: true },
      { d: "M262 22 L262 32 M257 27 L267 27", width: 2, faint: true },
      { d: "M196 46 L196 54 M192 50 L200 50", width: 1.8, faint: true },
      { d: "M70 78 L70 86 M66 82 L74 82", width: 1.8, faint: true },
      { d: "M296 52 a13 13 0 1 1 -26 0 a13 13 0 1 1 26 0 Z", fill: true },
      {
        d: "M288 47 a3 3 0 1 1 -6 0 a3 3 0 1 1 6 0 M281 58 a2 2 0 1 1 -4 0 a2 2 0 1 1 4 0",
        width: 1.5,
        faint: true,
      },
      // the orbit (drawn first so Earth covers its lower half)
      { d: "M 15 160 A 115 62 0 1 1 245 160", dashed: true },
      // Earth: horizon, latitude arcs, a continent squiggle
      { d: "M 58 200 A 72 72 0 0 1 202 200 Z", fill: true },
      { d: "M 76 168 Q 130 150 184 168", width: 1.8, faint: true },
      { d: "M 66 188 Q 130 172 194 188", width: 1.8, faint: true },
      {
        d: "M 100 140 C 108 132, 120 136, 118 146 C 116 154, 104 152, 100 140 Z M 150 156 C 160 150, 170 156, 166 164 C 160 170, 150 166, 150 156 Z",
        width: 1.8,
      },
      // mountain and cannon
      { d: "M 112 132 L 130 104 L 148 132", fill: true },
      { d: "M 124 100 L 142 96 L 143 102 L 125 106 Z", fill: true, width: 2.2 },
      { d: "M 127 108 a4 4 0 1 1 -0.1 0", width: 2 },
      // two shots that land
      { d: "M 144 99 Q 168 96 176 145" },
      { d: "M 144 99 Q 192 92 196 171", dashed: true },
      // satellite with solar panels on the orbit
      { d: "M 226 128 l 10 -4 l 4 10 l -10 4 Z", fill: true, width: 2.2 },
      { d: "M 226 130 l -14 6 M 240 128 l 14 -6", width: 2.2 },
      { d: "M 210 132 l 4 10 l -6 2 l -4 -10 Z M 252 116 l 4 10 l 6 -2 l -4 -10 Z", width: 2 },
      // speed lines
      { d: "M 214 116 l -14 2 M 218 108 l -12 0", width: 1.8, faint: true },
    ],
  },
};
