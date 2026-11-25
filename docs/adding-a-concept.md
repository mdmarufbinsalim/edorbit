# Adding a concept

Any subject is welcome. Use `packages/concepts/src/orbital-motion/` as the reference for a model-driven concept, and `packages/concepts/src/printing-press/` for one with no simulation (story, widgets, data and missions only). Read [content-standards.md](content-standards.md) first.

## 1. Propose it

Open a "New concept" issue: the hook question, the 2–4 chapter story, the widgets, and the sources or models you will rely on.

## 2. Create the directory

```
packages/concepts/src/<slug>/
├── metadata.ts      title, hook, subject/category, tags, difficulty, card illustration
├── lesson.ts        story chapters (+ quizzes) and limitations
├── widgets/         small hands-on components, one per chapter that needs one
├── missions.ts      goals with a `check(params, progress)` backed by the model or data
├── data.ts          content data with sources (history, humanities)
├── debates.ts       real disagreements, two or more views (optional)
├── equations.ts     "for the curious" maths (STEM)
├── calculators.ts   featured formula + its playground (optional)
├── model.ts         pure logic or data access for this concept
├── simulation.ts    playground spec (optional, model-driven concepts)
├── scene.tsx        3D playground (optional)
├── references.ts    sources
├── index.ts         defineConcept({...}) with lazy widgets and scene
└── <slug>.test.ts   tests for every claim, quiz answer and mission hint
```

## 3. Concepts without a simulation

Leave out `simulation` and `Scene`. Instead:

- Set `playground: { title, widget }` to a widget key. That widget is the playground, and it can still be 3D (see `printing-press/widgets/MapScene3D.tsx`).
- Use `featured: { kicker, title, widget }` for a featured idea that is not a formula, such as a primary source.
- Write missions against widget progress. Widgets call `useReportProgress()` (`set` or `add`), and missions read the same keys in `check(_, progress)`. Define the keys once in `model.ts`.
- Reuse the kit: `Timeline`, `SketchMap`, `OrderingChallenge` from `@edorbit/ui`, `InkBox`, `InkCylinder`, `GroundLines` from `@edorbit/rendering`, and `@edorbit/history` for dates, chronology checks and the Europe coastline.
- Give every source a `kind` (primary, secondary, dataset) and an `id`, and cite those ids from data rows and debates.

## 4. Rules

- Reusable logic goes in a domain package (`packages/physics`, or a new one) with tests and no UI imports.
- Widgets and scenes display model output. They never invent numbers.
- Keep the story short. Move depth into "for the curious".
- No emojis.

## 5. Register it

Add one entry to `packages/concepts/src/registry.ts`:

```ts
{ metadata: myConcept.metadata, module: myConcept },
```

The registry test validates every concept: widget ids (including `featured` and `playground`), quiz answers, formula references, parameter ranges, debate sources and unique ids.

## 6. Verify

```sh
pnpm typecheck && pnpm lint && pnpm test
pnpm dev   # open /concepts/<slug>
```

No changes to `apps/web` or other concepts should be needed. If they are, raise it as an architecture issue.
