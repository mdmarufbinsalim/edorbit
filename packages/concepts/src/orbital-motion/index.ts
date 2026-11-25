import { lazy } from "react";
import { defineConcept } from "../types";
import { metadata } from "./metadata";
import { lesson } from "./lesson";
import { equations } from "./equations";
import { calculators } from "./calculators";
import { simulation } from "./simulation";
import { experiments } from "./experiments";
import { references } from "./references";

export const orbitalMotion = defineConcept({
  metadata,
  lesson,
  equations,
  calculators,
  simulation,
  experiments,
  references,
  Scene: lazy(() => import("./scene")),
});
