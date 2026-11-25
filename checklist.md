# Orbital — Development Checklist

Orbital is an open-source platform of **interactive concepts from any field**: physics, maths, computer science, chemistry, biology, history, economics, music and beyond. Each concept is a short, playful story for teens and early learners. You drag, try, predict and break things, and it is all backed by real models and real sources.

Orbital Motion is the first concept and the reference implementation. It is not the scope of the platform.

Legend: `[x]` done · `[ ]` to do

---

## Phase 0 — Repository initialisation ✅

- [x] pnpm workspace (`apps/*`, `packages/*`), Next.js App Router, TypeScript strict
- [x] Tailwind CSS v4, Three.js / R3F / Drei, Zustand, Framer Motion, KaTeX
- [x] Vitest, React Testing Library, Playwright, ESLint, Prettier
- [x] Lint boundary: pure model packages cannot import React / Three.js / UI
- [x] MIT licence, README, CONTRIBUTING, Code of Conduct, AGENTS.md, CI, templates

## Phase 1 — Platform foundation ✅

- [x] Concept contract (`ConceptModule`), registry, `defineConcept`, runtime validation
- [x] Framework-agnostic simulation engine: fixed-timestep clock, play/pause/reset/step, snapshots
- [x] Zustand controller wiring parameters to models; per-frame state stays out of React
- [x] Numerical integrators (Velocity Verlet, leapfrog, RK4) with conservation tests
- [x] Web Worker propagation protocol, trajectory sampling
- [x] Units, constants, formatting helpers
- [x] Shared R3F components: sketch globe, trail, trajectory, vectors, labels, WebGL fallback
- [x] Generic learning page that renders any concept with no concept-specific logic

## Phase 2 — First concept and the teen-first experience ✅

- [x] Paper-and-ink sketch design system (themes, hand-drawn primitives, Lenis, transitions)
- [x] Story format: hook → short chapters with widgets and quizzes → featured formula → playground → missions → "for the curious"
- [x] Self-checking missions, tap-a-symbol formula playground, quiz cards
- [x] **Orbital Motion**: Newton's cannon, equal-time dots, planet years, 3D playground, 4 missions
- [x] Tests that verify every mission hint, quiz answer and story claim

## Phase 3 — Make the platform subject-agnostic

The contract still assumes every concept is a numerical simulation. Generalise it so a history or music concept is just as first-class.

### Contract

- [ ] Make `simulation` and `Scene` optional. A concept can be story + widgets + missions only
- [x] Missions explain the reasoning behind each goal (Explain button), separate from hints
- [ ] Missions that check widget state or answers, not only simulation parameters
- [ ] Rename science-specific types to neutral ones, keeping deprecated aliases: `ScientificModel` → `Model`, `ScientificReference` → `Source`
- [ ] `Source` supports primary vs secondary sources, archives, dates, page/section, and licence
- [ ] Subject taxonomy: `subject` (e.g. Physics, History, Music) + `topics[]`, replacing free-text `category`
- [ ] Optional `era`/`date` metadata for historical concepts
- [ ] Validation covers the new fields; registry test runs it for every concept

### Domain packages

- [ ] Convention: one pure package per domain (`packages/physics`, then e.g. `packages/maths`, `packages/history`), with the same no-React/no-Three rule
- [ ] Generalise the ESLint boundary from `core`/`physics` to every domain package via a glob
- [ ] Shared "content data" pattern for non-numeric domains (dated events, places, people, quotations with citations)

### Widget kit (reusable, non-simulation)

- [ ] Timeline (scrub through dated events)
- [ ] Map with sketch markers and routes
- [ ] Before/after compare slider
- [ ] Ordering / sorting challenge ("put these in order")
- [ ] Step-through diagram (click next to reveal each stage)
- [ ] Prediction card (guess, then reveal)
- [ ] Audio-friendly widget hooks (for music and language concepts)

### Discovery

- [x] Geometric Orbital logo and adaptive SVG favicon

- [x] Tag system: curated tag vocabulary (subject, topic, skill), tags on every concept, validated against the vocabulary
- [x] Filter the discovery page by tag; tag chips on cards and concept pages link to filtered views
- [x] Rich hand-drawn card illustrations (multi-stroke, animated, per concept) instead of single-path doodles
- [ ] Browse and filter by subject; subject landing pages
- [ ] Search across titles, hooks and topics
- [ ] "Related concepts" links between subjects (e.g. orbital motion ↔ the history of Kepler)

### Standards

- [x] `docs/content-standards.md` replaces the science-only standards
- [ ] Reading-level guidance and a check for story text (short sentences, define jargon)
- [ ] Review checklist per domain: numerical validation (STEM), source verification and perspective balance (humanities)

## Phase 4 — Concept library

Candidates, not commitments. Each needs a proposal issue first.

- [ ] Maths: why there are infinitely many primes; Pythagoras by rearranging squares
- [ ] Computer science: how sorting algorithms race; binary counting
- [ ] Chemistry: why ice floats
- [ ] Biology: natural selection with a population you breed
- [ ] History: how the printing press spread ideas across Europe
- [ ] Economics: supply and demand at a lemonade stand
- [ ] Music: why some notes sound good together (frequency ratios)
- [ ] Geography / Earth science: why we have seasons

## Phase 5 — Open-source release

- [ ] `docs/adding-a-concept.md` walkthrough with a non-STEM example
- [ ] Example contribution: add a concept with zero changes outside `packages/concepts` (and its domain package)
- [ ] Accessibility pass (keyboard, contrast, reduced motion, text alternatives for every widget)
- [ ] Performance pass (lazy widgets and scenes, no per-frame React renders)
- [ ] Playwright coverage for every concept page (desktop + mobile)
- [ ] Public deployment with automated deploys from `main`
- [ ] Texture/asset attribution kept current in `docs/assets.md`

## Definition of done (first public release)

- [ ] At least three concepts from at least three different subjects
- [ ] At least one concept with no numerical simulation
- [ ] Every concept follows the story format and stays short
- [ ] Every claim is backed by a test (STEM) or a cited source (all subjects)
- [ ] Idealisations and simplifications are stated on the page
- [ ] Works on modern desktop and mobile browsers
- [ ] A contributor can add a concept without touching the app shell or other concepts
