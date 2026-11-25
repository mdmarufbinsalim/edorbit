# ORBITAL — Development Checklist

Tracks implementation of the ORBITAL specification. Tick items as they land on `main`.

Legend: `[x]` done · `[ ]` to do

---

## Phase 0 — Repository initialisation

- [x] pnpm workspace (`apps/*`, `packages/*`)
- [x] Next.js (App Router) app in `apps/web`
- [x] TypeScript strict mode, shared `tsconfig.base.json`
- [x] Tailwind CSS v4 (plain Tailwind, no component kit) with space theme tokens
- [x] Three.js, React Three Fiber, Drei, Zustand, Framer Motion, KaTeX installed
- [x] Vitest (node + jsdom projects), React Testing Library, Playwright
- [x] ESLint (typescript-eslint, react-hooks, Next) + Prettier
- [x] Lint rule: `core` and `physics` cannot import React / Three.js / UI packages
- [x] Package skeletons: `core`, `physics`, `rendering`, `ui`, `concepts`
- [x] Concept registry with metadata for all five launch concepts
- [x] Discovery page and statically generated `/concepts/[slug]` route
- [x] MIT licence, README, CONTRIBUTING, Code of Conduct, AGENTS.md
- [x] CI workflow (typecheck, lint, test, build)
- [x] PR template and issue templates

## Phase 1 — Platform foundation

> Design/UX is intentionally minimal in Phase 1–2; a dedicated design pass will follow. Components keep styling in thin Tailwind class layers so they can be restyled without touching logic.

### Contracts (`@orbital/core`)

- [x] `ConceptMetadata`, `EquationDefinition`, `LessonDefinition`, `ParameterDefinition`, `ExperimentDefinition`, `ScientificReference`
- [x] `ScientificModel<State, Params>` interface
- [x] `ConceptModule` type in `@orbital/concepts` binding metadata + lesson + equations + model factory + scene + experiments + references
- [x] Runtime validation of concept definitions (unique ids, equation ids referenced by lessons exist, parameter defaults within range)

### Units (`@orbital/core/units`)

- [x] SI type aliases, physical constants (G, AU, Earth, Moon, Sun)
- [x] Display conversions (km, Earth radii, hours, days)
- [x] Unit-aware formatting helpers for readouts (significant figures, scientific notation)

### Simulation lifecycle (`@orbital/core/simulation`)

- [x] Fixed-timestep `SimulationClock` with time scale and step cap
- [x] `SimulationEngine`: play / pause / reset / step-forward / snapshot
- [x] Parameter change → model re-initialisation contract
- [x] Zustand store factory for per-concept simulation + UI state
- [x] `useSimulationLoop` hook driving the engine from R3F `useFrame` without React rerenders
- [x] Web Worker path for expensive models

### Numerical integration (`@orbital/physics/integration`)

- [x] Velocity Verlet
- [x] Leapfrog (kick-drift-kick)
- [x] RK4
- [x] Energy-drift tests against analytical circular/elliptical orbits
- [x] Document stability and timestep limits in `docs/scientific-standards.md`

### Equation rendering (`@orbital/ui/equations`)

- [x] `Equation` component (KaTeX)
- [x] `EquationCard`: name, description, variable table, units, assumptions, validity
- [x] Interactive calculator: inputs bound to variables, live result
- [x] Worked-example block

### Learning page (`@orbital/ui/lesson` + `apps/web`)

- [x] Section layout: introduction → explanation → mathematics → simulation → experiments → references
- [x] Desktop: large simulation area + contextual control panel; mobile: stacked
- [x] In-page section navigation
- [x] "Idealised model" limitation callout component

### Shared controls (`@orbital/ui/controls`)

- [x] Parameter slider (keyboard accessible, unit display)
- [x] Simulation toolbar (play/pause, reset, step, speed)
- [x] Visual layer toggles
- [x] Data readout panel
- [x] Experiment panel (prediction → run → compare)

### Rendering (`@orbital/rendering`)

- [x] `SceneCanvas` (camera, lights, orbit controls)
- [x] Linear SI → scene scale helper
- [x] Celestial body component (shaded sphere, configurable; textures deferred to design pass)
- [x] Trajectory / trail line
- [x] Vector arrow (force, velocity, acceleration)
- [x] Labels and annotations
- [x] Starfield background
- [x] WebGL-unavailable fallback
- [x] Lazy loading of scenes and textures
- [x] Texture attribution file (`docs/assets.md`)

