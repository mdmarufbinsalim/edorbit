"use client";

import { useRef, useState } from "react";
import { AU, SUN } from "@orbital/core";
import { orbitalPeriod } from "@orbital/physics";
import { ParameterSlider, SketchPlanet, useRafLoop } from "@orbital/ui";

/** Kepler's 3rd law with the real Sun: drag a planet's distance, watch its year. */
const YEAR = orbitalPeriod(SUN.mu, AU);
const PLANETS = [
  { name: "Mercury", a: 0.387 },
  { name: "Venus", a: 0.723 },
  { name: "Earth", a: 1 },
  { name: "Mars", a: 1.524 },
  { name: "Jupiter", a: 5.203 },
];
const MAX_AU = 5.6;
const PX = 250 / MAX_AU;
/** One Earth year of animation lasts this many seconds. */
const SECONDS_PER_YEAR = 3;

export const yearsAt = (aAU: number) => orbitalPeriod(SUN.mu, aAU * AU) / YEAR;

export default function KeplerYears() {
  const [a, setA] = useState(2);
  const you = useRef<SVGCircleElement>(null);
  const earth = useRef<SVGCircleElement>(null);
  const years = yearsAt(a);

  useRafLoop((t) => {
    const place = (el: SVGCircleElement | null, r: number, T: number) => {
      if (!el) return;
      const ang = (2 * Math.PI * t) / (SECONDS_PER_YEAR * T);
      el.setAttribute("cx", String(Math.cos(ang) * r * PX));
      el.setAttribute("cy", String(-Math.sin(ang) * r * PX));
    };
    place(earth.current, 1, 1);
    place(you.current, a, yearsAt(a));
  });

  return (
    <div className="grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_280px]">
      <svg
        viewBox="-270 -270 540 540"
        className="mx-auto w-full max-w-[460px]"
        role="img"
        aria-label={`Your planet is ${a.toFixed(2)} times Earth's distance from the Sun. Its year is ${years.toFixed(2)} Earth years.`}
      >
        {PLANETS.map((p) => (
          <g key={p.name}>
            <circle
              r={p.a * PX}
              fill="none"
              stroke="var(--faint)"
              strokeWidth={1.5}
              strokeDasharray="1 6"
              strokeLinecap="round"
            />
            <text x={p.a * PX + 3} y={-4} fontSize={11} fill="var(--muted)">
              {p.name}
            </text>
          </g>
        ))}
        <circle r={a * PX} fill="none" stroke="var(--ink)" strokeWidth={2.5} />
        <SketchPlanet r={10} seed={5} />
        <circle ref={earth} r={5} fill="var(--muted)" />
        <circle ref={you} r={8} fill="var(--paper)" stroke="var(--ink)" strokeWidth={2.5} />
      </svg>
      <div className="space-y-6">
        <ParameterSlider
          label="Distance from the Sun"
          unit="× Earth's"
          value={a}
          min={0.3}
          max={MAX_AU}
          step={0.05}
          onChange={setA}
        />
        <div>
          <p className="text-sm text-muted">Your planet's year</p>
          <p className="text-4xl font-medium tabular-nums">
            {years.toFixed(2)} <span className="text-lg text-muted">Earth years</span>
          </p>
          <p className="mt-1 text-muted">
            That's {Math.round(years * 365.25).toLocaleString("en-US")} days. The grey dot is Earth,
            for comparison.
          </p>
        </div>
      </div>
    </div>
  );
}
