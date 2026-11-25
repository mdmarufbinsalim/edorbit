import { EARTH, G, type CalculatorDefinition } from "@orbital/core";
import {
  gravitationalForce,
  orbitalPeriod,
  specificOrbitalEnergy,
  visVivaSpeed,
} from "@orbital/physics";

const km = 1000;

export const calculators: readonly CalculatorDefinition[] = [
  {
    id: "gravitation-calc",
    equationId: "gravitation",
    title: "Gravitational force calculator",
    inputs: [
      { key: "M", label: "Central mass M", unit: "kg", defaultValue: EARTH.mass },
      { key: "m", label: "Orbiter mass m", unit: "kg", defaultValue: 1000, min: 0 },
      { key: "r", label: "Distance r", unit: "km", defaultValue: 6771, min: 1 },
    ],
    outputs: [
      { label: "F", unit: "N", compute: ({ M, m, r }) => gravitationalForce(M!, m!, r! * km) },
      { label: "g = GM/r²", unit: "m/s²", compute: ({ M, r }) => (G * M!) / (r! * km) ** 2 },
    ],
  },
  {
    id: "vis-viva-calc",
    equationId: "vis-viva",
    title: "Vis-viva calculator (Earth)",
    inputs: [
      { key: "r", label: "Distance r", unit: "km", defaultValue: 6678, min: 1 },
      { key: "a", label: "Semi-major axis a", unit: "km", defaultValue: 24421 },
    ],
    outputs: [
      {
        label: "v",
        unit: "km/s",
        compute: ({ r, a }) => visVivaSpeed(EARTH.mu, r! * km, a! * km) / km,
      },
      {
        label: "v_circular at r",
        unit: "km/s",
        compute: ({ r }) => Math.sqrt(EARTH.mu / (r! * km)) / km,
      },
    ],
  },
  {
    id: "kepler-calc",
    equationId: "kepler-third",
    title: "Orbital period calculator (Earth)",
    inputs: [{ key: "a", label: "Semi-major axis a", unit: "km", defaultValue: 6798, min: 1 }],
    outputs: [
      { label: "T", unit: "min", compute: ({ a }) => orbitalPeriod(EARTH.mu, a! * km) / 60 },
      { label: "T", unit: "h", compute: ({ a }) => orbitalPeriod(EARTH.mu, a! * km) / 3600 },
    ],
  },
  {
    id: "energy-calc",
    equationId: "energy",
    title: "Specific energy calculator (Earth)",
    inputs: [
      { key: "r", label: "Distance r", unit: "km", defaultValue: 6798, min: 1 },
      { key: "v", label: "Speed v", unit: "km/s", defaultValue: 7.657, min: 0 },
    ],
    outputs: [
      {
        label: "ε",
        unit: "MJ/kg",
        compute: ({ r, v }) => specificOrbitalEnergy(EARTH.mu, r! * km, v! * km) / 1e6,
      },
      {
        label: "a = −μ/2ε",
        unit: "km",
        compute: ({ r, v }) =>
          -EARTH.mu / (2 * specificOrbitalEnergy(EARTH.mu, r! * km, v! * km)) / km,
      },
    ],
  },
];
