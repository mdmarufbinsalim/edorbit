"use client";

import { useSyncExternalStore } from "react";

export interface ThemeColors {
  paper: string;
  ink: string;
  muted: string;
  faint: string;
  dark: boolean;
}

const LIGHT: ThemeColors = {
  paper: "#ffffff",
  ink: "#0a0a0a",
  muted: "#525252",
  faint: "#a3a3a3",
  dark: false,
};
let cached: ThemeColors = LIGHT;
let cachedKey = "";

function read(): ThemeColors {
  const root = document.documentElement;
  const key = root.className;
  if (key === cachedKey) return cached;
  const css = getComputedStyle(root);
  const v = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback;
  cachedKey = key;
  cached = {
    paper: v("--paper", LIGHT.paper),
    ink: v("--ink", LIGHT.ink),
    muted: v("--muted", LIGHT.muted),
    faint: v("--faint", LIGHT.faint),
    dark: root.classList.contains("dark"),
  };
  return cached;
}

function subscribe(cb: () => void) {
  const obs = new MutationObserver(cb);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => obs.disconnect();
}

/** Current paper/ink colours from the CSS theme, updating when the theme toggles. */
export const useThemeColors = (): ThemeColors => useSyncExternalStore(subscribe, read, () => LIGHT);
