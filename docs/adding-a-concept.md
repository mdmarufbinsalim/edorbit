# Adding a concept

Any subject is welcome. Use `packages/concepts/src/orbital-motion/` as the reference implementation, and read [content-standards.md](content-standards.md) first.

## 1. Propose it

Open a "New concept" issue: the hook question, the 2–4 chapter story, the widgets, and the sources or models you will rely on.

## 2. Create the directory

```
packages/concepts/src/<slug>/
├── metadata.ts      title, hook, subject/category, tags, difficulty, card illustration
├── lesson.ts        story chapters (+ quizzes) and limitations
├── widgets/         small hands-on components, one per chapter that needs one
├── missions.ts      goals with a `check` backed by the model
├── equations.ts     "for the curious" maths (STEM)
├── calculators.ts   featured formula + its playground (optional)
├── model.ts         pure logic or data access for this concept
├── simulation.ts    playground spec (optional, model-driven concepts)
├── scene.tsx        3D playground (optional)
├── references.ts    sources
├── index.ts         defineConcept({...}) with lazy widgets and scene
└── <slug>.test.ts   tests for every claim, quiz answer and mission hint
```

## 3. Rules

- Reusable logic goes in a domain package (`packages/physics`, or a new one) with tests and no UI imports.
- Widgets and scenes display model output. They never invent numbers.
- Keep the story short. Move depth into "for the curious".
- No emojis.

## 4. Register it

Add one entry to `packages/concepts/src/registry.ts`:

```ts
{ metadata: myConcept.metadata, module: myConcept },
```

The registry test validates every concept: widget ids, quiz answers, formula references, parameter ranges and unique ids.

## 5. Verify

```sh
pnpm typecheck && pnpm lint && pnpm test
pnpm dev   # open /concepts/<slug>
```

No changes to `apps/web` or other concepts should be needed. If they are, raise it as an architecture issue.
