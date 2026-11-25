"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useReportProgress } from "@edorbit/ui";
import { HandPress3D } from "./HandPress3D";
import {
  MINUTES_PER_LINE,
  PROGRESS,
  RATES,
  booksPerYear,
  formatWorkTime,
  pressPagesDuring,
} from "../model";

const fmt = (n: number, digits = 0) =>
  n.toLocaleString("en-US", { maximumFractionDigits: digits, minimumFractionDigits: digits });

/** A wobbly handwritten line, deterministic for each line number. */
function scribble(i: number, width: number) {
  const pts: string[] = [];
  const y = 18 + i * 6.4;
  for (let x = 0; x <= width; x += 6) {
    const wob = Math.sin(x * 0.45 + i * 1.7) * 1.1 + Math.sin(x * 0.13 + i) * 0.6;
    pts.push(`${(14 + x).toFixed(1)} ${(y + wob).toFixed(1)}`);
  }
  return "M" + pts.join("L");
}

/** Chapter 1: you copy lines by hand while the press stamps whole pages on the same clock. */
export default function CopyRace() {
  const [lines, setLines] = useState(0);
  const { set } = useReportProgress();
  const page = RATES.linesPerPage;
  const onPage = lines % page;
  const pagesDone = Math.floor(lines / page);
  const minutes = lines * MINUTES_PER_LINE;
  const pressPages = pressPagesDuring(lines);
  const widths = useMemo(
    () => Array.from({ length: page }, (_, i) => 150 - ((i * 37) % 23)),
    [page],
  );

  const copy = () => {
    const next = lines + 1;
    setLines(next);
    set(PROGRESS.raceLines, next);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="min-w-0 space-y-3">
          <p className="text-sm text-muted">You, the scribe</p>
          <div className="flex items-start gap-4">
            <svg
              viewBox="0 0 190 300"
              className="w-28 shrink-0 sm:w-48"
              role="img"
              aria-label={`Your page: ${onPage} of ${page} lines copied`}
            >
              <rect
                x={4}
                y={4}
                width={182}
                height={292}
                rx={3}
                fill="var(--paper)"
                stroke="var(--ink)"
                strokeWidth={2.5}
              />
              {widths.slice(0, onPage).map((w, i) => (
                <motion.path
                  key={`${pagesDone}-${i}`}
                  d={scribble(i, w)}
                  fill="none"
                  stroke="var(--ink)"
                  strokeWidth={1.3}
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.35 }}
                />
              ))}
            </svg>
            <div className="min-w-0 space-y-4">
              <button
                type="button"
                onClick={copy}
                className="rounded-full border-[2.5px] border-[var(--ink)] bg-[var(--ink)] px-5 py-3 text-base font-medium sm:px-6 sm:text-lg text-[var(--paper)] transition hover:-translate-y-0.5 active:translate-y-0"
              >
                Copy a line
              </button>
              <div aria-live="polite">
                <p className="text-sm text-muted">You have copied</p>
                <p className="text-3xl font-medium tabular-nums">
                  {fmt(lines / page, 2)} <span className="text-lg text-muted">pages</span>
                </p>
                <p className="text-sm text-muted tabular-nums">
                  {lines} lines · {formatWorkTime(minutes)} of work
                </p>
              </div>
              {lines > 0 && (
                <button
                  type="button"
                  onClick={() => setLines(0)}
                  className="text-sm underline decoration-2 underline-offset-4"
                >
                  Start again
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="min-w-0 space-y-3">
          <p className="text-sm text-muted">The press, in the same working time</p>
          <div className="relative h-64 overflow-hidden rounded-xl border-2 border-dashed border-[var(--faint)]">
            <HandPress3D running={lines > 0} sheets={pressPages} />
            <p className="pointer-events-none absolute bottom-2 left-3 text-xs text-muted">
              Drag to look around. Slowed down so you can follow it.
            </p>
          </div>
          <div aria-live="polite">
            <p className="text-sm text-muted">The press has printed</p>
            <p className="text-3xl font-medium tabular-nums">
              {fmt(pressPages)} <span className="text-lg text-muted">pages</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 border-t border-dashed border-[var(--faint)] pt-4 sm:grid-cols-2">
        <p>
          <span className="text-sm text-muted">A scribe, in a working year</span>
          <br />
          <span className="text-2xl font-medium tabular-nums">
            {fmt(booksPerYear(RATES.scribePagesPerDay), 1)}
          </span>{" "}
          <span className="text-muted">books of {RATES.bookPages} pages</span>
        </p>
        <p>
          <span className="text-sm text-muted">One press, in a working year</span>
          <br />
          <span className="text-2xl font-medium tabular-nums">
            {fmt(booksPerYear(RATES.pressPagesPerDay))}
          </span>{" "}
          <span className="text-muted">copies</span>
        </p>
      </div>
      <p className="text-xs text-muted">
        Approximate. Based on about {RATES.scribePagesPerDay} pages a day for a scribe and{" "}
        {fmt(RATES.pressPagesPerDay)} for a press team, once the type was set. Real speeds varied a
        lot.
      </p>
    </div>
  );
}
