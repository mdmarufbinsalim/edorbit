import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "models",
          include: ["packages/{core,physics}/**/*.test.ts", "packages/concepts/**/*.test.ts"],
          environment: "node",
        },
      },
      {
        test: {
          name: "ui",
          include: ["packages/{ui,rendering}/**/*.test.{ts,tsx}", "apps/web/src/**/*.test.tsx"],
          environment: "jsdom",
        },
      },
    ],
  },
});
