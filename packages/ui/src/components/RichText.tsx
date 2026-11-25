import { Equation } from "../equations/Equation";

/** Renders plain text with `$inline math$` segments typeset by KaTeX. */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/(\$[^$]+\$)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("$") && part.endsWith("$") && part.length > 2 ? (
          <Equation key={i} latex={part.slice(1, -1)} display={false} />
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}
