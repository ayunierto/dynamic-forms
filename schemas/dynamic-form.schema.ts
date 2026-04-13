import { z } from 'zod';

export const templateSchema = z.object({
  title: z
    .string('El título es requerido')
    .min(1, 'El título no puede estar vacío'),
  description: z
    .string('La descripción es requerida')
    .min(1, 'La descripción no puede estar vacía'),
  sections: z.array(
    z.object({
      title: z.string(),
      printFormat: z.enum(['table', 'list']),
      fields: z.array(
        z.object({
          label: z.string(),
          type: z.enum([
            'text',
            'email',
            'date',
            'radio',
            'select',
            'checkbox',
            'textarea',
            'number',
            'password',
          ]),
          name: z.string(),
          options: z
            .array(
              z.object({
                label: z.string(),
                value: z.string(),
              }),
            )
            .optional(),
          isTitle: z.boolean().optional(),
          required: z.boolean().optional(),
          defaultValue: z.union([z.string(), z.array(z.string())]).optional(),
          iaInstructions: z.string().optional(),
        }),
      ),
    }),
  ),
});

export type Template = z.infer<typeof templateSchema>;

export const jsonTemplateSchema = z.object({
  jsonTemplate: templateSchema,
});

export type JsonTemplate = z.infer<typeof jsonTemplateSchema>;
