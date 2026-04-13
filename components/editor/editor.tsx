'use client';

import { useState, useRef } from 'react';
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

export const JsonEditor = () => {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  return (
    <>
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </>
  );
};
