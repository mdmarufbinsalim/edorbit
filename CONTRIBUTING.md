# Contributing to ORBITAL

Thanks for helping make big ideas, from any subject, something people can see, poke at and understand.

## Setup

```sh
pnpm install
pnpm dev
```

This repository uses **pnpm only**. Please don't commit `package-lock.json` or `yarn.lock`.

## Before opening a pull request

```sh
pnpm typecheck && pnpm lint && pnpm test
```

## Adding a concept

Each concept lives in its own directory under `packages/concepts/src/<slug>/` and is registered with one line in `packages/concepts/src/registry.ts`. You should not need to change the app shell or any other concept. The full guide is in [docs/adding-a-concept.md](docs/adding-a-concept.md).

## Content standards

Concepts can come from any subject: STEM, history, the arts and more. Every claim must be backed by a tested model or a cited source. Simplifications must be stated on the page, and the story must stay short. See [docs/content-standards.md](docs/content-standards.md). Accuracy is part of code review.

## Contribution safety

Concepts are reviewed TypeScript modules bundled at build time. ORBITAL never loads or executes community code at runtime.

## Assets

Textures, models, and images must have a licence compatible with MIT redistribution. Record source and licence in `docs/assets.md`.

## Code of conduct

By participating you agree to our [Code of Conduct](CODE_OF_CONDUCT.md).
