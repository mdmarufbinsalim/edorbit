import { lazy } from "react";
import { defineConcept, type NoParams } from "../types";
import { metadata } from "./metadata";
import { lesson } from "./lesson";
import { missions } from "./missions";
import { references } from "./references";
import { debates } from "./debates";

/** First history concept: no numerical simulation, just story, widgets, data and missions. */
export const printingPress = defineConcept<unknown, NoParams>({
  metadata,
  lesson,
  equations: [],
  featured: {
    kicker: "A real page",
    title: "Read a page of the Gutenberg Bible",
    widget: "bible-page",
  },
  playground: { title: "Map the printing boom", widget: "press-playground" },
  missions,
  references,
  debates,
  widgets: {
    race: lazy(() => import("./widgets/CopyRace")),
    "spread-map": lazy(() => import("./widgets/PressMap")),
    "theses-spread": lazy(() => import("./widgets/ThesesSpread")),
    "bible-page": lazy(() => import("./widgets/BiblePage")),
    "press-playground": lazy(() => import("./widgets/PressPlayground")),
  },
});
