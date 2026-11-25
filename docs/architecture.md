# Architecture

EdOrbit separates **what is true** (models and data), **how it is shown** (rendering and widgets) and **how it is taught** (the story). That separation is what lets a physics concept and a history concept share one platform.

## Packages and allowed dependencies

```
apps/web ──► concepts ──► ui, rendering ──► core
                 │                            ▲
                 └──────► domain packages ────┘   (physics today; maths, history, … later)
```

| Package              | Responsibility                                                     | May import                            |
| -------------------- | ------------------------------------------------------------------ | ------------------------------------- |
| `@edorbit/core`      | Concept contract, validation, simulation engine, units, formatting | nothing internal                      |
| `@edorbit/physics`   | Pure physics models and integrators (first domain package)         | `core`                                |
| `@edorbit/rendering` | Reusable R3F components                                            | `core`, React, Three.js               |
| `@edorbit/ui`        | Sketch design system, story components, controls                   | `core`, React                         |
| `@edorbit/concepts`  | Concept modules: story, widgets, models, scenes, missions          | all of the above                      |
| `apps/web`           | Routing, layout, discovery, theme                                  | `concepts`, `ui`, `rendering`, `core` |

**Domain packages** (`physics`, and later `maths`, `history`, …) contain pure, tested logic or data. They must never import React, Three.js or UI packages. ESLint enforces this for `core` and `physics` today. Generalising the rule to every domain package is tracked in the checklist.

## The concept contract

A concept is a `ConceptModule` registered in `packages/concepts/src/registry.ts`:

- `metadata`: title, hook, subject, tags, difficulty, card illustration.
- `lesson.story`: short chapters, each with an optional widget and quiz. `lesson.limitations` lists what the concept simplifies.
- `widgets`: small lazily loaded React components used by chapters.
- `formula` + `calculators`: the featured idea and its playground.
- `simulation` + `Scene`: an optional model-driven playground (being made optional for non-numerical subjects).
- `missions`: goals checked against real model output.
- `equations`, `references`: the "for the curious" material.

The app shell renders any module generically and contains no concept-specific logic.

## Simulation loop (for model-driven concepts)

Rendering runs at display frame rate. Models run on a fixed timestep driven by `SimulationClock`. Per-frame state lives outside React. Components read `engine.snapshot()` in frame callbacks, and readouts poll at a modest rate.

## Units

Numerical models use SI units internally and convert only for display. Values are never altered to make a visual more convenient.
