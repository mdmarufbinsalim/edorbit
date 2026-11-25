import type { ConceptMetadata } from "@orbital/core";

export const metadata: ConceptMetadata = {
  id: "gravity-assist",
  slug: "gravity-assist",
  title: "Slingshot around a planet",
  question: "How can a spacecraft gain or lose speed by flying past a moving planet?",
  description:
    "Hyperbolic flybys and why speed is conserved in the planet frame but changes in the heliocentric frame.",
  category: "Orbital mechanics",
  difficulty: "advanced",
  estimatedMinutes: 25,
  hook: "Steal a little speed from a planet. It won't notice.",
  doodle: {
    viewBox: "0 0 120 80",
    d: "M70 40 m-10 0 a10 10 0 1 0 20 0 a10 10 0 1 0 -20 0 M5 70 C 40 60, 60 52, 66 30 C 70 18, 90 14, 115 4",
  },
  tags: ["flyby", "reference frames", "hyperbolic excess velocity"],
};
