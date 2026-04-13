'use client';

import { useMemo, useRef, useState } from 'react';
import { Textarea } from '../ui/textarea';

type PairConfig = {
  open: string;
  close: string;
};

const PAIR_CONFIGS: PairConfig[] = [
  { open: '{', close: '}' },
  { open: '[', close: ']' },
  { open: '(', close: ')' },
  { open: '"', close: '"' },
  { open: "'", close: "'" },
];

const OPENING_KEYS = new Set(PAIR_CONFIGS.map((pair) => pair.open));
const CLOSING_KEYS = new Set(PAIR_CONFIGS.map((pair) => pair.close));

const getPairByOpen = (key: string) =>
  PAIR_CONFIGS.find((pair) => pair.open === key);

const isSymmetricPair = (pair: PairConfig) => pair.open === pair.close;

const escapeHtml = (text: string) =>
  text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

const wrapToken = (className: string, value: string) =>
  `<span class="${className}">${escapeHtml(value)}</span>`;

const isWordCharacter = (char?: string) => Boolean(char?.match(/[A-Za-z0-9_]/));

const matchNumberAt = (text: string, index: number) => {
  const sliced = text.slice(index);
  return sliced.match(/^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/);
};

const getStringEndIndex = (text: string, startIndex: number) => {
  let index = startIndex + 1;

  while (index < text.length) {
    const char = text[index];
    if (char === '\\') {
      index += 2;
      continue;
    }
    if (char === '"') return index + 1;
    index += 1;
  }

  return text.length;
};

const getJsonHighlightHtml = (text: string) => {
  let index = 0;
  let html = '';

  while (index < text.length) {
    const current = text[index];

    if (current === '"') {
      const endIndex = getStringEndIndex(text, index);
      const token = text.slice(index, endIndex);

      let lookahead = endIndex;
      while (lookahead < text.length && /\s/.test(text[lookahead])) {
        lookahead += 1;
      }

      const isPropertyKey = text[lookahead] === ':';
      html += wrapToken(
        isPropertyKey
          ? 'text-cyan-600 dark:text-cyan-400'
          : 'text-emerald-600 dark:text-emerald-400',
        token,
      );
      index = endIndex;
      continue;
    }

    const numberMatch = matchNumberAt(text, index);
    if (numberMatch) {
      html += wrapToken('text-amber-600 dark:text-amber-400', numberMatch[0]);
      index += numberMatch[0].length;
      continue;
    }

    if (
      (text.startsWith('true', index) && !isWordCharacter(text[index + 4])) ||
      (text.startsWith('false', index) && !isWordCharacter(text[index + 5])) ||
      (text.startsWith('null', index) && !isWordCharacter(text[index + 4]))
    ) {
      const literal = text.startsWith('false', index)
        ? 'false'
        : text.startsWith('true', index)
          ? 'true'
          : 'null';
      html += wrapToken('text-rose-600 dark:text-rose-400', literal);
      index += literal.length;
      continue;
    }

    if ('{}[]():,'.includes(current)) {
      html += wrapToken('text-muted-foreground', current);
      index += 1;
      continue;
    }

    html += escapeHtml(current);
    index += 1;
  }

  return html || '&nbsp;';
};

