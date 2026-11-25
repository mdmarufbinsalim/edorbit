"use client";

import { forwardRef, useMemo, type ReactNode } from "react";
import {
  BoxGeometry,
  CylinderGeometry,
  EdgesGeometry,
  type BufferGeometry,
  type Group,
} from "three";
import type { ThreeEvent } from "@react-three/fiber";

type Vec3 = [number, number, number];

interface InkSolidProps {
  position?: Vec3;
  rotation?: Vec3;
  ink: string;
  paper: string;
  /** Fill with ink instead of paper, e.g. for metal type or a moving part. */
  solid?: boolean;
  /** Edge line opacity. */
  lineOpacity?: number;
  onClick?: (e: ThreeEvent<MouseEvent>) => void;
  onPointerOver?: (e: ThreeEvent<PointerEvent>) => void;
  onPointerOut?: (e: ThreeEvent<PointerEvent>) => void;
  children?: ReactNode;
}

/** A solid drawn like the 2D sketches: paper faces with ink outlines. */
const InkSolid = forwardRef<
  Group,
  InkSolidProps & { geometry: BufferGeometry; threshold?: number }
>(function InkSolid(
  {
    geometry,
    threshold = 20,
    position,
    rotation,
    ink,
    paper,
    solid = false,
    lineOpacity = 0.9,
    onClick,
    onPointerOver,
    onPointerOut,
    children,
  },
  ref,
) {
  const edges = useMemo(() => new EdgesGeometry(geometry, threshold), [geometry, threshold]);
  return (
    <group ref={ref} {...(position ? { position } : {})} {...(rotation ? { rotation } : {})}>
      <mesh
        geometry={geometry}
        {...(onClick ? { onClick } : {})}
        {...(onPointerOver ? { onPointerOver } : {})}
        {...(onPointerOut ? { onPointerOut } : {})}
      >
        <meshBasicMaterial
          color={solid ? ink : paper}
          polygonOffset
          polygonOffsetFactor={1}
          polygonOffsetUnits={1}
        />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={solid ? paper : ink} transparent opacity={lineOpacity} />
      </lineSegments>
      {children}
    </group>
  );
});

/** Box with ink edges. `size` is width, height, depth. */
export const InkBox = forwardRef<Group, InkSolidProps & { size: Vec3 }>(function InkBox(
  { size, ...rest },
  ref,
) {
  const [w, h, d] = size;
  const geometry = useMemo(() => new BoxGeometry(w, h, d), [w, h, d]);
  return <InkSolid ref={ref} geometry={geometry} {...rest} />;
});

/** Upright cylinder with ink edges. */
export const InkCylinder = forwardRef<
  Group,
  InkSolidProps & { radius: number; height: number; radiusTop?: number; segments?: number }
>(function InkCylinder({ radius, height, radiusTop, segments = 16, ...rest }, ref) {
  const geometry = useMemo(
    () => new CylinderGeometry(radiusTop ?? radius, radius, height, segments),
    [radius, radiusTop, height, segments],
  );
  return <InkSolid ref={ref} geometry={geometry} threshold={30} {...rest} />;
});
