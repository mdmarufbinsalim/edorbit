"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { Group } from "three";
import { equirectangular, type LonLat } from "@edorbit/core";
import { EUROPE_BOUNDS, europeCoastlines } from "@edorbit/history";
import { GroundLines, InkCylinder, Label, SceneCanvas, useThemeColors } from "@edorbit/rendering";
import type { PressTown } from "../data";

/** Map width in scene units. */
const W = 20;
const projection = equirectangular(EUROPE_BOUNDS, W);
const toScene = (p: LonLat): [number, number] => {
  const [x, y] = projection.project(p);
  return [x - W / 2, y - projection.height / 2];
};
const coast = europeCoastlines.map((l) => l.map(toScene));

export interface MapLayers {
  universities: boolean;
  rivers: boolean;
}

/** Pillar height grows with the years a town has been printing. Visual only. */
const heightFor = (town: PressTown, year: number) => 0.15 + Math.max(0, year - town.year) * 0.035;

function Pillar({
  town,
  year,
  layers,
  selected,
  onOpen,
}: {
  town: PressTown;
  year: number;
  layers: MapLayers;
  selected: boolean;
  onOpen: (id: string) => void;
}) {
  const { ink, paper } = useThemeColors();
  const group = useRef<Group>(null);
  const [hover, setHover] = useState(false);
  const [x, z] = toScene(town.lonLat);
  const target = heightFor(town, year);
  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    g.scale.y += (target - g.scale.y) * Math.min(1, dt * 6);
    g.position.y = g.scale.y / 2;
  });
  return (
    <group position={[x, 0, z]}>
      <group ref={group} scale={[1, 0.001, 1]}>
        <InkCylinder
          ink={ink}
          paper={paper}
          radius={0.12}
          height={1}
          segments={10}
          solid={layers.rivers && !!town.river}
          onClick={(e) => {
            e.stopPropagation();
            onOpen(town.id);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHover(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            setHover(false);
            document.body.style.cursor = "";
          }}
        />
      </group>
      {layers.universities && town.university && (
        <InkCylinder
          ink={ink}
          paper={paper}
          radius={0.3}
          height={0.03}
          segments={24}
          position={[0, 0.015, 0]}
        />
      )}
      {(selected || hover) && (
        <Label position={[0, target, 0]} offsetY={0.35}>
          {town.name}
        </Label>
      )}
    </group>
  );
}

const CAMERA: [number, number, number] = [0, 13, 11];
const CAMERA_LENGTH = Math.hypot(...CAMERA);

/** Pull the camera back on narrow screens so all of Europe stays in view. */
function FitToWidth() {
  const camera = useThree((s) => s.camera);
  const aspect = useThree((s) => s.size.width / Math.max(1, s.size.height));
  useEffect(() => {
    camera.position.setLength(CAMERA_LENGTH * Math.max(1, 1.3 / aspect));
    camera.updateProjectionMatrix();
  }, [camera, aspect]);
  return null;
}

/** 3D sandbox: press towns rise as pillars on a sketch map of Europe. */
export default function MapScene3D({
  towns,
  year,
  layers,
  selected,
  onOpen,
}: {
  towns: readonly PressTown[];
  year: number;
  layers: MapLayers;
  selected: string | undefined;
  onOpen: (id: string) => void;
}) {
  return (
    <SceneCanvas className="h-full w-full" cameraPosition={CAMERA}>
      <FitToWidth />
      <Ground />
      {towns.map((t) => (
        <Pillar
          key={t.id}
          town={t}
          year={year}
          layers={layers}
          selected={selected === t.id}
          onOpen={onOpen}
        />
      ))}
    </SceneCanvas>
  );
}

function Ground() {
  const { muted, paper } = useThemeColors();
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[W, projection.height]} />
        <meshBasicMaterial color={paper} />
      </mesh>
      <GroundLines lines={coast} color={muted} />
    </>
  );
}
