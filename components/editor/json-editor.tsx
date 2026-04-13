'use client';

import { useState } from 'react';

import { JsonCodeEditor, type JsonCodeEditorProps } from './json-code-editor';

type JsonEditorProps = Omit<
  JsonCodeEditorProps,
  'value' | 'onValueChange' | 'onValidationChange'
> & {
  initialValue?: string;
};

export const JsonEditor = ({ initialValue = '', ...props }: JsonEditorProps) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <JsonCodeEditor
        {...props}
        value={value}
        onValueChange={setValue}
        onValidationChange={setError}
      />
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
