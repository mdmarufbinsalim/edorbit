"use client";

import type { VisualLayerDefinition } from "@orbital/core";

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
    <fieldset className="space-y-1">
      <legend className="mb-1 text-sm font-semibold text-slate-300">Visual layers</legend>
      {layers.map((layer) => (
        <label key={layer.id} className="flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={values[layer.id] ?? false}
            onChange={(e) => onChange(layer.id, e.target.checked)}
            className="accent-accent"
          />
          {layer.label}
        </label>
      ))}
    </fieldset>
  );
}
