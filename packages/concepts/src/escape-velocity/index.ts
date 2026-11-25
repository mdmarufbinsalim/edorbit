import type { ConceptMetadata } from "@orbital/core";

export const metadata: ConceptMetadata = {
  id: "escape-velocity",
  slug: "escape-velocity",
  title: "How fast to escape Earth?",
  question: "How fast must something travel to escape a planet's gravity?",
  description:
    "Kinetic and potential energy, specific orbital energy, and the boundary between bound and unbound trajectories.",
  category: "Orbital mechanics",
  difficulty: "beginner",
  estimatedMinutes: 15,
  hook: "How hard do you have to throw to never come back?",
  doodle: {
    viewBox: "0 0 120 80",
    d: "M20 70 A40 40 0 0 1 60 30 M60 30 C 75 20, 95 12, 115 6 M60 30 C 70 40, 72 55, 66 70 M52 30 l8 0",
  },
  tags: ["energy", "escape velocity", "potential well"],
};
