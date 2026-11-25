import type { ReactNode } from "react";

export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-6 space-y-4">
      <h2 id={`${id}-heading`} className="text-2xl font-semibold text-slate-50">
        {title}
      </h2>
      {children}
    </section>
  );
}
