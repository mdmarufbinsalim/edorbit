/**
 * Maps SI metres to render units. Rendering scale is a display concern only;
 * physics always runs in metres.
 */
export const createLinearScale = (metresPerUnit: number) => ({
  toScene: (metres: number) => metres / metresPerUnit,
  toMetres: (units: number) => units * metresPerUnit,
});

export type Tuple3 = readonly [number, number, number];

/**
 * Physics uses a right-handed frame with orbits in the x–y plane (z = angular
 * momentum). Three.js is y-up, so map physics (x, y, z) → scene (x, z, −y)
 * to lay the orbital plane flat, then scale to render units.
 */
export const physicsToScene = (v: Tuple3, metresPerUnit: number): [number, number, number] => [
  v[0] / metresPerUnit,
  v[2] / metresPerUnit,
  -v[1] / metresPerUnit,
];
