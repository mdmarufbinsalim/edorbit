"use client";

import { useEffect, useMemo, useState } from "react";
import { sampleTrajectory, type SceneProps } from "@orbital/core";
import { length, scale, type TwoBodyState } from "@orbital/physics";
import {
  Follow,
  SketchGlobe,
  Label,
  Marker,
  SceneCanvas,
  Trail,
  Trajectory,
  VectorArrow,
  physicsToScene,
  useSimulationLoop,
  useThemeColors,
} from "@orbital/rendering";
import {
  BODY_RADIUS,
  MU,
  createModel,
  initialElements,
  radiusOf,
  type OrbitalMotionParams,
} from "./model";

/** 1 scene unit = 1000 km. */
const M_PER_UNIT = 1e6;
const toScene = (v: readonly [number, number, number]) => physicsToScene(v, M_PER_UNIT);

type Props = SceneProps<TwoBodyState, OrbitalMotionParams>;

function Simulation({ engine, params, layers }: Props) {
  useSimulationLoop(engine);
  const { ink, paper, muted } = useThemeColors();
  const r0 = radiusOf(params);
  const el = useMemo(() => initialElements(params), [params]);

  const predicted = useMemo(() => {
    const model = createModel(params);
    const bound = Number.isFinite(el.period);
    const steps = 1440;
    const dt = bound ? el.period / steps : 60;
    const limit = 8 * r0;
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
  const r0Units = r0 / M_PER_UNIT;
  const vScale = (0.35 * r0Units) / Math.sqrt(MU / r0);
  const aScale = (0.35 * r0Units) / (MU / r0 ** 2);

  const position = () => toScene(engine.snapshot().state.position);
  const eHat = el.eccentricity > 1e-3 ? scale(el.eccentricityVector, 1 / el.eccentricity) : null;
  const peri = eHat ? toScene(scale(eHat, el.periapsis)) : null;
  const apo = eHat && Number.isFinite(el.apoapsis) ? toScene(scale(eHat, -el.apoapsis)) : null;

  return (
    <>
      <SketchGlobe radius={BODY_RADIUS / M_PER_UNIT} ink={ink} paper={paper} />
      {layers.labels && <Label offsetY={BODY_RADIUS / M_PER_UNIT + 0.6}>Earth</Label>}
      {layers.orbit && <Trajectory points={predicted} color={muted} dashed opacity={0.9} />}
      {layers.trail && <Trail get={position} color={ink} resetKey={resetCount} maxPoints={4000} />}
      {layers.apsides && peri && (
        <Marker position={peri} color={ink} size={0.15}>
          {layers.labels && <Label>closest</Label>}
        </Marker>
      )}
      {layers.apsides && apo && (
        <Marker position={apo} color={ink} size={0.15}>
          {layers.labels && <Label>farthest</Label>}
        </Marker>
      )}
      <Follow get={position}>
        <Marker color={ink} size={0.22}>
          {layers.labels && <Label>you</Label>}
        </Marker>
      </Follow>
      {layers.velocity && (
        <VectorArrow
          color={ink}
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
          color={muted}
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
          color={muted}
          get={() => ({ origin: [0, 0, 0], vector: toScene(engine.snapshot().state.position) })}
        />
      )}
    </>
  );
}

export default function OrbitalMotionScene(props: Props) {
  const apo = initialElements(props.params).apoapsis;
  const extent =
    Math.min(Number.isFinite(apo) ? apo : 3 * radiusOf(props.params), 9e7) / M_PER_UNIT;
  return (
    <SceneCanvas className="h-full w-full" cameraPosition={[0, 1.4 * extent, 1.1 * extent]}>
      <Simulation {...props} />
    </SceneCanvas>
  );
}
