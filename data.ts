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

export const testTemplate: Template = {
  title: 'Test Template',
  description: 'This is a test template for dynamic forms.',
  sections: [
    {
      title: 'Personal Information',
      printFormat: 'table',
      fields: [
        {
          label: 'First Name',
          type: 'text',
          name: 'firstName',
          isTitle: true,
          required: true,
        },
        {
          label: 'Last Name',
          type: 'text',
          name: 'lastName',
          required: true,
        },
        {
          label: 'Email',
          type: 'email',
          name: 'email',
        },
        {
          label: 'Birthdate',
          type: 'date',
          name: 'birthdate',
        },
        {
          label: 'Gender',
          type: 'radio',
          name: 'gender',
          options: [
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
            { label: 'Other', value: 'other' },
          ],
        },
      ],
    },
    {
      title: 'Survey Questions',
      printFormat: 'table',
      fields: [
        {
          label: 'How satisfied are you with our product?',
          type: 'select',
          name: 'satisfaction',
          options: [
            { label: 'Very Satisfied', value: 'very_satisfied' },
            { label: 'Satisfied', value: 'satisfied' },
            { label: 'Neutral', value: 'neutral' },
            { label: 'Dissatisfied', value: 'dissatisfied' },
            { label: 'Very Dissatisfied', value: 'very_dissatisfied' },
          ],
        },
        {
          label: 'What features do you use the most?',
          type: 'checkbox',
          name: 'features',
          options: [
            { label: 'Feature A', value: 'feature_a' },
            { label: 'Feature B', value: 'feature_b' },
            { label: 'Feature C', value: 'feature_c' },
          ],
        },
      ],
    },
  ],
};
