import type { ConceptMetadata } from "@edorbit/core";

export const metadata: ConceptMetadata = {
  id: "printing-press",
  slug: "printing-press",
  title: "How did one machine flood Europe with books?",
  question:
    "In 1450 copying a book by hand took months. By 1500 Europe had printed millions of books. What happened?",
  description: "Race a scribe, watch presses spread across Europe, and see ideas go viral in 1517.",
  category: "History",
  difficulty: "beginner",
  estimatedMinutes: 20,
  hook: "In 1450 copying a book by hand took months. By 1500 Europe had printed millions of books. What happened?",
  era: { from: 1450, to: 1520, approximate: true },
  tags: [
    "history",
    "inventions",
    "ideas-and-media",
    "reading-maps",
    "using-sources",
    "experimenting",
  ],
  illustration: {
    viewBox: "0 0 320 200",
    alt: "A wooden hand press: two upright posts, a big screw turned by a bar, and a flat plate pressing down on the bed. A printed sheet flies off to one side.",
    strokes: [
      // ground
      { d: "M 70 176 L 240 176", faint: true },
      // the two upright posts and the head beam
      { d: "M 112 46 L 112 176 M 188 46 L 188 176" },
      { d: "M 100 34 L 200 34 L 200 52 L 100 52 Z", fill: true },
      // screw and bar
      { d: "M 150 52 L 150 92", width: 4 },
      { d: "M 150 76 L 222 66", width: 3 },
      { d: "M 228 65.5 a 6 6 0 1 1 -12 0 a 6 6 0 1 1 12 0 Z", fill: true },
      // platen pressing down
      { d: "M 126 92 L 174 92 L 174 102 L 126 102 Z", fill: true },
      // bed with the type on it
      { d: "M 72 120 L 228 120 L 228 130 L 72 130 Z", fill: true },
      { d: "M 132 114 L 168 114 L 168 120 L 132 120 Z", fill: true, width: 2 },
      // a printed sheet flying off, with lines of text
      { d: "M 244 92 L 280 84 L 288 116 L 252 124 Z", fill: true },
      { d: "M 252 96 L 276 91 M 254 103 L 278 98 M 256 110 L 280 105", faint: true, width: 2 },
      { d: "M 196 112 Q 220 90 240 96", dashed: true, faint: true },
    ],
  },
};
