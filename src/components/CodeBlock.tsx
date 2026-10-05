import type { ReactNode } from 'react';
import './CodeBlock.css';

interface CodeBlockProps {
  lines: ReactNode[];
  lang?: string;
  filename?: string;
  className?: string;
}

export default function CodeBlock({ lines, lang, filename, className }: CodeBlockProps) {
  return (
    <figure className={`codeblock${className ? ` ${className}` : ''}`}>
      {(filename || lang) && (
        <figcaption className="codeblock__head">
          <span className="codeblock__filename mono">{filename}</span>
          <span className="codeblock__lang mono">{lang}</span>
        </figcaption>
      )}
      <pre className="codeblock__pre">
        {lines.map((line, i) => (
          <div className="codeblock__line" key={i}>
            <span className="codeblock__ln" aria-hidden="true">
              {i + 1}
            </span>
            <code className="codeblock__code">{line}</code>
          </div>
        ))}
      </pre>
    </figure>
  );
}
