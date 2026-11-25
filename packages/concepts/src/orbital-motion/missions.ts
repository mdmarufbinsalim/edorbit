import type { MissionDefinition } from "@orbital/core";
import { hitsGround, initialElements, type OrbitalMotionParams } from "./model";

const hours = (s: number) => s / 3600;

export const missions: readonly MissionDefinition<OrbitalMotionParams>[] = [
  {
    id: "circle",
    title: "Draw a perfect circle",
    goal: "Get the orbit shape to say **circle**.",
    hint: "At 1,600 km up, try launching at about 7.07 km/s.",
    check: (p) => {
      const el = initialElements(p);
      return el.eccentricity < 0.02 && !hitsGround(el);
    },
    success:
      "Gravity is bending your path at exactly the rate you're moving sideways. You fall forever and never get closer.",
  },
  {
    id: "iss",
    title: "Fly with the space station",
    goal: "Orbit in a circle about 420 km up, where the ISS lives.",
    hint: "Set the height to about 420 km, then find the circle speed. It's near 7.66 km/s.",
    check: (p) =>
      p.altitude >= 380_000 && p.altitude <= 460_000 && initialElements(p).eccentricity < 0.02,
    success: "One lap every ~93 minutes. Astronauts on the ISS see about 16 sunrises every day!",
  },
  {
    id: "geo",
    title: "Hover over one spot",
    goal: "Make one lap take exactly one day, on a circle.",
    hint: "Go way up, to about 35,800 km, and launch at about 3.07 km/s.",
    check: (p) => {
      const el = initialElements(p);
      return el.eccentricity < 0.05 && hours(el.period) > 23.7 && hours(el.period) < 24.2;
    },
    success:
      "That's geostationary orbit. Earth spins once a day too, so you stay above the same place. TV and weather satellites park here.",
  },
  {
    id: "escape",
    title: "Escape Earth",
    goal: "Launch fast enough that Earth never pulls you back.",
    hint: "Try about 1.41 × (√2 ×) your circle speed.",
    check: (p) => initialElements(p).specificEnergy >= 0,
    success:
      "You beat escape speed! You'll keep slowing down forever, but you'll never stop or come back.",
  },
];
