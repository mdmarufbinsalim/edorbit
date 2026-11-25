# ORBITAL

**Understand the mathematics. Explore the phenomenon. Experiment with the physics.**

ORBITAL is an open-source, browser-based platform for learning science through interactive 3D simulations backed by real mathematical models. The first release covers orbital mechanics and celestial physics:

1. Orbital Motion and Kepler's Laws
2. Escape Velocity and Gravitational Binding Energy
3. Hohmann Transfer and Orbital Maneuvers
4. Gravity Assist and Gravitational Slingshot
5. Tidal Forces

> Status: early development. See [checklist.md](checklist.md) for progress.

## Quick start

Requires Node 22+ and [pnpm](https://pnpm.io).

```sh
pnpm install
pnpm dev          # http://localhost:3000
```

| Command          | Purpose                       |
| ---------------- | ----------------------------- |
| `pnpm dev`       | Start the web app             |
| `pnpm build`     | Production build              |
| `pnpm typecheck` | Type-check every package      |
| `pnpm lint`      | ESLint                        |
| `pnpm test`      | Unit tests (Vitest)           |
| `pnpm test:e2e`  | End-to-end tests (Playwright) |
| `pnpm format`    | Prettier                      |

## Repository layout

```
apps/web            Next.js app shell: routing, layout, discovery
packages/core       Concept contracts, simulation clock, SI units (no React/Three)
packages/physics    Pure scientific models and integrators (no React/Three)
packages/rendering  Reusable React Three Fiber components
packages/ui         Equation renderer, controls, lesson layout
packages/concepts   One directory per scientific concept
docs/               Architecture, contribution and scientific standards
```

The physics layer never depends on React or Three.js; ESLint enforces this boundary. See [docs/architecture.md](docs/architecture.md).

## Contributing

Contributions of new concepts, corrections, and improvements are welcome. Start with [CONTRIBUTING.md](CONTRIBUTING.md).

## Licence

[MIT](LICENSE)
