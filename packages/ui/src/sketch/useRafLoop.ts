"use client";

import { useEffect, useRef } from "react";

/**
 * Calls `cb(elapsedSeconds)` every animation frame while mounted. The latest
 * callback is always used, so callers can close over fresh props.
 * Respects reduced motion by calling once with t = 0.
 */
export function useRafLoop(cb: (t: number) => void) {
  const ref = useRef(cb);
  useEffect(() => {
    ref.current = cb;
  });
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      ref.current(0);
      return;
    }
    const start = performance.now();
    let id = requestAnimationFrame(function loop(now) {
      ref.current((now - start) / 1000);
      id = requestAnimationFrame(loop);
    });
    return () => cancelAnimationFrame(id);
  }, []);
}
