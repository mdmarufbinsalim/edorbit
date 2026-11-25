"use client";

import { lazy, Suspense, useState } from "react";
import { formatYear } from "@edorbit/history";
import {
  LayerToggles,
  OrderingChallenge,
  SketchBox,
  Timeline,
  useReportProgress,
} from "@edorbit/ui";
import { ORDER_START, orderEvents, pressTowns, type Language } from "../data";
import { PROGRESS, clusterStats, languages, townsBy } from "../model";
import { eventsInOrder } from "../missions";
import { TownCard, useOpenTown } from "./map-parts";
import type { MapLayers } from "./MapScene3D";

const MapScene3D = lazy(() => import("./MapScene3D"));

const YEARS = { from: 1450, to: 1520 };
const LAYERS = [
  { id: "routes", label: "Trade routes", defaultVisible: true },
  { id: "universities", label: "Universities", defaultVisible: false },
  { id: "rivers", label: "Big rivers", defaultVisible: false },
];
const pct = (x: number) => `${Math.round(x * 100)}%`;
const items = ORDER_START.map((id) => {
  const e = orderEvents.find((x) => x.id === id)!;
  return { id, label: e.label, answer: formatYear(e) };
});

/** Playground: filter the press towns by year and language in 3D, then put events in order. */
export default function PressPlayground() {
  const [year, setYear] = useState(1500);
  const [langs, setLangs] = useState<readonly Language[]>(languages);
  const [layers, setLayers] = useState<MapLayers>({
    routes: true,
    universities: false,
    rivers: false,
  });
  const { selected, open } = useOpenTown();
  const { set } = useReportProgress();
  const towns = townsBy(year).filter((t) => langs.includes(t.language));
  const stats = clusterStats(towns);
  const all = clusterStats(pressTowns);

  const toggleLang = (l: Language) =>
    setLangs((cur) => (cur.includes(l) ? cur.filter((x) => x !== l) : [...cur, l]));

  return (
    <div className="space-y-16">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <SketchBox className="h-[60vh] min-h-[380px]" innerClassName="h-full" padding={4} seed={41}>
          <div className="absolute inset-[6px] overflow-hidden">
            <Suspense fallback={<p className="p-6 text-muted">Loading 3D…</p>}>
              <MapScene3D
                towns={towns}
                year={year}
                layers={layers}
                selected={selected?.id}
                onOpen={open}
              />
            </Suspense>
          </div>
          <p className="pointer-events-none absolute bottom-3 left-4 text-xs text-muted">
            Drag to spin · scroll to zoom · tap a pillar. Taller means printing for longer.
          </p>
        </SketchBox>
        <div className="space-y-6">
          <Timeline
            label="Year"
            min={YEARS.from}
            max={YEARS.to}
            value={year}
            onChange={setYear}
            marks={[1450, 1470, 1490, 1510].map((v) => ({ value: v, label: String(v) }))}
            playable
          />
          <fieldset>
            <legend className="mb-2 text-sm text-muted">Language spoken in the town</legend>
            <div className="flex flex-wrap gap-2">
              {languages.map((l) => {
                const on = langs.includes(l);
                return (
                  <button
                    key={l}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleLang(l)}
                    className={`rounded-full border-2 px-3 py-1 text-xs transition ${on ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]" : "border-dashed border-[var(--faint)] text-muted"}`}
                  >
                    {l}
                  </button>
                );
              })}
            </div>
          </fieldset>
          <LayerToggles
            layers={LAYERS}
            values={{ ...layers }}
            onChange={(id, v) => setLayers((old) => ({ ...old, [id]: v }))}
          />
          <div aria-live="polite" className="grid grid-cols-3 gap-3">
            <p>
              <span className="block text-3xl font-medium tabular-nums">{stats.count}</span>
              <span className="text-xs text-muted">towns shown</span>
            </p>
            <p>
              <span className="block text-3xl font-medium tabular-nums">
                {pct(stats.university)}
              </span>
              <span className="text-xs text-muted">had a university</span>
            </p>
            <p>
              <span className="block text-3xl font-medium tabular-nums">{pct(stats.river)}</span>
              <span className="text-xs text-muted">on a big river</span>
            </p>
          </div>
          <p className="text-xs text-muted">
            Of all {all.count} towns on this map, {pct(all.university)} had a university and{" "}
            {pct(all.river)} sat on a big river. Most of the rest were trading cities. Printers went
            where there were buyers, money and ways to ship books.
          </p>
          <TownCard town={selected} empty="Tap a pillar to see who printed there first." />
        </div>
      </div>

      <div className="max-w-2xl space-y-4">
        <h4 className="text-2xl font-medium">Put it in order</h4>
        <OrderingChallenge
          items={items}
          isCorrect={eventsInOrder}
          onCheck={(ok) => ok && set(PROGRESS.eventOrder, true)}
        />
      </div>
    </div>
  );
}
