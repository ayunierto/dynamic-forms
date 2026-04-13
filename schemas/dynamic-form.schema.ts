import z from 'zod';

export const templateSchema = z.object({
  title: z.string(),
  description: z.string(),
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
