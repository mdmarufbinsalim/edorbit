"use client";

import { useId, useState, type ReactNode } from "react";
import { SKETCH_STROKE } from "./stroke";

/** Heading that doubles as a disclosure toggle, with an animated grid-rows reveal. */
export function Expandable({
  title,
  children,
  defaultOpen = false,
}: {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div data-expandable data-open={open} className="group/expandable">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 py-3 text-left"
      >
        <svg viewBox="0 0 28 28" className="h-7 w-7 shrink-0 overflow-visible" aria-hidden="true">
          <ellipse
            cx="14"
            cy="14"
            rx="12.5"
            ry="11.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={SKETCH_STROKE * 0.7}
          />
          <g className="origin-[14px_14px] transition-transform duration-300 group-data-[open=true]/expandable:rotate-45">
            <line
              x1="14"
              y1="8.5"
              x2="14"
              y2="19.5"
              stroke="currentColor"
              strokeWidth={SKETCH_STROKE * 0.7}
              strokeLinecap="round"
            />
            <line
              x1="8.5"
              y1="14"
              x2="19.5"
              y2="14"
              stroke="currentColor"
              strokeWidth={SKETCH_STROKE * 0.7}
              strokeLinecap="round"
            />
          </g>
        </svg>
        <span className="text-xl font-medium">{title}</span>
      </button>
      <div id={id} className="expandable-rows">
        <div className="expandable-clip">
          <div className="pt-2 pb-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
