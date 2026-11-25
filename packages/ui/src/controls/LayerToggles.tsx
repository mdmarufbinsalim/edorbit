"use client";

import type { VisualLayerDefinition } from "@edorbit/core";

/** Pill toggles for what's drawn in the scene. */
export function LayerToggles({
  layers,
  values,
  onChange,
}: {
  layers: readonly VisualLayerDefinition[];
  values: Readonly<Record<string, boolean>>;
  onChange: (id: string, visible: boolean) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm text-muted">Show</legend>
      <div className="flex flex-wrap gap-2">
        {layers.map((l) => {
          const on = values[l.id] ?? false;
          return (
            <button
              key={l.id}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(l.id, !on)}
              className={`rounded-full border-2 px-3 py-1 text-xs transition ${on ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]" : "border-dashed border-[var(--faint)] text-muted"}`}
            >
              {l.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
