"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { ReactNode } from "react";

export interface SceneCanvasProps {
  children: ReactNode;
  /** Initial camera position in scene (render) units, not metres. */
  cameraPosition?: [number, number, number];
  className?: string;
}

/** Shared 3D container: camera, lighting, and orbit controls for every concept scene. */
export function SceneCanvas({
  children,
  cameraPosition = [0, 4, 10],
  className,
}: SceneCanvasProps) {
  return (
    <div className={className}>
      <Canvas camera={{ position: cameraPosition, fov: 45, near: 0.01, far: 10_000 }} dpr={[1, 2]}>
        <color attach="background" args={["#03060d"]} />
        <ambientLight intensity={0.15} />
        <directionalLight position={[10, 6, 4]} intensity={1.6} />
        {children}
        <OrbitControls makeDefault enableDamping />
      </Canvas>
    </div>
  );
}
