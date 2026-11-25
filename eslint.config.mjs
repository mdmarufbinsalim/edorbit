import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import nextPlugin from "@next/eslint-plugin-next";

/**
 * The most important boundary in EdOrbit: scientific code (core, physics)
 * must never depend on React, Three.js, or any UI layer.
 */
const UI_IMPORTS = [
  {
    group: ["react", "react/*", "react-dom", "react-dom/*"],
    message: "Scientific layers must not depend on React.",
  },
  {
    group: ["three", "three/*", "@react-three/*"],
    message: "Scientific layers must not depend on Three.js.",
  },
  {
    group: [
      "@edorbit/ui",
      "@edorbit/ui/*",
      "@edorbit/rendering",
      "@edorbit/rendering/*",
      "@edorbit/concepts",
      "@edorbit/concepts/*",
    ],
    message: "Scientific layers must not depend on UI, rendering, or concept packages.",
  },
];

export default tseslint.config(
  { ignores: ["**/node_modules/**", "**/.next/**", "**/coverage/**", "**/next-env.d.ts"] },
  ...tseslint.configs.recommended,
  {
    files: ["**/*.tsx"],
    plugins: { "react-hooks": reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },
  {
    files: ["apps/web/**/*.{ts,tsx}"],
    plugins: { "@next/next": nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
    settings: { next: { rootDir: "apps/web" } },
  },
  {
    files: ["packages/core/**/*.ts", "packages/physics/**/*.ts"],
    rules: { "no-restricted-imports": ["error", { patterns: UI_IMPORTS }] },
  },
);
