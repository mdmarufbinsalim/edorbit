"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ParameterSlider, SketchPlanet, useRafLoop } from "@edorbit/ui";
import { BODY_RADIUS } from "../model";

import { ALTITUDE, EARTH_PX, VIEW, simulateShot, toSvg } from "./cannon-physics";

type Shot = ReturnType<typeof simulateShot> & { id: number; v0: number };

export default function NewtonsCannon() {
  const [v0, setV0] = useState(5_000);
  const [shots, setShots] = useState<Shot[]>([]);
  const ball = useRef<SVGCircleElement>(null);
  const fireTime = useRef<number | null>(null);
  const latest = shots[shots.length - 1];
  const view = latest
    ? Math.min(
        560,
        Math.max(VIEW, ...latest.points.map((p) => Math.max(Math.abs(p[0]), Math.abs(p[1])) + 30)),
      )
    : VIEW;

  const fire = () => {
    fireTime.current = null;
    setShots((s) => [...s.slice(-3), { ...simulateShot(v0), id: Date.now(), v0 }]);
  };

  // Move the ball along the latest path over ~1.8 s.
  useRafLoop((t) => {
    const el = ball.current;
    if (!el || !latest) return;
    if (fireTime.current === null) fireTime.current = t;
    const f = Math.min(1, (t - fireTime.current) / 1.8);
    const p = latest.points[Math.floor(f * (latest.points.length - 1))];
    if (p) {
      el.setAttribute("cx", String(p[0]));
      el.setAttribute("cy", String(p[1]));
    }
  });

  const launch = useMemo(() => toSvg([BODY_RADIUS + ALTITUDE, 0, 0]), []);

  return (
    <div className="grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_280px]">
      <motion.svg
        initial={false}
        animate={{ viewBox: `${-view} ${-view} ${2 * view} ${2 * view}` }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        viewBox={`${-VIEW} ${-VIEW} ${2 * VIEW} ${2 * VIEW}`}
        className="mx-auto w-full max-w-[520px]"
        role="img"
        aria-label={latest ? latest.outcome.text : "Earth with a cannon on a very tall mountain"}
      >
        <defs>
          <clipPath id="cannon-sky">
            <rect x={-600} y={-600} width={1200} height={1200} />
          </clipPath>
        </defs>
        <SketchPlanet r={EARTH_PX} />
        <path
          d={`M -14 ${-EARTH_PX + 2} L 0 ${launch[1]} L 14 ${-EARTH_PX + 2}`}
          fill="var(--paper)"
          stroke="var(--ink)"
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        {/* Cannon seated on the peak, barrel pointing along the launch direction. */}
        <rect x={-3} y={launch[1] - 7} width={18} height={6} rx={1.5} fill="var(--ink)" />
        <circle
          cx={1}
          cy={launch[1] - 1}
          r={3.5}
          fill="var(--paper)"
          stroke="var(--ink)"
          strokeWidth={2}
        />
        <g clipPath="url(#cannon-sky)">
          {shots.slice(0, -1).map((s) => (
            <path
              key={s.id}
              d={s.d}
              fill="none"
              stroke="var(--faint)"
              strokeWidth={2}
              strokeDasharray="1 7"
              strokeLinecap="round"
            />
          ))}
          {latest && (
            <motion.path
              key={latest.id}
              d={latest.d}
              fill="none"
              stroke="var(--ink)"
              strokeWidth={2.5}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.8, ease: "linear" }}
            />
          )}
        </g>
        {latest && <circle ref={ball} r={6} cx={launch[0]} cy={launch[1]} fill="var(--ink)" />}
      </motion.svg>
      <div className="space-y-6">
        <ParameterSlider
          label="Cannon speed"
          unit="km/s"
          value={v0}
          min={0}
          max={11_000}
          step={100}
          displayScale={1 / 1000}
          onChange={setV0}
        />
        <button
          type="button"
          onClick={fire}
          className="w-full rounded-full border-[2.5px] border-[var(--ink)] bg-[var(--ink)] py-3 text-lg font-medium text-[var(--paper)] transition hover:-translate-y-0.5 active:translate-y-0"
        >
          Fire!
        </button>
        <p className="min-h-14 text-lg" aria-live="polite">
          {latest ? (
            <motion.span
              key={latest.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
            >
              {latest.outcome.text}
            </motion.span>
          ) : (
            <span className="text-muted">Try 4, then 7.4, then 9, then 11 km/s.</span>
          )}
        </p>
      </div>
    </div>
  );
}
