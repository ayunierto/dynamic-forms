import { Template } from './schemas/dynamic-form.schema';

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
