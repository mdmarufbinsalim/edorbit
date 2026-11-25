# Concept proposal: The printing press

Status: built (`packages/concepts/src/printing-press`). First-press dates still need a check against the ISTC by a reviewer.

How one invention in Mainz around 1450 changed Europe in about 50 years. It is clearly history, it has real data we can use, and building it produces the reusable pieces any history concept needs: a timeline, a map and event ordering (see Phase 3 "Widget kit" in [checklist.md](../checklist.md)).

## Hook

> In 1450 copying a book by hand took months. By 1500 Europe had printed millions of books. What happened?

"Millions" is an estimate and must be cited and flagged as approximate.

## Story chapters

1. **Copy it by hand.** A race. You tap to copy lines like a scribe while a press stamps whole pages beside you. A counter shows books per year for each.
   - Copying speeds are estimates. Label them approximate and cite them. The race is a simplified model, not a historical record.
2. **The idea spreads.** Drag a timeline from 1450 to 1500 and watch towns with presses appear on a map of Europe. It uses real dates, for example Mainz in the 1450s, Venice in 1469 and Westminster in 1476.
   - Quiz: "Which got a press first, Venice or London?"
3. **Ideas go viral, 1517.** Luther's writings are reprinted city after city. You watch the reprints spread along trade routes.

## Featured idea: a primary source

A primary source instead of a formula, such as a page from the Gutenberg Bible. Tap parts of the page to learn what they are and why they matter, the same way the formula playground explains each symbol.

The page image needs an MIT-compatible licence, recorded in [assets.md](../assets.md).

## Playground

A timeline-and-map sandbox. Filter by year and by language, and see where printing clustered and why: trade routes, universities, rivers.

## Missions

Each mission checks what the learner did in the widgets, not simulation parameters.

1. Find the year Venice out-printed Mainz.
2. Put five events in order: the press, the first printed Bible, Columbus, Luther, the first newspaper.
3. Find the first press in England, and who ran it.

## For the curious

- **Sources.** For example the Incunabula Short Title Catalogue (ISTC), a database of books printed before 1501.
- **A real debate.** Did printing cause the Reformation and the scientific revolution, or just speed them up? Historians disagree (Elizabeth Eisenstein vs. Adrian Johns). The content standards require presenting both views fairly.
- **Uncertain numbers.** Estimates such as scribe copying speeds are flagged as approximate.

## Facts to source before building

Every item below needs a citation in `references.ts` and a test.

| Claim                         | Working value                      | Notes                                               |
| ----------------------------- | ---------------------------------- | --------------------------------------------------- |
| Gutenberg's press, Mainz      | c. 1450                            | Approximate; flag "c."                              |
| Gutenberg Bible               | c. 1454–1455                       | Approximate                                         |
| First press in Venice         | 1469 (Johann of Speyer)            |                                                     |
| First press in England        | 1476, Westminster (William Caxton) | Answer to mission 3 and the Venice/London quiz      |
| Columbus reaches the Americas | 1492                               |                                                     |
| Luther's Ninety-five Theses   | 1517                               |                                                     |
| First newspaper               | 1605, Strasbourg ("Relation")      | Definitions of "first newspaper" vary; say so       |
| Books printed by 1500         | estimates vary by source           | Cite the estimate used and flag it                  |
| Year Venice out-printed Mainz | from ISTC counts by place and year | Must be computed from the dataset, never hard-coded |

## Platform work this depends on

From Phase 3 of [checklist.md](../checklist.md):

- Optional `simulation` and `Scene` (this concept has no numerical simulation)
- Missions that check widget state or answers
- `Source` with primary vs secondary, archives and licence
- `subject` + `topics[]`, and `era`/`date` metadata
- A pure `packages/history` domain package for dated events, places and citations
- Widgets: timeline, map with markers and routes, ordering challenge

## Data

- Press towns and first-print years: derived from ISTC, stored as content data in `packages/history` (or the concept's `model.ts`), with the extraction method documented.
- Trade routes and rivers for the map: simplified, sourced and labelled as simplified.
- Check ISTC's terms of use before bundling any derived data.
