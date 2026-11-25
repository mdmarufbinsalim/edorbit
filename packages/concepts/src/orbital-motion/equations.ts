import type { EquationDefinition } from "@orbital/core";

const mu = {
  symbol: "\\mu",
  name: "Gravitational parameter",
  unit: "m³/s²",
  description: "μ = GM of the central body (Earth: 3.986 × 10¹⁴ m³/s²)",
};
const r = {
  symbol: "r",
  name: "Distance",
  unit: "m",
  description: "Distance from the centre of the central body",
};
const a = {
  symbol: "a",
  name: "Semi-major axis",
  unit: "m",
  description: "Half the longest diameter of the ellipse",
};
const v = {
  symbol: "v",
  name: "Speed",
  unit: "m/s",
  description: "Orbital speed relative to the central body",
};

export const equations: readonly EquationDefinition[] = [
  {
    id: "gravitation",
    name: "Newton's law of universal gravitation",
    latex: "F = \\frac{G M m}{r^2}",
    description:
      "Every mass attracts every other mass along the line joining them, with a force that falls off with the square of distance.",
    variables: [
      { symbol: "F", name: "Force", unit: "N", description: "Magnitude of the attractive force" },
      {
        symbol: "G",
        name: "Gravitational constant",
        unit: "m³ kg⁻¹ s⁻²",
        description: "6.6743 × 10⁻¹¹",
      },
      { symbol: "M", name: "Central mass", unit: "kg", description: "Mass of the planet or star" },
      { symbol: "m", name: "Orbiter mass", unit: "kg", description: "Mass of the satellite" },
      r,
    ],
    assumptions: [
      "Both bodies are point masses or spherically symmetric.",
      "Speeds are far below the speed of light (no relativistic corrections).",
    ],
    intuition:
      "Doubling the distance spreads the same 'pull' over four times the area, so the force drops to a quarter.",
    workedExample: {
      prompt: "Force on a 1000 kg satellite at $r = 6771$ km (400 km altitude).",
      steps: [
        "F = \\frac{(6.6743\\times10^{-11})(5.9722\\times10^{24})(1000)}{(6.771\\times10^{6})^2}",
        "F \\approx 8.69 \\times 10^{3}\\ \\text{N}",
      ],
      result:
        "About 8.7 kN, roughly 89% of its weight on the ground. Astronauts float because they are falling, not because gravity vanished.",
    },
  },
  {
    id: "acceleration",
    name: "Two-body equation of motion",
    latex: "\\ddot{\\vec r} = -\\frac{\\mu}{r^3}\\,\\vec r",
    description:
      "Dividing Newton's force by the orbiter's mass gives its acceleration. It always points at the central body. This is the equation the simulation integrates.",
    variables: [
      {
        symbol: "\\vec r",
        name: "Position vector",
        unit: "m",
        description: "From the central body's centre to the orbiter",
      },
      mu,
      r,
    ],
    assumptions: [
      "The central body is much more massive than the orbiter, so it stays fixed.",
      "No drag, thrust, or third bodies.",
    ],
    validity:
      "Satellites around a planet, planets around the Sun, as long as other perturbations are small.",
  },
  {
    id: "vis-viva",
    name: "Vis-viva equation",
    latex: "v^2 = \\mu\\left(\\frac{2}{r} - \\frac{1}{a}\\right)",
    description:
      "Relates speed at any point of an orbit to the distance at that point and the size of the orbit. It is conservation of energy written for Keplerian orbits.",
    variables: [v, mu, r, a],
    assumptions: ["Two-body motion."],
    validity: "All conic orbits: a > 0 for ellipses, a → ∞ for parabolas, a < 0 for hyperbolas.",
    workedExample: {
      prompt:
        "A geostationary transfer orbit has perigee 6678 km and apogee 42 164 km. Find the speed at perigee.",
      steps: [
        "a = \\tfrac{6678 + 42164}{2} = 24421\\ \\text{km}",
        "v_p = \\sqrt{3.986\\times10^{14}\\left(\\tfrac{2}{6.678\\times10^6} - \\tfrac{1}{2.4421\\times10^7}\\right)}",
      ],
      result: "$v_p \\approx 10.15$ km/s, while at apogee $v_a \\approx 1.61$ km/s.",
    },
  },
  {
    id: "circular-speed",
    name: "Circular orbital speed",
    latex: "v = \\sqrt{\\frac{G M}{r}}",
    description:
      "Setting r = a in vis-viva gives the speed for a circular orbit. Gravity supplies exactly the centripetal acceleration $v^2/r$.",
    variables: [
      { ...v, name: "Circular speed" },
      {
        symbol: "G",
        name: "Gravitational constant",
        unit: "m³ kg⁻¹ s⁻²",
        description: "6.6743 × 10⁻¹¹",
      },
      { symbol: "M", name: "Central mass", unit: "kg", description: "Earth: 5.97 × 10²⁴ kg" },
      r,
    ],
  },
  {
    id: "kepler-third",
    name: "Kepler's third law",
    latex: "T^2 = \\frac{4\\pi^2 a^3}{\\mu}",
    description:
      "The square of the orbital period is proportional to the cube of the semi-major axis. Orbit shape (eccentricity) does not matter.",
    variables: [
      { symbol: "T", name: "Period", unit: "s", description: "Time for one complete orbit" },
      a,
      mu,
    ],
    assumptions: [
      "Bound (elliptical or circular) two-body orbit.",
      "Orbiter mass negligible compared with the central body.",
    ],
    workedExample: {
      prompt: "Period of the ISS at about 420 km altitude.",
      steps: [
        "a = 6378 + 420 = 6798\\ \\text{km}",
        "T = 2\\pi\\sqrt{\\frac{(6.798\\times10^6)^3}{3.986\\times10^{14}}} \\approx 5578\\ \\text{s}",
      ],
      result: "About 93.0 minutes, close to the ISS's observed period.",
    },
  },
  {
    id: "energy",
    name: "Specific orbital energy",
    latex: "\\varepsilon = \\frac{v^2}{2} - \\frac{\\mu}{r} = -\\frac{\\mu}{2a}",
    description:
      "Kinetic plus potential energy per kilogram. It stays constant along an orbit and depends only on the semi-major axis.",
    variables: [
      {
        symbol: "\\varepsilon",
        name: "Specific energy",
        unit: "J/kg",
        description: "Negative means bound, zero is parabolic escape, positive is hyperbolic",
      },
      v,
      r,
      mu,
      a,
    ],
  },
  {
    id: "angular-momentum",
    name: "Angular momentum and Kepler's second law",
    latex: "\\vec h = \\vec r \\times \\vec v, \\qquad \\frac{dA}{dt} = \\frac{h}{2}",
    description:
      "Gravity is a central force, so it cannot exert torque about the central body. Angular momentum is conserved, which is why the line to the orbiter sweeps equal areas in equal times.",
    variables: [
      {
        symbol: "\\vec h",
        name: "Specific angular momentum",
        unit: "m²/s",
        description: "Perpendicular to the orbital plane",
      },
      {
        symbol: "A",
        name: "Swept area",
        unit: "m²",
        description: "Area swept by the radius vector",
      },
    ],
    intuition:
      "Close to the planet r is small, so v must be large to keep r × v constant. The orbiter speeds up at periapsis.",
  },
  {
    id: "apsides",
    name: "Periapsis and apoapsis",
    latex: "r_p = a(1-e), \\qquad r_a = a(1+e)",
    description:
      "The closest and farthest distances of an elliptical orbit, set by its size a and eccentricity e (0 = circle, approaching 1 = very elongated).",
    variables: [
      { symbol: "r_p", name: "Periapsis", unit: "m", description: "Closest approach" },
      { symbol: "r_a", name: "Apoapsis", unit: "m", description: "Farthest point" },
      a,
      { symbol: "e", name: "Eccentricity", unit: "—", description: "Shape of the conic" },
    ],
  },
];
