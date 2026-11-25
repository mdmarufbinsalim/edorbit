import { ConceptRegistry } from "@orbital/core";
import type { ConceptEntry } from "./types";
import { orbitalMotion } from "./orbital-motion";
import { metadata as escapeVelocity } from "./escape-velocity";
import { metadata as hohmannTransfer } from "./hohmann-transfer";
import { metadata as gravityAssist } from "./gravity-assist";
import { metadata as tidalForces } from "./tidal-forces";

/**
 * The single place a concept is registered. Adding a concept means adding a
 * directory and one entry here; the app shell needs no changes.
 * Entries without a module are listed as planned.
 */
export const conceptRegistry = new ConceptRegistry<ConceptEntry>([
  { metadata: orbitalMotion.metadata, module: orbitalMotion },
  { metadata: escapeVelocity },
  { metadata: hohmannTransfer },
  { metadata: gravityAssist },
  { metadata: tidalForces },
]);
