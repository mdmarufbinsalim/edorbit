"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { createStore, useStore, type StoreApi } from "zustand";
import type { ActivityProgress, ProgressValue } from "@edorbit/core";

interface ProgressState {
  values: ActivityProgress;
  set: (key: string, value: ProgressValue) => void;
  /** Add `id` to the string list at `key`, once. */
  add: (key: string, id: string) => void;
}

const makeStore = () =>
  createStore<ProgressState>((set) => ({
    values: {},
    set: (key, value) =>
      set((s) => (s.values[key] === value ? s : { values: { ...s.values, [key]: value } })),
    add: (key, id) =>
      set((s) => {
        const old = s.values[key];
        const list = Array.isArray(old) ? (old as readonly string[]) : [];
        return list.includes(id) ? s : { values: { ...s.values, [key]: [...list, id] } };
      }),
  }));

const ProgressContext = createContext<StoreApi<ProgressState> | null>(null);
/** Used when a widget renders outside a provider (e.g. in tests): reports go nowhere. */
const detached = makeStore();

/**
 * Holds what the learner has done in a concept's widgets, so missions can
 * check it. One provider per concept page.
 */
export function ProgressProvider({ children }: { children: ReactNode }) {
  const [store] = useState(makeStore);
  return <ProgressContext.Provider value={store}>{children}</ProgressContext.Provider>;
}

/** Everything reported so far. Re-renders when it changes. */
export function useProgress(): ActivityProgress {
  return useStore(useContext(ProgressContext) ?? detached, (s) => s.values);
}

/** Stable functions widgets call to report what the learner did. */
export function useReportProgress(): Pick<ProgressState, "set" | "add"> {
  const store = useContext(ProgressContext) ?? detached;
  return useMemo(() => {
    const { set, add } = store.getState();
    return { set, add };
  }, [store]);
}

/** Read a string list from progress, empty when missing. */
export const progressList = (progress: ActivityProgress, key: string): readonly string[] => {
  const v = progress[key];
  return Array.isArray(v) ? (v as readonly string[]) : [];
};
