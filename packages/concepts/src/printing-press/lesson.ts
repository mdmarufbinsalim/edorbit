import type { LessonDefinition } from "@edorbit/core";

export const lesson: LessonDefinition = {
  story: [
    {
      id: "by-hand",
      title: "Copy it by hand",
      body: [
        "Before printing, every book was copied by hand. A skilled scribe (a professional copier) managed about three pages a day, so one book took months.",
        "Around 1450 in Mainz, Johann Gutenberg made a **press with movable type**: metal letters you could arrange into a page, ink, and press onto paper again and again. Race him. Each tap copies one line.",
      ],
      widget: "race",
      quiz: {
        question: "A scribe copies 3 pages a day. How long does a 300-page book take?",
        choices: ["About 2 weeks", "About 100 working days", "About 10 years"],
        answerIndex: 1,
        why: "300 ÷ 3 = 100 working days. That is close to five months of work, for one copy. A press could print hundreds of copies in that time.",
      },
    },
    {
      id: "spreads",
      title: "The idea spreads",
      body: [
        "Printers trained apprentices, packed up their type and moved to new towns. Drag the timeline and watch presses appear across Europe.",
        "Tap a town to see who printed there first.",
      ],
      widget: "spread-map",
      quiz: {
        question: "Which got a press first, Venice or London?",
        choices: ["Venice", "London"],
        answerIndex: 0,
        why: "Venice, in 1469. The first press in England was William Caxton's, at Westminster (now part of London), in 1476.",
      },
    },
    {
      id: "viral",
      title: "Ideas go viral, 1517",
      body: [
        "In 1517 a teacher called Martin Luther wrote 95 arguments, the **Ninety-five Theses**, against the Church selling indulgences (payments said to reduce punishment for sins). Within about two months, printers in other cities were printing them.",
        "Printers in Leipzig, Nuremberg and Basel all printed them before the year was out. Print let one teacher's arguments reach readers far beyond his own town.",
      ],
      quiz: {
        question:
          "Copies of the Theses printed in late 1517 survive from three cities. Which was not one of them?",
        choices: ["Leipzig", "Nuremberg", "Basel", "Paris"],
        answerIndex: 3,
        why: "Printings from late 1517 survive from Leipzig, Nuremberg and Basel. None is known from Paris.",
      },
    },
  ],
  limitations: [
    "The map shows 45 early press towns, not all of them. By 1500 more than 200 towns had had a press.",
    "A first-press year is the earliest dated or datable printing that survives. Some presses started a little earlier. Years marked “c.” are approximate.",
    "The race uses rough averages, which are estimates. Real scribes and printers varied a lot, and a printer spent hours setting the type for each page before printing could start.",
    "“Millions of books” is an estimate. Historians' totals for copies printed by 1500 run from under 10 million to about 20 million.",
    "Each town's language is what most people there spoke. Many early books were printed in Latin, whatever the local language.",
    "Coastlines are modern. A few coasts, such as in the Low Countries, looked a little different then.",
  ],
};
