# Architecture

EdOrbit separates **what is true** (models and data), **how it is shown** (rendering and widgets) and **how it is taught** (the story). That separation is what lets a physics concept and a history concept share one platform.

## Packages and allowed dependencies

```
apps/web ──► concepts ──► ui, rendering ──► core
                 │                            ▲
                 └──────► domain packages ────┘   (physics, history; maths, … later)
```

| Package              | Responsibility                                                     | May import                            |
| -------------------- | ------------------------------------------------------------------ | ------------------------------------- |
| `@edorbit/core`      | Concept contract, validation, simulation engine, units, formatting | nothing internal                      |
| `@edorbit/physics`   | Pure physics models and integrators                                | `core`                                |
| `@edorbit/history`   | Dated events, places, chronology checks, map data                  | `core`                                |
| `@edorbit/rendering` | Reusable R3F components                                            | `core`, React, Three.js               |
| `@edorbit/ui`        | Sketch design system, story components, controls                   | `core`, React                         |
| `@edorbit/concepts`  | Concept modules: story, widgets, models, scenes, missions          | all of the above                      |
| `apps/web`           | Routing, layout, discovery, theme                                  | `concepts`, `ui`, `rendering`, `core` |

**Domain packages** (`physics`, and later `maths`, `history`, …) contain pure, tested logic or data. They must never import React, Three.js or UI packages. ESLint enforces this for every package listed in `PURE_PACKAGES` in `eslint.config.mjs`. Add new domain packages there.

`@edorbit/core` also holds subject-agnostic geography (`geo/`: projection, great-circle distance, SVG paths), used by any concept with a map.

## The concept contract

A concept is a `ConceptModule` registered in `packages/concepts/src/registry.ts`:

- `metadata`: title, hook, subject, tags, difficulty, card illustration.
- `lesson.story`: short chapters, each with an optional widget and quiz. `lesson.limitations` lists what the concept simplifies.
- `widgets`: small lazily loaded React components used by chapters.
- `formula` + `calculators`: a featured equation and its playground (STEM).
- `featured`: a featured idea that is not a formula, shown as a widget, e.g. a primary source to explore.
- `simulation` + `Scene`: an optional model-driven 3D playground. They come as a pair.
- `playground`: the playground title, and for concepts without a simulation, the widget that is the playground.
- `missions`: goals whose `check(params, progress)` uses real model output, or what the learner did in the widgets.
- `equations`, `references` (`Source`, marked primary, secondary or dataset), `debates`: the "for the curious" material.
- `metadata.era`: the period a historical concept covers.

## Widget progress

Widgets report what the learner did (a tapped town, a solved puzzle) through `useReportProgress()` from `@edorbit/ui`. The concept page wraps everything in a `ProgressProvider`, and `MissionList` passes the collected `ActivityProgress` to each mission's `check`. Progress keys are defined once in the concept's `model.ts` and shared by widgets, missions and tests.

The app shell renders any module generically and contains no concept-specific logic.

## Simulation loop (for model-driven concepts)

Rendering runs at display frame rate. Models run on a fixed timestep driven by `SimulationClock`. Per-frame state lives outside React. Components read `engine.snapshot()` in frame callbacks, and readouts poll at a modest rate.

## Units

Numerical models use SI units internally and convert only for display. Values are never altered to make a visual more convenient.
