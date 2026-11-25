"use client";

import { useState } from "react";
import { EUROPE_BOUNDS, europeCoastlines } from "@edorbit/history";
import { SketchMap, Timeline } from "@edorbit/ui";
import { pressTowns } from "../data";
import { MAP_YEARS, townsBy } from "../model";
import { TownCard, TownDot, useOpenTown } from "./map-parts";

const decades = Array.from({ length: 6 }, (_, i) => ({
  value: MAP_YEARS.from + i * 10,
  label: String(MAP_YEARS.from + i * 10),
}));
const total = pressTowns.filter((t) => t.year <= MAP_YEARS.to).length;

/** Chapter 2: drag a timeline and watch presses appear across Europe. */
export default function PressMap() {
  const [year, setYear] = useState<number>(MAP_YEARS.from);
  const { selected, open } = useOpenTown();
  const towns = townsBy(year);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
      <SketchMap
        bounds={EUROPE_BOUNDS}
        coastlines={europeCoastlines}
        label={`Map of Europe in ${year}. ${towns.length} towns on this map have a press.`}
      >
        {(project) =>
          towns.map((t) => (
            <TownDot
              key={t.id}
              town={t}
              at={project(t.lonLat)}
              selected={selected?.id === t.id}
              filled={t.year === year}
              label={t.year === year}
              onOpen={open}
            />
          ))
        }
      </SketchMap>
      <div className="space-y-6">
        <Timeline
          label="Year"
          min={MAP_YEARS.from}
          max={MAP_YEARS.to}
          value={year}
          onChange={setYear}
          marks={decades}
          playable
        />
        <div aria-live="polite">
          <p className="text-sm text-muted">Towns with a press, on this map</p>
          <p className="text-4xl font-medium tabular-nums">
            {towns.length} <span className="text-lg text-muted">of {total}</span>
          </p>
        </div>
        <TownCard
          town={selected}
          empty="Tap a town to see who printed there first. Black dots are new this year."
        />
      </div>
    </div>
  );
}
