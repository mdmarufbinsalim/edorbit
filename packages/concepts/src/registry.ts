import { ConceptRegistry, type ConceptMetadata } from "@orbital/core";
import { metadata as orbitalMotion } from "./orbital-motion";
import { metadata as escapeVelocity } from "./escape-velocity";
import { metadata as hohmannTransfer } from "./hohmann-transfer";
import { metadata as gravityAssist } from "./gravity-assist";
import { metadata as tidalForces } from "./tidal-forces";

/**
 * The single place a new concept is registered. Adding a concept means adding
 * a directory and one line here; the app shell needs no changes.
 */
export const conceptRegistry = new ConceptRegistry<{ metadata: ConceptMetadata }>(
  [orbitalMotion, escapeVelocity, hohmannTransfer, gravityAssist, tidalForces].map((metadata) => ({
    metadata,
  })),
);
