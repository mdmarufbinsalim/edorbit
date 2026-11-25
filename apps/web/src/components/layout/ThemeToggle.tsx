"use client";

import { useRef, useSyncExternalStore } from "react";
import { flushSync } from "react-dom";

type ViewTransitionDocument = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void>; finished: Promise<void> };
};

const subscribe = (cb: () => void) => {
  const obs = new MutationObserver(cb);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => obs.disconnect();
};
const isDarkNow = () => document.documentElement.classList.contains("dark");

/** Light/dark toggle; the new theme sweeps out of the button as a growing circle. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const isDark = useSyncExternalStore(subscribe, isDarkNow, () => false);
  const ref = useRef<HTMLButtonElement>(null);

  const apply = (next: boolean) => {
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const toggle = () => {
    const next = !isDark;
    const doc = document as ViewTransitionDocument;
    const btn = ref.current;
    if (
      !btn ||
      !doc.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return apply(next);
    const r = btn.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const small = `circle(0px at ${x}px ${y}px)`;
    const big = `circle(${radius}px at ${x}px ${y}px)`;
    const root = document.documentElement;
    root.dataset.themeSweep = next ? "expand" : "collapse";
    const t = doc.startViewTransition(() => flushSync(() => apply(next)));
    t.ready.then(() =>
      root.animate(
        { clipPath: next ? [small, big] : [big, small] },
        {
          duration: 800,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "forwards",
          pseudoElement: next ? "::view-transition-new(root)" : "::view-transition-old(root)",
        },
      ),
    );
    t.finished.finally(() => delete root.dataset.themeSweep);
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`flex h-8 w-8 items-center justify-center ${className}`}
    >
      <svg viewBox="0 0 24 24" width={20} height={20} fill="none" aria-hidden="true">
        {isDark ? (
          <path
            d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <>
            <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth={1.6} />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
              <line
                key={a}
                x1="12"
                y1="2.5"
                x2="12"
                y2="4.5"
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
                transform={`rotate(${a} 12 12)`}
              />
            ))}
          </>
        )}
      </svg>
    </button>
  );
}
