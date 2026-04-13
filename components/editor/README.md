# Editor Reutilizable

Este directorio es portable y contiene todo lo necesario para reutilizar el editor JSON en otro módulo/proyecto.

## Exportaciones

- `JsonCodeEditor`: componente controlado (ideal para formularios, incluido React Hook Form).
- `JsonEditor`: wrapper simple con estado interno y validación visual.
- `validateJson`: utilidad pura para validar JSON.

Import recomendado:

```tsx
import { JsonCodeEditor, JsonEditor, validateJson } from '@/components/editor';
```

## Uso Controlado

```tsx
const [value, setValue] = useState('{\n  "name": "neo"\n}');

<JsonCodeEditor
  value={value}
  onValueChange={setValue}
  onValidationChange={(error) => {
    console.log(error);
  }}
  placeholder="{\n  \"name\": \"neo\"\n}"
/>
```

## Uso con React Hook Form (Controller)

```tsx
<Controller
  name="payload"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor="payload">JSON</FieldLabel>
      <JsonCodeEditor
        ref={field.ref}
        name={field.name}
        value={field.value ?? ''}
        onChange={field.onChange}
        onBlur={field.onBlur}
        id="payload"
      />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

## Nota de arquitectura

- `editor-logic.ts` contiene reglas puras de edición (autocierre, indentación, tab, backspace inteligente).
- `json-highlight.ts` contiene el tokenizado/render del resaltado JSON.
- `json-code-editor.tsx` se enfoca en composición UI + sincronización de scroll/cursor.
- `json-editor.tsx` es un wrapper para uso rápido sin formularios.
