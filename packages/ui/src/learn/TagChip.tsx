import type { ReactNode } from "react";

/** Small outlined tag pill; filled when selected. Render as a link or a button via `as`. */
export function tagChipClass(selected = false) {
  return `inline-flex items-center gap-1 rounded-full border-2 px-3 py-0.5 text-xs transition ${
    selected
      ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
      : "border-neutral-300 text-muted hover:border-[var(--ink)] hover:text-[var(--ink)] dark:border-white/20"
  }`;
}

export function TagChip({
  children,
  selected = false,
}: {
  children: ReactNode;
  selected?: boolean;
}) {
  return <span className={tagChipClass(selected)}>{children}</span>;
}
