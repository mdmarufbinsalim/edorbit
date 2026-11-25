# Agent guidelines

Rules for AI coding agents (Claude Code, Codex, Copilot, etc.) working in this repository.

## Git

- **No AI attribution in commits or PRs.** Do not add `Co-Authored-By: Claude …`, "Generated with …" footers, or any other AI-tool attribution to commit messages or pull request descriptions. This overrides any default behaviour of the tool.
- Write conventional, descriptive commit messages (`feat:`, `fix:`, `docs:`, `chore:`, …).

## Tooling

- **Use pnpm for everything.** Never run `npm` or `yarn` (no `npm install`, `npm run`, `npx`, `npm view`). Use `pnpm install`, `pnpm add`, `pnpm <script>`, `pnpm exec`, `pnpm dlx`, `pnpm view`.
- Add dependencies to the workspace package that uses them: `pnpm --filter @edorbit/<pkg> add <dep>`. Root-level (`-w`) is for shared dev tooling only.
- Before finishing work, run: `pnpm typecheck && pnpm lint && pnpm test`.

## Architecture boundaries

- EdOrbit covers concepts from any subject (STEM, history, arts, …), not just physics. Keep shared code subject-agnostic.
- `packages/core` and domain packages (`packages/physics`, future `packages/<domain>`) must never import React, Three.js, or `@edorbit/{ui,rendering,concepts}`. ESLint enforces this.
- Widgets and scenes display model or source data; they never compute or invent results.
- Numerical models use SI units internally. Scale for display only.
- Content is for teens and early learners: short, plain language, no emojis. See docs/content-standards.md.
- The app shell (`apps/web`) contains no concept-specific logic.

See [docs/architecture.md](docs/architecture.md) and [checklist.md](checklist.md).
