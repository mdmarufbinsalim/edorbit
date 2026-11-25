import { EARTH, type CalculatorDefinition, type FeaturedFormula } from "@edorbit/core";
import { circularSpeed, orbitalPeriod } from "@edorbit/physics";

const km = 1000;
const r = (altitudeKm: number) => EARTH.meanRadius + altitudeKm * km;

export const calculators: readonly CalculatorDefinition[] = [
  {
    id: "circle-speed",
    equationId: "circular-speed",
    title: "Circle speed playground",
    inputs: [
      {
        key: "h",
        label: "Height above Earth",
        unit: "km",
        defaultValue: 420,
        min: 160,
        max: 40_000,
        step: 10,
      },
    ],
    outputs: [
      {
        label: "Speed you need",
        unit: "km/s",
        compute: ({ h }) => circularSpeed(EARTH.mu, r(h!)) / km,
        say: (v) => {
          const kmh = v * 3600;
          const nyc = (5570 / kmh) * 60;
          return `That's ${Math.round(kmh).toLocaleString("en-US")} km/h. London to New York in ${nyc < 60 ? `${Math.round(nyc)} minutes` : `${(nyc / 60).toFixed(1)} hours`}.`;
        },
      },
      {
        label: "One lap takes",
        unit: "hours",
        compute: ({ h }) => orbitalPeriod(EARTH.mu, r(h!)) / 3600,
        say: (t) =>
          t < 24
            ? `About ${Math.round(24 / t)} laps every day.`
            : `Longer than a day: ${(t / 24).toFixed(1)} days per lap.`,
      },
    ],
  },
];

export const formula: FeaturedFormula = {
  equationId: "circular-speed",
  calculatorId: "circle-speed",
  tagline: "How fast you must go sideways to keep falling around a planet without hitting it.",
  symbols: [
    { symbol: "v", plain: "the speed you need, sideways." },
    {
      symbol: "G",
      plain:
        "gravity's strength setting for the whole universe. It's tiny: $6.67 \\times 10^{-11}$.",
    },
    {
      symbol: "M",
      plain: "how heavy the planet is. Heavier planet, stronger pull, so you need more speed.",
    },
    {
      symbol: "r",
      plain:
        "how far you are from the planet's **centre**. Farther out, gravity is weaker, so you can go slower.",
    },
  ],
};
