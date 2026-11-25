import type { Debate } from "@edorbit/core";

export const debates: readonly Debate[] = [
  {
    question:
      "Did printing cause the Reformation and the scientific revolution, or just speed them up?",
    perspectives: [
      {
        who: "Elizabeth Eisenstein",
        view: "Printing was an agent of change. Identical copies let scholars compare, correct and build on each other's work, and let reformers like Luther reach huge audiences fast. Without print, these movements would not have happened the way they did.",
        sourceId: "eisenstein",
      },
      {
        who: "Adrian Johns",
        view: "Early printed books were often pirated, changed or full of mistakes, so people did not simply trust them. Printers, booksellers and readers had to build that trust over time. The change came from how people used print, not from the machine alone.",
        sourceId: "johns",
      },
    ],
    common:
      "Both agree that printing mattered a great deal. They disagree about how much the machine did on its own, and how much people and institutions did with it.",
  },
];
