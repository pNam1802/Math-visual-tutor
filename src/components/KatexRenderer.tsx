import React, { useMemo } from 'react';
import katex from 'katex';

interface KatexRendererProps {
  latex: string;
  block?: boolean;
  className?: string;
}

export const KatexRenderer: React.FC<KatexRendererProps> = ({
  latex,
  block = false,
  className = ''
}) => {
  const html = useMemo(() => {
    if (!latex) return '';
    try {
      // Clean up any double backslashes or raw dollar signs if present
      let cleanLatex = latex.trim();
      if (cleanLatex.startsWith('$$') && cleanLatex.endsWith('$$')) {
        cleanLatex = cleanLatex.slice(2, -2).trim();
      } else if (cleanLatex.startsWith('$') && cleanLatex.endsWith('$')) {
        cleanLatex = cleanLatex.slice(1, -1).trim();
      }

      return katex.renderToString(cleanLatex, {
        displayMode: block,
        throwOnError: false,
        output: 'htmlAndMathml'
      });
    } catch (err) {
      console.warn('KaTeX render error for formula:', latex, err);
      return `<span class="font-mono text-xs text-amber-500">${latex}</span>`;
    }
  }, [latex, block]);

  return (
    <span
      className={`inline-block font-mono select-all ${block ? 'w-full text-center my-1' : ''} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
