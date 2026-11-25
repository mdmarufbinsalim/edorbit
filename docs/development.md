# Development

- Node 22+, pnpm (version pinned in `package.json` `packageManager`).
- `pnpm install` then `pnpm dev`.
- Workspace packages export TypeScript source directly; Next.js compiles them via `transpilePackages`. There is no separate build step for packages.
- Add a dependency to a package: `pnpm --filter @orbital/<pkg> add <dep>`.
- Unit tests sit next to the code as `*.test.ts(x)`. E2E tests live in `apps/web/e2e`.
