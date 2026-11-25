import { ConceptRegistry } from "@edorbit/core";
import type { ConceptEntry } from "./types";
import { orbitalMotion } from "./orbital-motion";
import { printingPress } from "./printing-press";

/**
 * The single place a concept is registered. Adding a concept means adding a
 * directory and one entry here; the app shell needs no changes.
 * An entry may omit `module` to list a concept as "coming soon".
 */
export const conceptRegistry = new ConceptRegistry<ConceptEntry>([
  { metadata: orbitalMotion.metadata, module: orbitalMotion },
  { metadata: printingPress.metadata, module: printingPress },
]);
