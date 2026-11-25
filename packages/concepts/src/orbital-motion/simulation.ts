import type { SimulationSpec } from "@orbital/core";
import { length, type TwoBodyState } from "@orbital/physics";
import {
  BODY_RADIUS,
  MU,
  createModel,
  elementsOf,
  formatDuration,
  hitsGround,
  initialElements,
  radiusOf,
  shapeName,
  speedForEccentricity,
  type OrbitalMotionParams,
} from "./model";

const km = 1000;

export const defaultParameters: OrbitalMotionParams = {
  altitude: 1_600_000,
  v0: 8_000,
  flightPathAngle: 0,
};

export const simulation: SimulationSpec<TwoBodyState, OrbitalMotionParams> = {
  defaultParameters,
  createModel,
  fixedTimestep: 5,
  defaultTimeScale: 600,
  timeScales: [
    { label: "Slow", value: 120 },
    { label: "Normal", value: 600 },
    { label: "Fast", value: 1800 },
    { label: "Super fast", value: 7200 },
  ],
  parameterDefinitions: [
    {
      key: "altitude",
      label: "Launch height",
      unit: "km",
      min: 200_000,
      max: 40_000_000,
      step: 10_000,
      displayScale: 1 / km,
    },
    {
      key: "v0",
      label: "Launch speed",
      unit: "km/s",
      min: 1_000,
      max: 12_000,
      step: 10,
      displayScale: 1 / km,
    },
    {
      key: "flightPathAngle",
      label: "Launch angle (up from flat)",
      unit: "°",
      min: -60,
      max: 60,
      step: 1,
      advanced: true,
    },
  ],
  derivedControls: [
    {
      id: "eccentricity",
      label: "Squish (eccentricity)",
      unit: "",
      min: 0,
      max: 0.95,
      step: 0.01,
      advanced: true,
      get: (p) => Math.min(initialElements(p).eccentricity, 0.95),
      set: (e, p) => ({ v0: Math.round(speedForEccentricity(radiusOf(p), e)), flightPathAngle: 0 }),
      description:
        "Sets the launch speed so you start at the closest point of an orbit this squished.",
    },
  ],
  visualLayers: [
    { id: "orbit", label: "Path ahead", defaultVisible: true },
    { id: "trail", label: "Trail", defaultVisible: true },
    { id: "velocity", label: "Speed arrow", defaultVisible: true },
    { id: "acceleration", label: "Gravity arrow", defaultVisible: true },
    { id: "apsides", label: "Closest & farthest", defaultVisible: false },
    { id: "radius", label: "Line to Earth", defaultVisible: false },
    { id: "labels", label: "Labels", defaultVisible: true },
  ],
  readouts: [
    {
      id: "speed",
      label: "Speed",
      unit: "km/s",
      basic: true,
      value: (s) => length(s.velocity) / km,
    },
    {
      id: "altitude",
      label: "Height",
      unit: "km",
      basic: true,
      value: (s) => Math.max(0, length(s.position) - BODY_RADIUS) / km,
    },
    {
      id: "type",
      label: "Orbit shape",
      unit: "",
      basic: true,
      value: (s) => shapeName(elementsOf(s), s.impacted),
    },
    {
      id: "period",
      label: "One lap takes",
      unit: "",
      basic: true,
      value: (s) => (hitsGround(elementsOf(s)) ? "—" : formatDuration(elementsOf(s).period)),
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
      label: "Closest height",
      unit: "km",
      value: (s) => (elementsOf(s).periapsis - BODY_RADIUS) / km,
    },
    {
      id: "apoapsis",
      label: "Farthest height",
      unit: "km",
      value: (s) => (elementsOf(s).apoapsis - BODY_RADIUS) / km,
    },
    {
      id: "energy",
      label: "Energy per kg ε",
      unit: "MJ/kg",
      value: (s) => elementsOf(s).specificEnergy / 1e6,
      description: "Stays constant along an orbit.",
    },
    {
      id: "areal",
      label: "Area swept dA/dt",
      unit: "km²/s",
      value: (s) => length(elementsOf(s).angularMomentum) / 2 / 1e6,
      description: "Kepler's 2nd law: stays constant.",
    },
    { id: "accel", label: "Gravity pull |a|", unit: "m/s²", value: (s) => length(s.acceleration) },
    {
      id: "escape",
      label: "Escape speed here",
      unit: "km/s",
      value: (s) => Math.sqrt((2 * MU) / length(s.position)) / km,
    },
  ],
};
