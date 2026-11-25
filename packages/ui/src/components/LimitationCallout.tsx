import { RichText } from "./RichText";

/** Prominent notice distinguishing an idealised model from reality. */
export function LimitationCallout({
  title = "Idealised model",
  items,
}: {
  title?: string;
  items: readonly string[];
}) {
  return (
    <aside
      role="note"
      aria-label={title}
      className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-4 text-sm"
    >
      <p className="font-semibold text-amber-300">{title}</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
        {items.map((item) => (
          <li key={item}>
            <RichText text={item} />
          </li>
        ))}
      </ul>
    </aside>
  );
}
