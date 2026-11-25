"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RichText, useReportProgress } from "@edorbit/ui";
import { PROGRESS, RATES } from "../model";
import { pageParts } from "./page-parts";

const LINES = RATES.linesPerPage;
const TOP = 70;
const STEP = (350 - TOP) / LINES;

/** Lines of a justified column: every line the same length, except where the initial sits. */
function column(x0: number, x1: number, indent: (i: number) => number) {
  return Array.from({ length: LINES }, (_, i) => {
    const y = TOP + i * STEP;
    return `M${x0 + indent(i)} ${y.toFixed(1)}L${x1} ${y.toFixed(1)}`;
  }).join("");
}

/** The featured idea: tap parts of a Gutenberg Bible page to learn what they are and why they matter. */
export default function BiblePage() {
  const [active, setActive] = useState(0);
  const { add } = useReportProgress();
  const part = pageParts[active]!;
  const pick = (i: number) => {
    setActive(i);
    add(PROGRESS.pageParts, pageParts[i]!.id);
  };
  const columns = useMemo(
    () => ({
      left: column(46, 142, (i) => (i < 7 ? 32 : 0)),
      right: column(158, 254, () => 0),
    }),
    [],
  );
  const vine = useMemo(() => {
    const pts: string[] = [];
    for (let y = 44; y <= 356; y += 4) pts.push(`${(24 + Math.sin(y / 14) * 6).toFixed(1)} ${y}`);
    return "M" + pts.join("L");
  }, []);

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
      <div>
        <svg
          viewBox="0 0 300 400"
          className="mx-auto w-full max-w-[420px]"
          role="group"
          aria-label="A drawing of how a Gutenberg Bible page is laid out. Tap a part to learn about it."
        >
          <defs>
            <pattern id="rubric-hatch" width="4" height="4" patternUnits="userSpaceOnUse">
              <path d="M0 4L4 0" stroke="var(--ink)" strokeWidth={1} />
            </pattern>
          </defs>
          <path
            d="M10 10 L262 10 L290 38 L290 390 L10 390 Z"
            fill="var(--paper)"
            stroke="var(--ink)"
            strokeWidth={2.5}
            strokeLinejoin="round"
          />
          <path d="M262 10 L262 38 L290 38" fill="none" stroke="var(--ink)" strokeWidth={2} />
          {/* rubricated heading */}
          <rect
            x={170}
            y={52}
            width={74}
            height={8}
            fill="url(#rubric-hatch)"
            stroke="var(--ink)"
            strokeWidth={1}
          />
          {/* two justified columns of 42 lines */}
          <path d={columns.left} stroke="var(--ink)" strokeWidth={3.2} strokeOpacity={0.85} />
          <path d={columns.right} stroke="var(--ink)" strokeWidth={3.2} strokeOpacity={0.85} />
          {/* painted initial */}
          <rect
            x={44}
            y={64}
            width={30}
            height={46}
            rx={2}
            fill="var(--paper)"
            stroke="var(--ink)"
            strokeWidth={2}
          />
          <text
            x={59}
            y={102}
            textAnchor="middle"
            fontSize={40}
            fontFamily="Georgia, serif"
            fill="var(--ink)"
          >
            I
          </text>
          {/* decorated border */}
          <path d={vine} fill="none" stroke="var(--muted)" strokeWidth={1.8} />
          {Array.from({ length: 12 }, (_, i) => {
            const y = 56 + i * 26;
            const x = 24 + Math.sin(y / 14) * 6;
            return (
              <ellipse
                key={y}
                cx={x + (i % 2 ? 6 : -6)}
                cy={y}
                rx={5}
                ry={2.5}
                transform={`rotate(${i % 2 ? -30 : 30} ${x} ${y})`}
                fill="var(--paper)"
                stroke="var(--muted)"
                strokeWidth={1.4}
              />
            );
          })}
          {/* hotspots */}
          {pageParts.map((p, i) => (
            <rect
              key={p.id}
              x={p.region.x}
              y={p.region.y}
              width={p.region.w}
              height={p.region.h}
              rx={4}
              role="button"
              tabIndex={0}
              aria-label={p.label}
              aria-pressed={i === active}
              onClick={() => pick(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  pick(i);
                }
              }}
              fill="transparent"
              stroke={i === active ? "var(--ink)" : "transparent"}
              strokeWidth={2}
              strokeDasharray="4 4"
              className="cursor-pointer outline-none focus-visible:stroke-[var(--muted)]"
            />
          ))}
        </svg>
        <p className="mt-2 text-center text-xs text-muted">
          A drawing of the layout, not a photograph. Real copies are in libraries around the world.
        </p>
      </div>
      <div className="space-y-6">
        <p className="text-sm text-muted">Tap the page, or pick a part</p>
        <div className="flex flex-wrap gap-2">
          {pageParts.map((p, i) => (
            <button
              key={p.id}
              type="button"
              aria-pressed={i === active}
              onClick={() => pick(i)}
              className={`rounded-full border-2 px-3 py-1 text-sm transition ${i === active ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]" : "border-[var(--ink)] hover:-translate-y-0.5"}`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={part.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="min-h-32 space-y-2"
            aria-live="polite"
          >
            <p className="text-2xl font-medium">{part.label}</p>
            <p className="text-lg">
              <RichText text={part.plain} />
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
