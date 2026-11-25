"use client";

import { useEffect, useMemo, useState } from "react";
import { sampleTrajectory, type SceneProps } from "@orbital/core";
import { length, scale, type TwoBodyState } from "@orbital/physics";
import {
  CelestialBody,
  Follow,
  Label,
  Marker,
  SceneCanvas,
  Trail,
  Trajectory,
  VectorArrow,
  physicsToScene,
  useSimulationLoop,
} from "@orbital/rendering";
import { BODY_RADIUS, MU, createModel, initialElements, type OrbitalMotionParams } from "./model";

/** 1 scene unit = 1000 km. */
const M_PER_UNIT = 1e6;
const toScene = (v: readonly [number, number, number]) => physicsToScene(v, M_PER_UNIT);

type Props = SceneProps<TwoBodyState, OrbitalMotionParams>;

function Simulation({ engine, params, layers }: Props) {
  useSimulationLoop(engine);
  const el = useMemo(() => initialElements(params), [params]);

  const predicted = useMemo(() => {
    const model = createModel(params);
    const bound = Number.isFinite(el.period);
    const steps = 1440;
    const dt = bound ? el.period / steps : 60;
    const limit = 8 * params.r0;
    return sampleTrajectory(
      model,
      {
        dt,
        steps: bound ? steps : 4000,
        every: bound ? 1 : 4,
        stop: (s) => s.impacted || length(s.position) > limit,
      },
      (s) => toScene(s.position),
    );
  }, [params, el.period]);

  // Clear the trail whenever the engine resets (parameter change, reset, experiment).
  const [resetCount, setResetCount] = useState(0);
  useEffect(
    () => engine.subscribe((s) => s.stepCount === 0 && setResetCount((c) => c + 1)),
    [engine],
  );

  // Vector display scales: circular speed / gravity at r0 map to 35% of r0 on screen.
  const r0Units = params.r0 / M_PER_UNIT;
  const vScale = (0.35 * r0Units) / Math.sqrt(MU / params.r0);
  const aScale = (0.35 * r0Units) / (MU / params.r0 ** 2);

  const position = () => toScene(engine.snapshot().state.position);
  const eHat = el.eccentricity > 1e-3 ? scale(el.eccentricityVector, 1 / el.eccentricity) : null;
  const peri = eHat ? toScene(scale(eHat, el.periapsis)) : null;
  const apo = eHat && Number.isFinite(el.apoapsis) ? toScene(scale(eHat, -el.apoapsis)) : null;

  return (
    <>
      <CelestialBody radius={BODY_RADIUS / M_PER_UNIT} color="#2b6cb0" emissive="#0a1a33">
        {layers.labels && <Label offsetY={BODY_RADIUS / M_PER_UNIT + 0.4}>Earth</Label>}
      </CelestialBody>
      {layers.orbit && <Trajectory points={predicted} color="#4cc9f0" dashed opacity={0.6} />}
      {layers.trail && (
        <Trail get={position} color="#f4a261" resetKey={resetCount} maxPoints={4000} />
      )}
      {layers.apsides && peri && (
        <Marker position={peri} color="#80ffdb" size={0.15}>
          {layers.labels && <Label>Periapsis</Label>}
        </Marker>
      )}
      {layers.apsides && apo && (
        <Marker position={apo} color="#ff8fab" size={0.15}>
          {layers.labels && <Label>Apoapsis</Label>}
        </Marker>
      )}
      <Follow get={position}>
        <Marker color="#ffffff" size={0.18}>
          {layers.labels && <Label>Orbiter</Label>}
        </Marker>
      </Follow>
      {layers.velocity && (
        <VectorArrow
          color="#90e0ef"
          get={() => {
            const s = engine.snapshot().state;
            return {
              origin: toScene(s.position),
              vector: toScene(scale(s.velocity, vScale * M_PER_UNIT)),
            };
          }}
        />
      )}
      {layers.acceleration && (
        <VectorArrow
          color="#ffb703"
          get={() => {
            const s = engine.snapshot().state;
            return {
              origin: toScene(s.position),
              vector: toScene(scale(s.acceleration, aScale * M_PER_UNIT)),
            };
          }}
        />
      )}
      {layers.radius && (
        <VectorArrow
          color="#b8b8ff"
          get={() => ({ origin: [0, 0, 0], vector: toScene(engine.snapshot().state.position) })}
        />
      )}
    </>
  );
}

export default function OrbitalMotionScene(props: Props) {
  const extent =
    Math.min(
      Number.isFinite(initialElements(props.params).apoapsis)
        ? initialElements(props.params).apoapsis
        : 3 * props.params.r0,
      9e7,
    ) / M_PER_UNIT;
  return (
    <SceneCanvas className="h-full w-full" cameraPosition={[0, 1.4 * extent, 1.1 * extent]}>
      <Simulation {...props} />
    </SceneCanvas>
  );
}
