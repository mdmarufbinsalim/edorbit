/**
 * Maps SI metres to render units. Rendering scale is a display concern only;
 * physics always runs in metres.
 */
export const createLinearScale = (metresPerUnit: number) => ({
  toScene: (metres: number) => metres / metresPerUnit,
  toMetres: (units: number) => units * metresPerUnit,
});
