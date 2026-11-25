import type { ExperimentDefinition } from "@orbital/core";
import { circularSpeed } from "@orbital/physics";
import { MU, speedForEccentricity, type OrbitalMotionParams } from "./model";

const r0 = 8_000_000;
const round = (v: number) => Math.round(v);

export const experiments: readonly ExperimentDefinition<OrbitalMotionParams>[] = [
  {
    id: "circular",
    title: "Find the circular orbit",
    question: "At 8000 km from Earth's centre, what launch speed gives a perfect circle?",
    predictionPrompt: "Predict the speed, then compare with $v_c = \\sqrt{\\mu/r}$.",
    choices: [
      "About 5.0 km/s",
      "About 7.06 km/s",
      "About 9.98 km/s",
      "Any speed works if you launch horizontally",
    ],
    answerIndex: 1,
    setup: { r0, v0: round(circularSpeed(MU, r0)), flightPathAngle: 0 },
    watch: ["e", "speed", "r"],
    explanation:
      "$v_c = \\sqrt{3.986\\times10^{14}/8\\times10^6} \\approx 7.06$ km/s. Eccentricity reads ≈ 0 and the distance stays constant. Gravity bends the path exactly as fast as the satellite moves sideways.",
  },
  {
    id: "faster",
    title: "Launch 15% faster",
    question:
      "Starting from the circular orbit, what happens if the satellite launches 15% faster?",
    predictionPrompt: "What shape will the new orbit have?",
    choices: [
      "A bigger circle",
      "An ellipse with the launch point as its closest point",
      "It escapes Earth",
      "An ellipse with the launch point as its farthest point",
    ],
    answerIndex: 1,
    setup: { r0, v0: round(1.15 * circularSpeed(MU, r0)), flightPathAngle: 0 },
    watch: ["e", "periapsis", "apoapsis", "speed"],
    explanation:
      "Extra speed raises the energy, so a grows. The launch point stays the periapsis, and the orbiter climbs to an apoapsis on the far side. Here e = 1.15² − 1 ≈ 0.32.",
  },
  {
    id: "double-a",
    title: "Double the orbit size",
    question:
      "If a circular orbit's radius doubles from 8000 km to 16 000 km, how does the period change?",
    predictionPrompt: "Use Kepler's third law, $T \\propto a^{3/2}$.",
    choices: ["×2", "×2.83", "×4", "×8"],
    answerIndex: 1,
    setup: { r0: 2 * r0, v0: round(circularSpeed(MU, 2 * r0)), flightPathAngle: 0 },
    watch: ["period", "speed"],
    explanation:
      "$T \\propto a^{3/2}$, so doubling a multiplies T by $2^{3/2} \\approx 2.83$ (from about 119 min to about 337 min). The orbiter also moves slower: $v_c \\propto 1/\\sqrt{r}$.",
  },
  {
    id: "equal-areas",
    title: "Equal areas in equal times",
    question:
      "On a very elongated orbit (e = 0.7) the speed varies enormously. Does anything stay constant?",
    predictionPrompt:
      "Watch the speed and the areal velocity as the orbiter goes round. Turn on the radius-vector layer.",
    setup: { r0, v0: round(speedForEccentricity(r0, 0.7)), flightPathAngle: 0 },
    watch: ["speed", "r", "areal", "energy"],
    explanation:
      "Speed falls by a factor of $(1+e)/(1-e) \\approx 5.7$ from periapsis to apoapsis, yet dA/dt = h/2 stays constant. Gravity is central, so it exerts no torque. That is Kepler's second law. Specific energy is also constant.",
  },
  {
    id: "escape",
    title: "Launch at √2 × circular speed",
    question: "What happens at exactly $\\sqrt{2}$ times the circular speed?",
    predictionPrompt: "Will the orbiter come back?",
    choices: [
      "It returns on a very large ellipse",
      "It escapes on a parabola: total energy ε = 0",
      "It falls into Earth",
    ],
    answerIndex: 1,
    setup: { r0, v0: round(Math.SQRT2 * circularSpeed(MU, r0)), flightPathAngle: 0 },
    watch: ["energy", "type", "escape", "speed"],
    explanation:
      "At $v = \\sqrt{2\\mu/r}$ kinetic energy exactly cancels potential energy (ε ≈ 0). The orbiter slows forever but never returns. The Escape Velocity concept explores this boundary.",
  },
];
