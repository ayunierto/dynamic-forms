import { z } from 'zod';

const titleSchema = z
  .string({
    error: 'La plantilla debe contener una key "title" y es requerida',
  })
  .trim()
  .min(1, {
    error: 'El título no puede estar vacío, debe contener al menos un carácter',
  })
  .max(50, {
    error: 'El título no puede exceder los 50 caracteres',
  });

const descriptionSchema = z
  .string({
    error: 'La plantilla debe contener una key "description" y es requerida',
  })
  .trim()
  .min(1, {
    error:
      'La descripción no puede estar vacía, debe contener al menos un carácter',
  })
  .max(200, {
    error: 'La descripción no puede exceder los 200 caracteres',
  });

const printFormatSchema = z.enum(['table', 'list', 'grid'], {
  error:
    'Cada sección debe contener una key "printFormat" con un valor válido (table, list o grid) y es requerida',
});

const fieldTypeSchema = z
  .object({
    label: z
      .string({
        error: 'Cada field debe contener una key "label" y es requerida',
      })
      .trim()
      .min(1, {
        error:
          'El label del field no puede estar vacío, debe contener al menos un carácter',
      }),
    type: z.enum(
      [
        'text',
        'email',
        'date',
        'radio',
        'select',
        'checkbox',
        'textarea',
        'number',
        'password',
      ],
      {
        error:
          'Cada field debe contener una key "type" con un valor válido (text, email, date, radio, select, checkbox, textarea, number o password) y es requerida',
      },
    ),
    name: z
      .string({
        error: 'Cada field debe contener una key "name" y es requerida',
      })
      .trim()
      .min(1, {
        error:
          'El name del field no puede estar vacío, debe contener al menos un carácter',
      })
      .max(50, {
        error: 'El name del field no puede exceder los 50 caracteres',
      }),
    options: z
      .array(
        z.object({
          label: z.string({
            error: 'Cada opción debe contener una key "label" y es requerida',
          }),
          value: z.string({
            error: 'Cada opción debe contener una key "value" y es requerida',
          }),
        }),
      )
      .optional()
      .superRefine((options, ctx) => {
        if (options) {
          options.forEach((option, index) => {
            const seen = new Set();
            if (seen.has(option.value)) {
              ctx.addIssue({
                code: 'custom',
                message: `El value de la opción en index ${index} debe ser único dentro del mismo field`,
              });
            } else {
              seen.add(option.value);
            }
          });
        }
      }),

    isTitle: z.boolean().optional(),
    required: z.boolean().optional(),
    defaultValue: z.union([z.string(), z.array(z.string())]).optional(),
    iaInstructions: z.string().optional(),
  })
  .superRefine((field, ctx) => {
    if (
      (['select', 'radio', 'checkbox'].includes(field.type) &&
        (!field.options || field.options.length === 0)) ||
      (field.options &&
        ['select', 'radio', 'checkbox'].includes(field.type) &&
        field.options.some(
          (option) =>
            typeof option.label !== 'string' ||
            typeof option.value !== 'string' ||
            option.label.trim() === '' ||
            option.value.trim() === '',
        ))
    ) {
      ctx.addIssue({
        code: 'custom',
        message:
          'Los campos de tipo select, radio o checkbox deben tener un array "options" con al menos una opción válida que contenga "label" y "value" no vacíos.',
      });
    }

    // Validar defaultValue según el tipo de campo
    if (field.defaultValue != undefined) {
      // Validar que defaultValue sea un string para campos de tipo text, email, date, textarea, password
      if (
        ['text', 'email', 'date', 'textarea', 'password'].includes(
          field.type,
        ) &&
        typeof field.defaultValue !== 'string'
      ) {
        ctx.addIssue({
          code: 'custom',
          message: `defaultValue para campos de tipo ${field.type} debe ser una cadena de texto.`,
        });
      }

      // Validar que defaultValue sea un array de strings para campos de tipo checkbox
      if (
        field.type === 'checkbox' &&
        !(
          Array.isArray(field.defaultValue) &&
          field.defaultValue.every((val) => typeof val === 'string')
        )
      ) {
        ctx.addIssue({
          code: 'custom',
          message:
            'defaultValue para campos de tipo checkbox debe ser un array de cadenas de texto.',
        });
      }

      // Validar que defaultValue sea un string para campos de tipo radio y que coincida con una de las opciones
      if (
        field.type === 'radio' &&
        (typeof field.defaultValue !== 'string' ||
          (field.options &&
            !field.options.some(
              (option) => option.value === field.defaultValue,
            )))
      ) {
        ctx.addIssue({
          code: 'custom',
          message:
            'defaultValue para campos de tipo radio debe ser una cadena de texto que coincida con el value de una de las opciones.',
        });
      }

      // Validar que defaultValue sea un string para campos de tipo select y que coincida con una de las opciones
      if (
        field.type === 'select' &&
        (typeof field.defaultValue !== 'string' ||
          (field.options &&
            !field.options.some(
              (option) => option.value === field.defaultValue,
            )))
      ) {
        ctx.addIssue({
          code: 'custom',
          message:
            'defaultValue para campos de tipo select debe ser una cadena de texto que coincida con el value de una de las opciones.',
        });
      }

      // Validar que defaultValue sea un número para campos de tipo number
      if (field.type === 'number' && typeof field.defaultValue !== 'number') {
        ctx.addIssue({
          code: 'custom',
          message:
            'defaultValue para campos de tipo number debe ser un número.',
        });
      }

      // Validar que defaultValue sea un array de strings para campos de tipo checkbox y que cada valor coincida con una de las opciones
      if (
        field.type === 'checkbox' &&
        Array.isArray(field.defaultValue) &&
        field.options &&
        !field.defaultValue.every((val) =>
          field.options?.some((option) => option.value === val),
        )
      ) {
        ctx.addIssue({
          code: 'custom',
          message:
            'Cada valor en defaultValue para campos de tipo checkbox debe coincidir con el value de una de las opciones.',
        });
      }
    }
  });

const sectionSchema = z.object(
  {
    title: titleSchema,
    printFormat: printFormatSchema,
    fields: z
      .array(fieldTypeSchema, {
        error:
          'La clave "fields" es obligatoria en cada sección y debe ser un array de objetos con las propiedades "label", "type" y "name" como mínimo.',
      })
      .min(1, {
        error:
          'El campo "fields" debe contener al menos un elemento. Ej. { label: "Nombre", type: "text", name: "nombre" }',
      }),
  },
  {
    error:
      'Error en la sección: cada sección debe tener un "title", un "printFormat" válido y un array de campos correctamente definidos.',
  },
);

export const templateSchema = z.object(
  {
    title: titleSchema,
    description: descriptionSchema,
    sections: z
      .array(sectionSchema)
      .min(
        1,
        'El formulario debe tener al menos una sección: Ej. { title: "Sección 1", printFormat: "table", fields: [] }',
      ),
  },
  {
    error:
      'La plantilla debe ser un json válido con las claves "title", "description" y un array de "sections" correctamente definidos. Verifica que la sintaxis sea correcta y que todas las secciones y campos cumplan con los requisitos especificados.',
  },
);

export const jsonTemplateSchema = z.object({
  jsonTemplate: templateSchema,
});

export type JsonTemplate = z.infer<typeof jsonTemplateSchema>;
