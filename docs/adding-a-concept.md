# Adding a concept

Use `packages/concepts/src/orbital-motion/` as the reference implementation.

## 1. Create the directory

```
packages/concepts/src/<slug>/
├── metadata.ts      ConceptMetadata (title, question, difficulty, …)
├── lesson.ts        LessonDefinition: intro, sections, objectives, limitations
├── equations.ts     EquationDefinition[] with variables, units, assumptions, worked examples
├── calculators.ts   CalculatorDefinition[] bound to equation ids (optional)
├── model.ts         Parameters type + createModel() returning a ScientificModel
├── simulation.ts    SimulationSpec: parameters, derived controls, layers, readouts, timestep
├── experiments.ts   ExperimentDefinition[]: setup, prediction choices, explanation
├── references.ts    ScientificReference[]
├── scene.tsx        Default-exported R3F scene receiving { engine, params, layers }
├── index.ts         defineConcept({...}) with Scene: lazy(() => import("./scene"))
└── <slug>.test.ts   Validation tests for the physics claims in your lesson and experiments
```

## 2. Rules

- Physics that could be reused goes in `packages/physics` with tests. `core` and `physics` must not import React or Three.js (lint-enforced).
- Model state and parameters are in SI units. Convert for display only, using `displayScale` on parameters and unit conversion in readouts and calculators.
- Scenes read state with `engine.snapshot()` inside per-frame getters (`Follow`, `Trail`, `VectorArrow`). Never put per-frame state in React state.
- Scenes must not compute physics. Derive what you draw from the model (`sampleTrajectory`, elements helpers).
- State the model's limitations in `lesson.limitations`. They are shown next to the simulation.

## 3. Register it

Add one entry to `packages/concepts/src/registry.ts`:

```ts
{ metadata: myConcept.metadata, module: myConcept },
```

The registry test runs `validateConcept` on every module. It checks equation references, parameter ranges, experiment setups and readout ids.

## 4. Verify

```sh
pnpm typecheck && pnpm lint && pnpm test
pnpm dev   # open /concepts/<slug>
```

No changes to `apps/web` or other concepts should be needed. If they are, raise it as an architecture issue.
