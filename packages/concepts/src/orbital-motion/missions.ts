import type { MissionDefinition } from "@orbital/core";
import { hitsGround, initialElements, type OrbitalMotionParams } from "./model";

const hours = (s: number) => s / 3600;

export const missions: readonly MissionDefinition<OrbitalMotionParams>[] = [
  {
    id: "circle",
    title: "Draw a perfect circle",
    goal: "Get the orbit shape to say **circle**.",
    hint: "At 1,600 km up, try launching at about 7.07 km/s.",
    explain:
      "A circle needs gravity's pull to exactly match the turn your path makes. That only happens at one speed for each height: $v = \\sqrt{GM/r}$. Slower and you dip into an oval that swings closer. Faster and you swing out wider.",
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
    explain:
      "Low orbits need the most speed, because gravity is strongest close to Earth. At 420 km gravity is still about 90% as strong as on the ground. That's why the ISS has to race round at about 28,000 km/h.",
    check: (p) =>
      p.altitude >= 380_000 && p.altitude <= 460_000 && initialElements(p).eccentricity < 0.02,
    success: "One lap every ~93 minutes. Astronauts on the ISS see about 16 sunrises every day!",
  },
  {
    id: "geo",
    title: "Hover over one spot",
    goal: "Make one lap take exactly one day, on a circle.",
    hint: "Go way up, to about 35,800 km, and launch at about 3.07 km/s.",
    explain:
      "Higher orbits are bigger and slower, so a lap takes longer: $T^2 \\propto r^3$. Climb high enough and one lap takes exactly as long as Earth takes to spin once. That height is about 35,800 km.",
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
    explain:
      "Moving fast gives you energy, and climbing away from Earth costs energy. At $\\sqrt{2}$ times the circle speed you have exactly enough to climb out forever. That's escape speed. Any less and gravity eventually wins and pulls you back.",
    check: (p) => initialElements(p).specificEnergy >= 0,
    success:
      "You beat escape speed! You'll keep slowing down forever, but you'll never stop or come back.",
  },
];
