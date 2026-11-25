import katex from "katex";

export interface EquationProps {
  latex: string;
  /** Block (display) math by default; set false for inline. */
  display?: boolean;
  /** Accessible description of the equation for screen readers. */
  label?: string;
}

/** Renders LaTeX with KaTeX. Content comes from reviewed, bundled concept modules only. */
export function Equation({ latex, display = true, label }: EquationProps) {
  const html = katex.renderToString(latex, {
    displayMode: display,
    throwOnError: false,
    output: "htmlAndMathml",
  });
  const Tag = display ? "div" : "span";
  return <Tag role="math" aria-label={label ?? latex} dangerouslySetInnerHTML={{ __html: html }} />;
}
