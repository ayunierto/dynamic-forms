'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

import { Textarea } from '../ui/textarea';
import { getEditorKeyAction, validateJson } from './editor-logic';
import { getJsonHighlightHtml } from './json-highlight';

const assignRef = <T,>(ref: React.ForwardedRef<T>, value: T | null) => {
  if (typeof ref === 'function') {
    ref(value);
    return;
  }
  if (ref) {
    ref.current = value;
  }
};

export type JsonCodeEditorProps = Omit<
  React.ComponentPropsWithoutRef<'textarea'>,
  'value' | 'defaultValue' | 'onChange'
> & {
  value: string;
  onValueChange?: (value: string) => void;
  onChange?: (value: string) => void;
  onValidationChange?: (error: string | null) => void;
  showLineNumbers?: boolean;
  wrapperClassName?: string;
  editorClassName?: string;
};

export const JsonCodeEditor = React.forwardRef<
  HTMLTextAreaElement,
  JsonCodeEditorProps
>(function JsonCodeEditor(
  {
    value,
    onValueChange,
    onChange,
    onValidationChange,
    showLineNumbers = true,
    wrapperClassName,
    editorClassName,
    onScroll,
    onKeyDown,
    className,
    ...textareaProps
  },
  ref,
) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const highlightRef = React.useRef<HTMLPreElement>(null);
  const lineNumbersRef = React.useRef<HTMLPreElement>(null);

  const emitValueChange = React.useCallback(
    (nextValue: string) => {
      onValueChange?.(nextValue);
      onChange?.(nextValue);
    },
    [onChange, onValueChange],
  );

  React.useEffect(() => {
    onValidationChange?.(validateJson(value));
  }, [onValidationChange, value]);

  const setCursorPosition = (position: number) => {
    requestAnimationFrame(() => {
      const textarea = textareaRef.current;

      if (!textarea) return;
      textarea.selectionStart = textarea.selectionEnd = position;
    });
  };

  const lineCount = React.useMemo(
    () => Math.max(1, value.split('\n').length),
    [value],
  );
  const lineNumbers = React.useMemo(
    () => Array.from({ length: lineCount }, (_, index) => index + 1).join('\n'),
    [lineCount],
  );
  const highlightedHtml = React.useMemo(() => getJsonHighlightHtml(value), [value]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) =>
    emitValueChange(event.target.value);

  const handleScroll = (event: React.UIEvent<HTMLTextAreaElement>) => {
    const target = event.currentTarget;

    if (highlightRef.current) {
      highlightRef.current.scrollTop = target.scrollTop;
      highlightRef.current.scrollLeft = target.scrollLeft;
    }

    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = target.scrollTop;
    }

    onScroll?.(event);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = event.currentTarget;
    const action = getEditorKeyAction({
      key: event.key,
      value,
      start: textarea.selectionStart,
      end: textarea.selectionEnd,
    });

    if (action) {
      event.preventDefault();
      emitValueChange(action.value);
      setCursorPosition(action.cursor);
      return;
    }

    onKeyDown?.(event);
  };

  return (
    <div className={cn('space-y-2', wrapperClassName)}>
      <div
        className={cn(
          'relative flex h-[28rem] overflow-hidden rounded-lg border border-input bg-background font-mono text-sm',
          editorClassName,
        )}
      >
        {showLineNumbers && (
          <pre
            ref={lineNumbersRef}
            aria-hidden
            className="w-12 shrink-0 overflow-hidden border-r border-border bg-muted/40 px-2 py-2 text-right leading-6 text-muted-foreground select-none"
          >
            {lineNumbers}
          </pre>
        )}

        <div className="relative flex-1">
          <pre
            ref={highlightRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-auto px-3 py-2 leading-6 whitespace-pre text-foreground"
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />

          <Textarea
            {...textareaProps}
            ref={(node) => {
              textareaRef.current = node;
              assignRef(ref, node);
            }}
            value={value}
            onChange={handleChange}
            onScroll={handleScroll}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            className={cn(
              'absolute inset-0 h-full resize-none overflow-auto rounded-none border-0 bg-transparent px-3 py-2 font-mono leading-6 text-transparent caret-foreground shadow-none focus-visible:ring-0 selection:bg-primary/20',
              className,
            )}
          />
        </div>
      </div>
    </div>
  );
});
