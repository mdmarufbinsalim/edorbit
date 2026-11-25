"use client";

import { useState } from "react";
import { Reorder } from "framer-motion";
import { RichText } from "../components/RichText";
import { SketchCheck } from "../sketch/SketchCheck";

export interface OrderingItem {
  id: string;
  label: string;
  /** Revealed after checking, e.g. the date. */
  answer: string;
}

/**
 * "Put these in order": drag cards, or use the arrow buttons, then check.
 * `isCorrect` decides, so the rule (e.g. ties allowed) lives with the data.
 */
export function OrderingChallenge({
  items,
  isCorrect,
  onCheck,
  prompt = "Earliest at the top",
}: {
  /** In the starting order shown to the learner. */
  items: readonly OrderingItem[];
  isCorrect: (ids: readonly string[]) => boolean;
  onCheck?: (correct: boolean, ids: readonly string[]) => void;
  prompt?: string;
}) {
  const [order, setOrder] = useState(() => items.map((i) => i.id));
  const [checked, setChecked] = useState<boolean | null>(null);
  const byId = new Map(items.map((i) => [i.id, i]));

  const move = (from: number, to: number) => {
    if (to < 0 || to >= order.length) return;
    const next = [...order];
    const [id] = next.splice(from, 1);
    next.splice(to, 0, id!);
    setOrder(next);
    setChecked(null);
  };

  const check = () => {
    const ok = isCorrect(order);
    setChecked(ok);
    onCheck?.(ok, order);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">{prompt}. Drag the cards or use the arrows.</p>
      <Reorder.Group
        axis="y"
        values={order}
        onReorder={(next: string[]) => {
          setOrder(next);
          setChecked(null);
        }}
        className="space-y-2"
      >
        {order.map((id, i) => {
          const item = byId.get(id)!;
          return (
            <Reorder.Item
              key={id}
              value={id}
              className="flex cursor-grab items-center gap-2 rounded-xl border-2 border-[var(--ink)] bg-[var(--paper)] px-3 py-3 active:cursor-grabbing sm:gap-3 sm:px-4"
            >
              <span className="w-5 shrink-0 text-lg text-faint tabular-nums">{i + 1}</span>
              <span className="min-w-0 flex-1">
                <RichText text={item.label} />
              </span>
              {checked !== null && (
                <span className="text-sm whitespace-nowrap text-muted tabular-nums">
                  {item.answer}
                </span>
              )}
              <span className="flex shrink-0 gap-1">
                <button
                  type="button"
                  aria-label={`Move "${item.label}" up`}
                  disabled={i === 0}
                  onClick={() => move(i, i - 1)}
                  className="rounded-full border-2 border-[var(--ink)] px-2 leading-6 disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  aria-label={`Move "${item.label}" down`}
                  disabled={i === order.length - 1}
                  onClick={() => move(i, i + 1)}
                  className="rounded-full border-2 border-[var(--ink)] px-2 leading-6 disabled:opacity-30"
                >
                  ↓
                </button>
              </span>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={check}
          className="rounded-full border-[2.5px] border-[var(--ink)] bg-[var(--ink)] px-6 py-2 font-medium text-[var(--paper)] transition hover:-translate-y-0.5"
        >
          Check my order
        </button>
        <p aria-live="polite" className="flex items-center gap-2">
          {checked !== null && <SketchCheck done={checked} />}
          {checked === true && "All in order."}
          {checked === false && "Not yet. The dates are showing now. Try again."}
        </p>
      </div>
    </div>
  );
}
