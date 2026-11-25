import type { SimulationSpec } from "@orbital/core";
import { length, type TwoBodyState } from "@orbital/physics";
import {
  BODY_RADIUS,
  MU,
  createModel,
  initialElements,
  speedForEccentricity,
  elementsOf,
  type OrbitalMotionParams,
} from "./model";

const km = 1000;

export const defaultParameters: OrbitalMotionParams = {
  r0: 8_000_000,
  v0: 8_000,
  flightPathAngle: 0,
};

export const simulation: SimulationSpec<TwoBodyState, OrbitalMotionParams> = {
  defaultParameters,
  createModel,
  fixedTimestep: 5,
  defaultTimeScale: 600,
  timeScales: [
    { label: "60× (1 min/s)", value: 60 },
    { label: "300× (5 min/s)", value: 300 },
    { label: "600× (10 min/s)", value: 600 },
    { label: "1800× (30 min/s)", value: 1800 },
    { label: "3600× (1 h/s)", value: 3600 },
  ],
  parameterDefinitions: [
    {
      key: "r0",
      label: "Initial distance from Earth's centre",
      unit: "km",
      min: 6_700_000,
      max: 45_000_000,
      step: 10_000,
      displayScale: 1 / km,
      description: "Earth's mean radius is 6371 km.",
    },
    {
      key: "v0",
      label: "Initial speed",
      unit: "km/s",
      min: 1_000,
      max: 14_000,
      step: 10,
      displayScale: 1 / km,
    },
    {
      key: "flightPathAngle",
      label: "Flight-path angle",
      unit: "°",
      min: -60,
      max: 60,
      step: 1,
      description: "Angle of the launch velocity above the local horizontal.",
    },
  ],
  derivedControls: [
    {
      id: "eccentricity",
      label: "Eccentricity (horizontal launch)",
      unit: "",
      min: 0,
      max: 0.95,
      step: 0.01,
      get: (p) => Math.min(initialElements(p).eccentricity, 0.95),
      set: (e, p) => ({ v0: Math.round(speedForEccentricity(p.r0, e)), flightPathAngle: 0 }),
      description:
        "Sets the launch speed so the start point is periapsis of an orbit with this eccentricity.",
    },
  ],
  visualLayers: [
    { id: "orbit", label: "Predicted orbit", defaultVisible: true },
    { id: "trail", label: "Trail (integrated path)", defaultVisible: true },
    { id: "velocity", label: "Velocity vector", defaultVisible: true },
    { id: "acceleration", label: "Acceleration vector", defaultVisible: true },
    { id: "apsides", label: "Periapsis / apoapsis", defaultVisible: true },
    { id: "radius", label: "Radius vector (Kepler's 2nd law)", defaultVisible: false },
    { id: "labels", label: "Labels", defaultVisible: true },
  ],
  readouts: [
    { id: "r", label: "Distance r", unit: "km", value: (s) => length(s.position) / km },
    {
      id: "altitude",
      label: "Altitude",
      unit: "km",
      value: (s) => (length(s.position) - BODY_RADIUS) / km,
    },
    { id: "speed", label: "Speed v", unit: "km/s", value: (s) => length(s.velocity) / km },
    { id: "accel", label: "Acceleration |a|", unit: "m/s²", value: (s) => length(s.acceleration) },
    {
      id: "escape",
      label: "Escape speed at r",
      unit: "km/s",
      value: (s) => Math.sqrt((2 * MU) / length(s.position)) / km,
    },
    {
      id: "type",
      label: "Orbit type",
      unit: "",
      value: (s) => (s.impacted ? "impact" : elementsOf(s).type),
    },
    {
      id: "a",
      label: "Semi-major axis a",
      unit: "km",
      value: (s) => elementsOf(s).semiMajorAxis / km,
    },
    { id: "e", label: "Eccentricity e", unit: "", value: (s) => elementsOf(s).eccentricity },
    {
      id: "periapsis",
      label: "Periapsis altitude",
      unit: "km",
      value: (s) => (elementsOf(s).periapsis - BODY_RADIUS) / km,
    },
    {
      id: "apoapsis",
      label: "Apoapsis altitude",
      unit: "km",
      value: (s) => (elementsOf(s).apoapsis - BODY_RADIUS) / km,
    },
    { id: "period", label: "Period T", unit: "min", value: (s) => elementsOf(s).period / 60 },
    {
      id: "energy",
      label: "Specific energy ε",
      unit: "MJ/kg",
      value: (s) => elementsOf(s).specificEnergy / 1e6,
      description: "Constant along an orbit; small drift is numerical error.",
    },
    {
      id: "h",
      label: "Angular momentum h",
      unit: "km²/s",
      value: (s) => length(elementsOf(s).angularMomentum) / 1e6,
    },
    {
      id: "areal",
      label: "Areal velocity dA/dt",
      unit: "km²/s",
      value: (s) => length(elementsOf(s).angularMomentum) / 2 / 1e6,
      description: "Kepler's second law: constant.",
    },
  ],
};
