"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useSyncExternalStore, type ReactNode } from "react";
import { isWebGLAvailable } from "../helpers/webgl";
import { Starfield } from "../effects/Starfield";

export interface SceneCanvasProps {
  children: ReactNode;
  /** Initial camera position in scene (render) units, not metres. */
  cameraPosition?: [number, number, number];
  className?: string;
  /** Shown when WebGL is unavailable. */
  fallback?: ReactNode;
  stars?: boolean;
}

const noopSubscribe = () => () => {};

/** Shared 3D container: camera, lighting, controls, and a WebGL fallback. */
export function SceneCanvas({
  children,
  cameraPosition = [0, 4, 10],
  className,
  fallback,
  stars = true,
}: SceneCanvasProps) {
  // null during SSR/hydration, then the client's real capability.
  const support = useSyncExternalStore<boolean | null>(noopSubscribe, isWebGLAvailable, () => null);

  if (support === false)
    return (
      <div className={className} role="img" aria-label="3D simulation unavailable">
        {fallback ?? (
          <p className="p-6 text-sm text-slate-400">
            WebGL is not available in this browser, so the 3D simulation cannot be shown. The
            readouts and controls still reflect the underlying model.
          </p>
        )}
      </div>
    );

  return (
    <div className={className}>
      {support && (
        <Canvas
          camera={{ position: cameraPosition, fov: 45, near: 0.01, far: 20_000 }}
          dpr={[1, 2]}
        >
          <color attach="background" args={["#03060d"]} />
          <ambientLight intensity={0.25} />
          <directionalLight position={[10, 6, 4]} intensity={1.8} />
          {stars && <Starfield />}
          {children}
          <OrbitControls makeDefault enableDamping />
        </Canvas>
      )}
    </div>
  );
}
