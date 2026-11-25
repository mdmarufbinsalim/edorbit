import { ConceptRegistry } from "@orbital/core";
import type { ConceptEntry } from "./types";
import { orbitalMotion } from "./orbital-motion";

/**
 * The single place a concept is registered. Adding a concept means adding a
 * directory and one entry here; the app shell needs no changes.
 * An entry may omit `module` to list a concept as "coming soon".
 */
export const conceptRegistry = new ConceptRegistry<ConceptEntry>([
  { metadata: orbitalMotion.metadata, module: orbitalMotion },
]);
