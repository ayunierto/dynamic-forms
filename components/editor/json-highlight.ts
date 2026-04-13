const escapeHtml = (text: string) =>
  text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

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

export const getJsonHighlightHtml = (text: string) => {
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
