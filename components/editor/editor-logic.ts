export type PairConfig = {
  open: string;
  close: string;
};

export type EditorKeyAction = {
  value: string;
  cursor: number;
};

const TAB_SIZE = 4;
export const INDENT = ' '.repeat(TAB_SIZE);

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

const hasSelection = (start: number, end: number) => start !== end;

const insertText = (value: string, start: number, end: number, text: string) =>
  value.slice(0, start) + text + value.slice(end);

export const getCurrentLineIndent = (text: string, cursor: number) => {
  const lineStart = text.lastIndexOf('\n', cursor - 1) + 1;
  const line = text.slice(lineStart, cursor);
  const match = line.match(/^\s*/);
  return match ? match[0] : '';
};

export const getEditorKeyAction = (params: {
  key: string;
  value: string;
  start: number;
  end: number;
}): EditorKeyAction | null => {
  const { key, value, start, end } = params;
  const hasRangeSelection = hasSelection(start, end);

  if (OPENING_KEYS.has(key)) {
    const pair = getPairByOpen(key);
    if (!pair) return null;

    if (
      !hasRangeSelection &&
      isSymmetricPair(pair) &&
      value[start] === pair.close
    ) {
      return { value, cursor: start + 1 };
    }

    const selectedText = value.slice(start, end);
    const insertion = hasRangeSelection
      ? `${pair.open}${selectedText}${pair.close}`
      : `${pair.open}${pair.close}`;

    return {
      value: insertText(value, start, end, insertion),
      cursor: hasRangeSelection ? start + insertion.length : start + pair.open.length,
    };
  }

  if (!hasRangeSelection && CLOSING_KEYS.has(key) && value[start] === key) {
    return { value, cursor: start + 1 };
  }

  if (key === 'Backspace' && !hasRangeSelection && start > 0) {
    const before = value[start - 1];
    const after = value[start];

    const shouldDeletePair = PAIR_CONFIGS.some(
      (pair) => pair.open === before && pair.close === after,
    );

    if (shouldDeletePair) {
      return {
        value: insertText(value, start - 1, start + 1, ''),
        cursor: start - 1,
      };
    }
  }

  if (key === 'Enter') {
    const before = value[start - 1];
    const after = value[start];
    const currentIndent = getCurrentLineIndent(value, start);

    if (
      (before === '{' && after === '}') ||
      (before === '[' && after === ']') ||
      (before === '(' && after === ')')
    ) {
      const inserted = `\n${currentIndent}${INDENT}\n${currentIndent}`;
      return {
        value: insertText(value, start, end, inserted),
        cursor: start + 1 + currentIndent.length + INDENT.length,
      };
    }

    const inserted = `\n${currentIndent}`;
    return {
      value: insertText(value, start, end, inserted),
      cursor: start + inserted.length,
    };
  }

  if (key === 'Tab') {
    return {
      value: insertText(value, start, end, INDENT),
      cursor: start + INDENT.length,
    };
  }

  return null;
};

export const validateJson = (text: string) => {
  try {
    JSON.parse(text);
    return null;
  } catch (error) {
    if (error instanceof Error) return error.message;
    return 'Invalid JSON';
  }
};
