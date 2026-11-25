# EdOrbit

**Big ideas you can poke at.**

EdOrbit is an open-source platform of interactive concepts from any field: physics, maths, computer science, chemistry, biology, history, economics, music and more. It is written for teens and early learners. Each concept is a short story with things to drag, try and break. Under the hood is a real model or a real source, never a fake animation.

The first concept, **Why don't satellites fall down?**, is the reference implementation. It has Newton's cannon, Kepler's laws, a 3D playground and missions that check themselves.

> Status: early development. See [checklist.md](checklist.md).

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

## How a concept works

Every concept follows the same short arc:

1. **Hook.** A question worth caring about.
2. **Story.** Two to four tiny chapters, each with a hands-on widget and an optional quiz.
3. **Featured idea.** One formula, rule or primary source, explained piece by piece.
4. **Playground.** Free play with the underlying model.
5. **Missions.** Goals that tick themselves off when you reach them.
6. **For the curious.** The full maths or sources, simplifications and references, collapsed by default.

## Repository layout

```
apps/web            Next.js app shell: routing, layout, discovery
packages/core       Concept contract, simulation engine, units (no React/Three)
packages/physics    Pure physics models (a domain package; more domains will follow)
packages/rendering  Reusable React Three Fiber components
packages/ui         Sketch design system, learning components, controls
packages/concepts   One directory per concept
docs/               Architecture, contribution and content standards
```

Domain packages (`physics` today) hold pure, tested models with no UI dependencies. ESLint enforces this boundary. See [docs/architecture.md](docs/architecture.md).

## Contributing

New concepts from any subject are welcome, as are corrections and improvements. Start with [CONTRIBUTING.md](CONTRIBUTING.md) and [docs/adding-a-concept.md](docs/adding-a-concept.md).

## Licence

[MIT](LICENSE)
