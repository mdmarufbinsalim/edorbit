"use client";

import { useMemo, useRef, useState } from "react";
import { sampleTrajectory } from "@orbital/core";
import { length, type Vec3 } from "@orbital/physics";
import { ParameterSlider, SketchPlanet, useRafLoop } from "@orbital/ui";
import { BODY_RADIUS, createModel, initialElements, speedForEccentricity } from "../model";

/** Kepler's 2nd law: dots dropped at equal time intervals on a real integrated ellipse. */
const PERIAPSIS = 9_000_000; // m from Earth's centre
const DOTS = 16;
const FINE = 1600;

function orbit(e: number) {
  const params = {
    altitude: PERIAPSIS - BODY_RADIUS,
    v0: speedForEccentricity(PERIAPSIS, e),
    flightPathAngle: 0,
  };
  const el = initialElements(params);
  const states = sampleTrajectory(
    createModel(params),
    { dt: el.period / FINE, steps: FINE },
    (s) => ({ p: s.position, v: length(s.velocity) }),
  );
  const a = el.semiMajorAxis;
  const ra = a * (1 + e);
  const b = a * Math.sqrt(1 - e * e);
  // Fit the ellipse (x from −ra to rp, y ±b) into a 600 × 360 box.
  const scale = Math.min(560 / (ra + PERIAPSIS), 320 / (2 * b));
  const cx = 300 - ((PERIAPSIS - ra) / 2) * scale;
  const toSvg = (p: Vec3): [number, number] => [cx + p[0] * scale, 180 - p[1] * scale];
  const pts = states.map((s) => toSvg(s.p));
  return {
    states,
    pts,
    scale,
    center: toSvg([0, 0, 0]),
    period: el.period,
    d:
      "M " +
      pts
        .filter((_, i) => i % 4 === 0)
        .map((p) => p.map((x) => x.toFixed(1)).join(" "))
        .join(" L ") +
      " Z",
  };
}

export default function EqualTimes() {
  const [e, setE] = useState(0.6);
  const o = useMemo(() => orbit(e), [e]);
  const sat = useRef<SVGCircleElement>(null);
  const speed = useRef<HTMLSpanElement>(null);
  const step = FINE / DOTS;
  const wedge = (k: number) => {
    const from = Math.round(k * step);
    const slice = o.pts.slice(from, from + Math.round(step) + 1);
    return `M ${o.center[0]} ${o.center[1]} L ` + slice.map((p) => p.join(" ")).join(" L ") + " Z";
  };

  useRafLoop((t) => {
    const i = Math.floor(((t / 8) % 1) * FINE);
    const p = o.pts[i];
    const s = o.states[i];
    if (p && sat.current) {
      sat.current.setAttribute("cx", String(p[0]));
      sat.current.setAttribute("cy", String(p[1]));
    }
    if (s && speed.current) speed.current.textContent = (s.v / 1000).toFixed(1);
  });

  return (
    <div className="space-y-6">
      <svg
        viewBox="0 0 600 360"
        className="w-full"
        role="img"
        aria-label={`An oval orbit with ${DOTS} dots placed at equal time intervals. Dots are far apart near Earth and bunched far away.`}
      >
        <defs>
          <pattern
            id="hatch"
            width="6"
            height="6"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line x1="0" y1="0" x2="0" y2="6" stroke="var(--ink)" strokeWidth="1.2" opacity="0.5" />
          </pattern>
        </defs>
        {[0, DOTS / 2].map((k) => (
          <path
            key={k}
            d={wedge(k)}
            fill="url(#hatch)"
            stroke="var(--ink)"
            strokeWidth={1}
            strokeDasharray="2 4"
          />
        ))}
        <path d={o.d} fill="none" stroke="var(--ink)" strokeWidth={2.5} />
        <SketchPlanet cx={o.center[0]} cy={o.center[1]} r={Math.max(BODY_RADIUS * o.scale, 8)} />
        {Array.from({ length: DOTS }, (_, k) => {
          const p = o.pts[Math.round(k * step)];
          return p ? <circle key={k} cx={p[0]} cy={p[1]} r={4} fill="var(--ink)" /> : null;
        })}
        <circle ref={sat} r={8} fill="var(--paper)" stroke="var(--ink)" strokeWidth={2.5} />
      </svg>
      <div className="grid gap-6 sm:grid-cols-2 sm:items-end">
        <ParameterSlider
          label="How squished?"
          unit=""
          value={e}
          min={0}
          max={0.8}
          step={0.05}
          onChange={setE}
        />
        <p className="text-lg">
          Speed right now:{" "}
          <span ref={speed} className="font-medium tabular-nums">
            0
          </span>{" "}
          km/s
          <span className="block text-sm text-muted">
            Each dot is {Math.round(o.period / DOTS / 60)} minutes apart. Both shaded slices took
            the same time.
          </span>
        </p>
      </div>
    </div>
  );
}