**Deliverable:** application shell with one reusable concept implementation. ✅ (Orbital Motion)

## Phase 2 — First two complete concepts

### 4.1 Orbital Motion and Kepler's Laws

- [x] Lesson content and learning objectives
- [x] Equations: $F = GMm/r^2$, vis-viva, Kepler's third law
- [x] Physics: two-body propagation, state ↔ orbital elements (a, e, periapsis, apoapsis, period)
- [x] Tests: circular orbit period, vis-viva at periapsis/apoapsis, energy and angular momentum conservation
- [x] Scene: central body, orbiter, trajectory, velocity/acceleration vectors, apsis markers
- [x] Controls: initial position, velocity, eccentricity
- [x] Readouts: period, speed, r, energy, h
- [x] Experiments (≥3), e.g. equal-areas demonstration, doubling a
- [x] References

### 4.2 Escape Velocity and Gravitational Binding Energy

> Deferred: Phase 2 was scoped to one concept for this pass.

- [ ] Lesson content
- [ ] Equations: $v_{esc} = \sqrt{2GM/r}$, $U = -GMm/r$, $\varepsilon = v^2/2 - \mu/r$
- [ ] Physics: trajectory classification (impact / bound / parabolic / hyperbolic), reusing orbital-motion model
- [ ] Tests: Earth surface escape ≈ 11.19 km/s, ε = 0 at escape speed
- [ ] Scene: planet, launch point, trajectories, potential well visualisation
- [ ] Readouts: specific orbital energy, bound/unbound threshold
- [ ] Experiments
- [ ] References

- [ ] Architecture review: confirm concept 2 needed no shell changes

## Phase 3 — Remaining concepts

### 4.3 Hohmann Transfer

- [ ] Lesson, equations ($a_t$, $t_t$, Δv₁, Δv₂)
- [ ] Physics + tests (LEO → GEO Δv ≈ 3.9 km/s total)
- [ ] Scene: initial/target/transfer orbits, burn markers, before/after velocity vectors
- [ ] Controls: r₁, r₂, burn triggers
- [ ] Assumption callout: coplanar, circular, impulsive
- [ ] Experiments, references

### 4.4 Gravity Assist

- [ ] Lesson, equations (hyperbolic excess velocity, turn angle)
- [ ] Physics: patched-conic flyby, frame transforms + tests (|v∞,in| = |v∞,out|)
- [ ] Scene: moving planet, hyperbolic trajectory, vectors in both frames
- [ ] Frame switch: planet-relative ↔ heliocentric (made very explicit in UI)
- [ ] Readouts: speed and energy before/after
- [ ] Experiments, references

### 4.5 Tidal Forces

- [ ] Lesson: differential acceleration, correct far-side bulge explanation
- [ ] Equations: $a_{tidal} \approx 2GM_m R_e / d^3$, $\propto 1/d^3$
- [ ] Physics: tidal acceleration field, equilibrium tide, Sun + Moon superposition + tests
- [ ] Scene: Earth, Moon, exaggerated (labelled) bulges, vector field, Earth rotation
- [ ] Toggles: Moon / Sun contributions, spring / neap configurations
- [ ] Experiment: "Moon twice as far" → tidal effect × 1/8
- [ ] Prominent idealised-equilibrium-tide disclaimer
- [ ] References

## Phase 4 — Open-source release

- [ ] `docs/architecture.md` complete
- [ ] `docs/adding-a-concept.md` with a worked example
- [ ] `docs/scientific-standards.md` complete
- [ ] `docs/development.md` complete
- [ ] Example contribution: add a sixth concept with zero changes outside `packages/concepts`
- [ ] Accessibility pass (keyboard, contrast, reduced motion, text alternatives for visuals)
- [ ] Performance pass (no rerenders in animation loops, instancing, lazy assets)
- [ ] Playwright coverage for every concept page (desktop + mobile)
- [ ] Public deployment + automated deploy from `main`

## Definition of done (initial release)

- [ ] All five concepts reachable from discovery page
- [ ] Every concept has a meaningful explanation
- [ ] Equations render correctly with explained variables
- [ ] All five concepts have interactive simulations
- [ ] At least two concepts are especially polished
- [ ] Parameters drive real scientific calculations
- [ ] Models have automated tests and validation cases
- [ ] Idealised models clearly distinguished from reality
- [ ] Works on modern desktop and mobile browsers
- [ ] Codebase public
- [ ] Contribution docs complete
- [ ] New concept addable without touching core or existing concepts
