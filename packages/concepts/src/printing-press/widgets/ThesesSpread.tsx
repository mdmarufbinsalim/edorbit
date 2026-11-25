"use client";

import { useMemo, useState } from "react";
import { europeCoastlines } from "@edorbit/history";
import { ParameterSlider, SketchMap, Timeline, useReportProgress } from "@edorbit/ui";
import { THESES_REPRINTS_1517, THESES_START, routes, townById } from "../data";
import {
  DAYS_TO_YEAR_END,
  PROGRESS,
  SPREAD_DEFAULTS,
  SPREAD_RANGES,
  dateAfterTheses,
  thesesSpread,
} from "../model";

const MAX_DAYS = 180;
/** Zoom on central Europe, where the 1517 printings happened. */
const BOUNDS = { west: -2, east: 22, south: 40.5, north: 57 };

/** Chapter 3: a labelled thought experiment of the Theses spreading along trade routes. */
export default function ThesesSpread() {
  const [kmPerDay, setKm] = useState<number>(SPREAD_DEFAULTS.kmPerDay);
  const [reprintDays, setReprint] = useState<number>(SPREAD_DEFAULTS.reprintDays);
  const [day, setDay] = useState(0);
  const { set } = useReportProgress();
  const spread = useMemo(() => thesesSpread({ kmPerDay, reprintDays }), [kmPerDay, reprintDays]);

  const byYearEnd = [...spread.values()].filter((d) => d <= DAYS_TO_YEAR_END).length;
  const basel = spread.get("basel");

  return (
    <div className="space-y-6">
      <p className="inline-block rounded-full border-2 border-dashed border-[var(--ink)] px-3 py-1 text-sm">
        Thought experiment, not a record of what happened
      </p>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <SketchMap
          bounds={BOUNDS}
          coastlines={europeCoastlines}
          label={`Day ${day} after 31 October 1517. In this model ${[...spread.values()].filter((d) => d <= day).length} towns have printed the Theses.`}
        >
          {(project) => (
            <>
              {routes
                .filter(([a, b]) => spread.has(a) && spread.has(b))
                .map(([a, b]) => {
                  const [x1, y1] = project(townById.get(a)!.lonLat);
                  const [x2, y2] = project(townById.get(b)!.lonLat);
                  return (
                    <line
                      key={`${a}-${b}`}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="var(--faint)"
                      strokeWidth={1.5}
                      strokeDasharray="1 5"
                      strokeLinecap="round"
                    />
                  );
                })}
              {[...spread.entries()].map(([id, d]) => {
                const t = townById.get(id)!;
                const [x, y] = project(t.lonLat);
                const printed = d <= day;
                const real = (THESES_REPRINTS_1517 as readonly string[]).includes(id);
                const start = id === THESES_START;
                return (
                  <g key={id}>
                    {real && (
                      <circle
                        cx={x}
                        cy={y}
                        r={11}
                        fill="none"
                        stroke="var(--ink)"
                        strokeWidth={1.5}
                        strokeDasharray="3 3"
                      />
                    )}
                    <circle
                      cx={x}
                      cy={y}
                      r={start ? 7 : 5}
                      fill={printed ? "var(--ink)" : "var(--paper)"}
                      stroke="var(--ink)"
                      strokeWidth={2}
                    >
                      <title>{`${t.name}: ${dateAfterTheses(d)} in this model`}</title>
                    </circle>
                    {(real || start) && (
                      <text
                        x={x + 13}
                        y={y + 4}
                        fontSize={12}
                        fill="var(--ink)"
                        stroke="var(--paper)"
                        strokeWidth={3}
                        paintOrder="stroke"
                      >
                        {t.name}
                      </text>
                    )}
                  </g>
                );
              })}
            </>
          )}
        </SketchMap>
        <div className="space-y-6">
          <Timeline
            label="Days after 31 October 1517"
            min={0}
            max={MAX_DAYS}
            value={day}
            onChange={setDay}
            format={(d) => dateAfterTheses(d)}
            marks={[
              { value: 0, label: "Oct" },
              { value: DAYS_TO_YEAR_END, label: "New Year" },
              { value: MAX_DAYS, label: "Apr" },
            ]}
            playable
            speed={30}
          />
          <ParameterSlider
            label="Copies travel"
            unit="km a day"
            value={kmPerDay}
            {...SPREAD_RANGES.kmPerDay}
            onChange={(v) => {
              setKm(v);
              set(PROGRESS.spreadKmPerDay, v);
            }}
          />
          <ParameterSlider
            label="Printers take"
            unit="days to reprint"
            value={reprintDays}
            {...SPREAD_RANGES.reprintDays}
            onChange={(v) => {
              setReprint(v);
              set(PROGRESS.spreadReprintDays, v);
            }}
          />
          <div aria-live="polite" className="space-y-1">
            <p className="text-sm text-muted">Printed by the end of 1517, in this model</p>
            <p className="text-4xl font-medium tabular-nums">
              {byYearEnd} <span className="text-lg text-muted">of {spread.size} towns</span>
            </p>
            <p className="text-muted">
              Basel: {basel === undefined ? "never reached" : dateAfterTheses(basel)}
              {basel !== undefined && (basel <= DAYS_TO_YEAR_END ? ", in time" : ", too late")}
            </p>
          </div>
          <p className="text-xs text-muted">
            Dashed rings: towns where real printings from late 1517 survive. Straight lines stand in
            for real roads and rivers.
          </p>
        </div>
      </div>
    </div>
  );
}
