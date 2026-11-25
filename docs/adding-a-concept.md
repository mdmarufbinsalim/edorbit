# Adding a concept

> Draft — finalised once the `ConceptModule` contract lands in Phase 1.

1. Create `packages/concepts/src/<slug>/`.
2. Add `index.ts` exporting the concept's metadata (see existing concepts).
3. Add lesson content, equations, model, scene, controls, experiments, and references.
4. Put reusable physics in `packages/physics`, with tests.
5. Register the concept in `packages/concepts/src/registry.ts`.
6. Run `pnpm typecheck && pnpm lint && pnpm test`.

No changes to `apps/web` or other concepts should be needed. If they are, that is an architecture issue — please raise it.
