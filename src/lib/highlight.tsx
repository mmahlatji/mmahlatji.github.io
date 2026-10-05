import type { ReactNode } from 'react';

type Token = { cls: string; text: string };

const KEYWORDS = new Set(['const']);
const PUNCT = new Set(['{', '}', '[', ']', '(', ')', ':', ';', ',', '=', '=>']);

/**
 * Minimal TypeScript-ish tokenizer for the hero/about/timeline code blocks.
 * Handles comments, strings, keywords, punctuation, type names (PascalCase),
 * and property identifiers. Returns one array of tokens per source line.
 */
export function tokenize(src: string): Token[][] {
  return src.split('\n').map((line) => {
    const tokens: Token[] = [];
    let i = 0;
    let afterConst = false;
    while (i < line.length) {
      const ch = line[i];

      // whitespace
      if (ch === ' ') {
        let j = i;
        while (j < line.length && line[j] === ' ') j++;
        tokens.push({ cls: '', text: line.slice(i, j) });
        i = j;
        continue;
      }

      // comment to end of line
      if (ch === '/' && line[i + 1] === '/') {
        tokens.push({ cls: 'tok-com', text: line.slice(i) });
        break;
      }

      // string literal
      if (ch === '"') {
        const end = line.indexOf('"', i + 1);
        const last = end === -1 ? line.length : end + 1;
        tokens.push({ cls: 'tok-str', text: line.slice(i, last) });
        afterConst = false;
        i = last;
        continue;
      }

      // punctuation
      if (PUNCT.has(ch)) {
        tokens.push({ cls: 'tok-punct', text: ch });
        afterConst = false;
        i++;
        continue;
      }

      // identifier / keyword
      if (/[A-Za-z_$]/.test(ch)) {
        let j = i;
        while (j < line.length && /[A-Za-z0-9_$]/.test(line[j])) j++;
        const word = line.slice(i, j);
        let cls = 'tok-var';
        if (KEYWORDS.has(word)) {
          cls = 'tok-kw';
          afterConst = true;
        } else if (/^[A-Z]/.test(word)) {
          cls = 'tok-type';
        } else if (afterConst) {
          cls = 'tok-var';
          afterConst = false;
        } else {
          // property if the next non-space char is a colon
          let k = j;
          while (k < line.length && line[k] === ' ') k++;
          if (line[k] === ':') cls = 'tok-prop';
        }
        tokens.push({ cls, text: word });
        i = j;
        continue;
      }

      // any other char (e.g. '@', '&', em dash)
      tokens.push({ cls: '', text: ch });
      afterConst = false;
      i++;
    }
    return tokens;
  });
}

/** Render tokenized source as React lines, compatible with CodeBlock. */
export function highlight(src: string): ReactNode[] {
  return tokenize(src).map((tokens, i) => (
    <span key={i}>
      {tokens.map((t, j) =>
        t.cls ? (
          <span key={j} className={t.cls}>
            {t.text}
          </span>
        ) : (
          t.text
        )
      )}
    </span>
  ));
}
