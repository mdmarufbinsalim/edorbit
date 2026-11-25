import { Equation } from "../equations/Equation";

/** Plain text with `$inline math$` (KaTeX) and `**bold**` segments. */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/(\$[^$]+\$|\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.length > 2 && part.startsWith("$") && part.endsWith("$"))
          return <Equation key={i} latex={part.slice(1, -1)} display={false} />;
        if (part.length > 4 && part.startsWith("**") && part.endsWith("**"))
          return (
            <strong key={i} className="font-medium text-[var(--ink)]">
              {part.slice(2, -2)}
            </strong>
          );
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
