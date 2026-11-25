"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { Group } from "three";
import { InkBox, InkCylinder, Label, SceneCanvas, useThemeColors } from "@edorbit/rendering";

/** One full pull of the press, in seconds of animation (slowed down so you can follow it). */
export const PULL_SECONDS = 2.4;

const smooth = (a: number, b: number, t: number) => {
  const x = Math.min(1, Math.max(0, (t - a) / (b - a)));
  return x * x * (3 - 2 * x);
};

/**
 * Pose of the press at `phase` (0–1) through one pull:
 * roll the bed in, pull the bar so the platen presses down, let go, roll out,
 * lift the printed sheet off.
 */
export function pressPose(phase: number) {
  const roll = smooth(0, 0.18, phase) - smooth(0.6, 0.78, phase);
  const pull = smooth(0.2, 0.42, phase) - smooth(0.46, 0.6, phase);
  return {
    /** Bed position: 0 = out front, 1 = under the platen. */
    bedIn: roll,
    /** Bar angle and platen drop, 0–1. */
    pull,
    /** Printed sheet flying to the pile, 0–1. */
    sheet: smooth(0.8, 1, phase),
  };
}

const BED_OUT_Z = 1.25;

function Press({ running, sheets }: { running: boolean; sheets: number }) {
  const { ink, paper, muted } = useThemeColors();
  const t = useRef(0);
  const bed = useRef<Group>(null);
  const bar = useRef<Group>(null);
  const platen = useRef<Group>(null);
  const flying = useRef<Group>(null);

  useFrame((_, dt) => {
    if (running) t.current += Math.min(dt, 0.1);
    const pose = pressPose((t.current / PULL_SECONDS) % 1);
    if (bed.current) bed.current.position.z = (1 - pose.bedIn) * BED_OUT_Z;
    if (bar.current) bar.current.rotation.y = -1.1 * pose.pull;
    if (platen.current) platen.current.position.y = 2.02 - 0.1 * pose.pull;
    if (flying.current) {
      const s = pose.sheet;
      flying.current.visible = running && s > 0 && s < 1;
      flying.current.position.set(1.9 * s, 1.36 + Math.sin(Math.PI * s) * 0.9, BED_OUT_Z * (1 - s));
      flying.current.rotation.z = -0.5 * Math.sin(Math.PI * s);
    }
  });

  const pile = Math.min(0.6, 0.02 + sheets * 0.00025);
  const p = { ink, paper };

  return (
    <group position={[-0.5, -1.6, 0]}>
      {/* frame */}
      <InkBox {...p} size={[2.2, 0.16, 1.4]} position={[0, 0.08, 0]} />
      <InkBox {...p} size={[0.24, 3.3, 0.32]} position={[-0.82, 1.8, 0]} />
      <InkBox {...p} size={[0.24, 3.3, 0.32]} position={[0.82, 1.8, 0]} />
      <InkBox {...p} size={[2.0, 0.38, 0.46]} position={[0, 3.3, 0]} />
      <InkBox {...p} size={[2.0, 0.24, 0.46]} position={[0, 1.0, 0]} />
      {/* rails the bed slides on, with a front leg */}
      <InkBox {...p} size={[0.12, 0.08, 2.4]} position={[-0.42, 1.16, 0.75]} />
      <InkBox {...p} size={[0.12, 0.08, 2.4]} position={[0.42, 1.16, 0.75]} />
      <InkBox {...p} size={[0.12, 1.1, 0.12]} position={[0, 0.6, 1.85]} />
      {/* screw and bar */}
      <group ref={bar} position={[0, 2.45, 0]}>
        <InkCylinder {...p} radius={0.09} height={0.95} position={[0, 0.35, 0]} />
        <InkCylinder
          {...p}
          radius={0.04}
          height={1.15}
          rotation={[0, 0, Math.PI / 2]}
          position={[0.6, 0, 0]}
        />
        <InkCylinder {...p} solid radius={0.07} height={0.18} position={[1.18, 0, 0]} />
      </group>
      {/* platen: the flat block that presses down */}
      <group ref={platen} position={[0, 2.02, 0]}>
        <InkBox {...p} size={[0.95, 0.12, 0.66]} />
      </group>
      {/* bed with the inked type and a sheet of paper */}
      <group ref={bed} position={[0, 0, BED_OUT_Z]}>
        <InkBox {...p} size={[1.05, 0.1, 0.85]} position={[0, 1.25, 0]} />
        <InkBox {...p} solid size={[0.72, 0.06, 0.52]} position={[0, 1.33, 0]} />
        <InkBox {...p} size={[0.74, 0.015, 0.54]} position={[0, 1.37, 0]} lineOpacity={0.5} />
      </group>
      {/* printed pile on a side table */}
      <InkBox {...p} size={[0.9, 0.08, 0.7]} position={[1.9, 1.2, 0]} />
      <InkBox {...p} size={[0.04, 1.16, 0.04]} position={[1.9, 0.6, 0]} />
      <InkBox
        {...p}
        size={[0.76, pile, 0.56]}
        position={[1.9, 1.24 + pile / 2, 0]}
        lineOpacity={0.6}
      />
      <group ref={flying} visible={false}>
        <InkBox {...p} size={[0.74, 0.015, 0.54]} lineOpacity={0.7} />
      </group>
      <Label position={[1.9, 1.3 + pile, 0]} offsetY={0.25}>
        printed pages
      </Label>
      <Label position={[1.2, 2.45, 0]} offsetY={0.25}>
        bar
      </Label>
      <Label position={[0, 0.2, 1.9]} offsetY={-0.4}>
        <span style={{ color: muted }}>bed with the type</span>
      </Label>
    </group>
  );
}

const CAMERA: [number, number, number] = [4.2, 2.4, 5.4];
const CAMERA_LENGTH = Math.hypot(...CAMERA);

/** Pull the camera back on narrow screens so the whole press stays in view. */
function FitToWidth() {
  const camera = useThree((s) => s.camera);
  const aspect = useThree((s) => s.size.width / Math.max(1, s.size.height));
  useEffect(() => {
    camera.position.setLength(CAMERA_LENGTH * Math.max(1, 1.5 / aspect));
    camera.updateProjectionMatrix();
  }, [camera, aspect]);
  return null;
}

/** A 3D wooden hand press, drawn like a pen sketch, that keeps pulling while `running`. */
export function HandPress3D({ running, sheets }: { running: boolean; sheets: number }) {
  return (
    <SceneCanvas
      className="h-full w-full"
      cameraPosition={CAMERA}
      fallback={
        <p className="p-6 text-sm text-muted">
          3D is not available in this browser. The counters still show the press's output.
        </p>
      }
    >
      <FitToWidth />
      <Press running={running} sheets={sheets} />
    </SceneCanvas>
  );
}
