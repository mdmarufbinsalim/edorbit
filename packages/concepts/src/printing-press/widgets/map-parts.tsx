"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { formatYear } from "@edorbit/history";
import { useReportProgress } from "@edorbit/ui";
import { townById, type PressTown } from "../data";
import { PROGRESS } from "../model";

/** Selected town plus a reporter, so every map counts towards the "find a town" missions. */
export function useOpenTown() {
  const [selected, setSelected] = useState<string | null>(null);
  const { add } = useReportProgress();
  const open = useCallback(
    (id: string) => {
      setSelected(id);
      add(PROGRESS.townsOpened, id);
    },
    [add],
  );
  return { selected: selected ? townById.get(selected) : undefined, open };
}

/** A clickable, keyboard-reachable town dot for SVG maps. */
export function TownDot({
  town,
  at,
  selected,
  filled = false,
  onOpen,
  label,
  r = 5,
}: {
  town: PressTown;
  at: [number, number];
  selected: boolean;
  filled?: boolean;
  onOpen: (id: string) => void;
  /** Visible name next to the dot. */
  label?: boolean;
  r?: number;
}) {
  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`${town.name}, first press ${formatYear(town)}`}
      aria-pressed={selected}
      onClick={() => onOpen(town.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(town.id);
        }
      }}
      className="cursor-pointer outline-none [&:focus-visible>circle:first-child]:stroke-[var(--ink)]"
    >
      {/* Generous invisible hit area for fingers. */}
      <circle cx={at[0]} cy={at[1]} r={12} fill="transparent" stroke="transparent" />
      <motion.circle
        cx={at[0]}
        cy={at[1]}
        initial={{ r: 0 }}
        animate={{ r: selected ? r + 2 : r }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        fill={filled ? "var(--ink)" : "var(--paper)"}
        stroke="var(--ink)"
        strokeWidth={2}
      />
      {selected && (
        <circle
          cx={at[0]}
          cy={at[1]}
          r={r + 7}
          fill="none"
          stroke="var(--ink)"
          strokeWidth={1.5}
          strokeDasharray="2 4"
        />
      )}
      {(label || selected) && (
        <text
          x={at[0] + r + 5}
          y={at[1] + 4}
          fontSize={12}
          fill="var(--ink)"
          stroke="var(--paper)"
          strokeWidth={3}
          paintOrder="stroke"
        >
          {town.name}
        </text>
      )}
    </g>
  );
}

/** What we know about a town's first press. */
export function TownCard({ town, empty }: { town: PressTown | undefined; empty: string }) {
  if (!town) return <p className="min-h-28 text-muted">{empty}</p>;
  return (
    <motion.div
      key={town.id}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-28 space-y-1"
      aria-live="polite"
    >
      <p className="text-2xl font-medium">
        {town.name}{" "}
        <span className="text-lg text-muted tabular-nums">first press {formatYear(town)}</span>
      </p>
      {town.modern && <p className="text-sm text-muted">Today: {town.modern}</p>}
      <p>{town.printer ? `First printer: ${town.printer}.` : "First printer: not certain."}</p>
      {town.note && <p className="text-muted">{town.note}</p>}
    </motion.div>
  );
}
