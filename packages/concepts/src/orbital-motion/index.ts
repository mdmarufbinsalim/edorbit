import { lazy } from "react";
import { defineConcept } from "../types";
import { metadata } from "./metadata";
import { lesson } from "./lesson";
import { equations } from "./equations";
import { calculators, formula } from "./calculators";
import { simulation } from "./simulation";
import { missions } from "./missions";
import { references } from "./references";

export const orbitalMotion = defineConcept({
  metadata,
  lesson,
  equations,
  calculators,
  formula,
  simulation,
  missions,
  references,
  widgets: {
    cannon: lazy(() => import("./widgets/NewtonsCannon")),
    "equal-times": lazy(() => import("./widgets/EqualTimes")),
    "kepler-years": lazy(() => import("./widgets/KeplerYears")),
  },
  Scene: lazy(() => import("./scene")),
});
