"use client";

import { useEffect, useRef, useState } from "react";

/** Tracks an element's layout size (offset box, unaffected by transforms). */
export function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // ResizeObserver fires once on observe, so no synchronous measure is needed.
    const observer = new ResizeObserver(() =>
      setSize((prev) =>
        prev.width === el.offsetWidth && prev.height === el.offsetHeight
          ? prev
          : { width: el.offsetWidth, height: el.offsetHeight },
      ),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, size };
}
