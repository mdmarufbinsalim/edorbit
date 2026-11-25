# Concept: The printing press

Status: built, in `packages/concepts/src/printing-press`. The first history concept, and the first with no numerical simulation.

How one invention in Mainz around 1450 changed Europe in about 50 years. Building it produced the reusable pieces any history concept needs: a timeline, a map, event ordering, missions that check widget state, and sources marked primary or secondary.

## Hook

> In 1450 copying a book by hand took months. By 1500 Europe had printed millions of books. What happened?

"Millions" is an estimate. The page says so and gives the range historians use.

## Story

1. **Copy it by hand** (`race`). You tap to copy lines like a scribe while a 3D hand press prints beside you, on the same work clock. Counters show pages printed and books per year for each. Rates are approximate and labelled.
2. **The idea spreads** (`spread-map`). Drag a timeline from 1450 to 1500 and watch press towns appear on a map of Europe. Tap a town to see its first printer. Quiz: "Which got a press first, Venice or London?"
3. **Ideas go viral, 1517** (no widget). Luther's Ninety-five Theses, and the cities where printings from late 1517 survive: Leipzig, Nuremberg and Basel.

## Featured idea: a primary source

`bible-page`: a drawing of how a Gutenberg Bible page is laid out. Tap a part (columns, type, initial, rubrication, border, and so on) to learn what it is and why it matters. It is a drawing, not a facsimile, so no image licence is needed.

## Playground

`press-playground`: a 3D map of Europe where press towns rise as pillars. Taller means printing for longer. Filter by year (1450–1520) and by the language spoken in the town. Toggle universities and big rivers, and read the share of towns with each. Below it, the "put it in order" challenge.

## Missions

All check what the learner did in the widgets, through the progress store.

| Mission                    | Checks                                                          |
| -------------------------- | --------------------------------------------------------------- |
| Copy one whole page        | 42 lines copied in the race                                     |
| Leave the German lands     | The first non-German press town (computed from data) was opened |
| Put history in order       | The ordering challenge was checked and correct                  |
| Find England's first press | The first English press town (computed from data) was opened    |

"Find the year Venice out-printed Mainz" from the proposal is not built. It needs per-year edition counts by town from the ISTC, which are not in the repository yet. It must be computed from that data, never typed in.

## For the curious

- Sources, each marked primary, secondary or dataset.
- A real debate: did printing cause the Reformation and the scientific revolution, or just speed them up? Eisenstein and Johns, both views presented, plus what they agree on.
- What the concept leaves out, including approximate dates and rates.

## Data

`data.ts` holds 45 press towns (first-press year, printer where the sources agree, language, university, river) and five dated events. Every row cites sources. Uncertain years are flagged `approximate` and shown as "c.".

**Before release:** a reviewer must check every town row against the ISTC place-and-date indexes. The values were compiled from standard references and have not yet been checked row by row.

The coastline comes from Natural Earth (public domain), simplified, in `packages/history/src/geo/europe.ts`. See [assets.md](../assets.md).
