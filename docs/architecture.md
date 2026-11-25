# Architecture

ORBITAL separates _what is true_ (physics) from _how it is shown_ (rendering) and _how it is taught_ (lessons).

## Packages and allowed dependencies

```
apps/web ──► concepts ──► ui, rendering ──► core
                 │                            ▲
                 └──────► physics ────────────┘
```

| Package              | Responsibility                                                 | May import                            |
| -------------------- | -------------------------------------------------------------- | ------------------------------------- |
| `@orbital/core`      | Concept contracts, simulation clock/engine, SI units           | nothing internal                      |
| `@orbital/physics`   | Pure models, integrators, validation                           | `core`                                |
| `@orbital/rendering` | R3F components: bodies, trails, vectors, labels, cameras       | `core`, React, Three.js               |
| `@orbital/ui`        | Equations, controls, lesson layout                             | `core`, React                         |
| `@orbital/concepts`  | Concept modules (lesson, equations, model, scene, experiments) | all of the above                      |
| `apps/web`           | Routing, layout, discovery, theme                              | `concepts`, `ui`, `rendering`, `core` |

`core` and `physics` must never import React, Three.js, or UI packages. ESLint (`no-restricted-imports`) enforces this.

## Simulation loop

Rendering runs at display frame rate; physics runs on a fixed timestep driven by `SimulationClock`. Each frame the clock converts elapsed real time × time scale into a whole number of physics steps. Physics state lives outside React state so animation does not trigger rerenders.

## Units

Physics uses SI units exclusively. Rendering converts metres to scene units with an explicit scale. Physical values are never altered for visual convenience.

_This document will be expanded during Phase 1._