export const JsonEditor = () => {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);
  const lineNumbersRef = useRef<HTMLPreElement>(null);

  const TAB_SIZE = 4;
  const INDENT = ' '.repeat(TAB_SIZE);

  const validate = (text: string) => {
    try {
      JSON.parse(text);
      setError(null);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  const getCurrentLineIndent = (text: string, cursor: number) => {
    const lineStart = text.lastIndexOf('\n', cursor - 1) + 1;
    const line = text.slice(lineStart, cursor);
    const match = line.match(/^\s*/);
    return match ? match[0] : '';
  };

  const updateValue = (text: string) => {
    setValue(text);
    validate(text);
  };

  const setCursorPosition = (position: number) => {
    requestAnimationFrame(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      textarea.selectionStart = textarea.selectionEnd = position;
    });
  };

  const insertText = (start: number, end: number, text: string) => {
    const newValue = value.slice(0, start) + text + value.slice(end);
    updateValue(newValue);
  };

  const insertPair = (
    start: number,
    end: number,
    open: string,
    close: string,
  ) => {
    const selectedText = value.slice(start, end);
    const insertion =
      start === end ? `${open}${close}` : `${open}${selectedText}${close}`;
    insertText(start, end, insertion);

    if (start === end) {
      setCursorPosition(start + open.length);
      return;
    }

    setCursorPosition(start + insertion.length);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    updateValue(text);
  };

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    if (highlightRef.current) {
      highlightRef.current.scrollTop = target.scrollTop;
      highlightRef.current.scrollLeft = target.scrollLeft;
    }
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = target.scrollTop;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const hasSelection = start !== end;

    if (OPENING_KEYS.has(e.key)) {
      const pair = getPairByOpen(e.key);
      if (!pair) return;

      e.preventDefault();

      if (
        !hasSelection &&
        isSymmetricPair(pair) &&
        value[start] === pair.close
      ) {
        setCursorPosition(start + 1);
        return;
      }

      insertPair(start, end, pair.open, pair.close);
      return;
    }

    if (!hasSelection && CLOSING_KEYS.has(e.key) && value[start] === e.key) {
      e.preventDefault();
      setCursorPosition(start + 1);
      return;
    }

    if (e.key === 'Backspace' && !hasSelection && start > 0) {
      const before = value[start - 1];
      const after = value[start];

      const shouldDeletePair = PAIR_CONFIGS.some(
        (pair) => pair.open === before && pair.close === after,
      );

      if (shouldDeletePair) {
        e.preventDefault();
        insertText(start - 1, start + 1, '');
        setCursorPosition(start - 1);
        return;
      }
    }

    // ENTER inteligente
    if (e.key === 'Enter') {
      e.preventDefault();

      const before = value[start - 1];
      const after = value[start];

      const currentIndent = getCurrentLineIndent(value, start);

      // Caso: {}
      if (
        (before === '{' && after === '}') ||
        (before === '[' && after === ']') ||
        (before === '(' && after === ')')
      ) {
        const newValue =
          value.slice(0, start) +
          '\n' +
          currentIndent +
          INDENT +
          '\n' +
          currentIndent +
          value.slice(end);

        updateValue(newValue);

        const cursorPos = start + 1 + currentIndent.length + INDENT.length;
        setCursorPosition(cursorPos);

        return;
      }

      // Enter normal con indentación heredada
      const newValue =
        value.slice(0, start) + '\n' + currentIndent + value.slice(end);

      updateValue(newValue);

      const cursorPos = start + 1 + currentIndent.length;
      setCursorPosition(cursorPos);

      return;
    }

    // TAB
    if (e.key === 'Tab') {
      e.preventDefault();

      const newValue = value.slice(0, start) + INDENT + value.slice(end);

      updateValue(newValue);

      setCursorPosition(start + INDENT.length);
    }
  };

  const lineCount = useMemo(
    () => Math.max(1, value.split('\n').length),
    [value],
  );
  const lineNumbers = useMemo(
    () => Array.from({ length: lineCount }, (_, i) => i + 1).join('\n'),
    [lineCount],
  );
  const highlightedHtml = useMemo(() => getJsonHighlightHtml(value), [value]);

  return (
    <div className="space-y-2">
      <div className="relative flex h-[28rem] overflow-hidden rounded-lg border border-input bg-background font-mono text-sm">
        <pre
          ref={lineNumbersRef}
          aria-hidden
          className="w-12 shrink-0 overflow-hidden border-r border-border bg-muted/40 px-2 py-2 text-right leading-6 text-muted-foreground select-none"
        >
          {lineNumbers}
        </pre>

        <div className="relative flex-1">
          <pre
            ref={highlightRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-auto px-3 py-2 leading-6 whitespace-pre text-foreground"
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />

          <Textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onScroll={handleScroll}
            spellCheck={false}
            className="absolute inset-0 h-full resize-none overflow-auto rounded-none border-0 bg-transparent px-3 py-2 font-mono leading-6 text-transparent caret-foreground shadow-none focus-visible:ring-0 selection:bg-primary/20"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
