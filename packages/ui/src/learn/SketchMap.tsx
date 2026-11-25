"use client";

import { useMemo, type ReactNode } from "react";
import {
  equirectangular,
  polylinesToPath,
  type GeoBounds,
  type LonLat,
  type Projection,
} from "@edorbit/core";

/**
 * Ink-on-paper map: coastlines from data, with markers drawn by the caller
 * through `children(project)`. The projection is computed, never hand-placed.
 */
export function SketchMap({
  bounds,
  coastlines,
  width = 640,
  label,
  className = "",
  children,
}: {
  bounds: GeoBounds;
  coastlines: readonly (readonly LonLat[])[];
  width?: number;
  /** Accessible description of what the map currently shows. */
  label: string;
  className?: string;
  children?: (project: Projection["project"]) => ReactNode;
}) {
  const projection = useMemo(() => equirectangular(bounds, width), [bounds, width]);
  const coast = useMemo(
    () => polylinesToPath(coastlines, projection.project),
    [coastlines, projection],
  );
  return (
    <svg
      viewBox={`0 0 ${width} ${projection.height.toFixed(0)}`}
      className={`w-full ${className}`}
      role="img"
      aria-label={label}
    >
      <path
        d={coast}
        fill="none"
        stroke="var(--muted)"
        strokeWidth={1.2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {children?.(projection.project)}
    </svg>
  );
}
