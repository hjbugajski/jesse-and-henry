import type { Field } from 'payload';

export const color: Field = {
  name: 'color',
  type: 'select',
  interfaceName: 'PayloadColorField',
  required: true,
  defaultValue: 'neutral',
  options: [
    {
      label: 'Neutral',
      value: 'neutral',
    },
    {
      label: 'Neutral Variant',
      value: 'neutral-variant',
    },
    {
      label: 'Primary',
      value: 'primary',
    },
    {
      label: 'Secondary',
      value: 'secondary',
    },
    {
      label: 'Tertiary',
      value: 'tertiary',
    },
    {
      label: 'Danger',
      value: 'danger',
    },
  ],
};
