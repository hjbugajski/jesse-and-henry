import type { Field } from 'payload';

import { icon } from '@/payload/fields/icon';
import { deepMerge } from '@/payload/utils/deep-merge';

const baseFields: Field[] = [
  {
    name: 'type',
    type: 'radio',
    required: true,
    defaultValue: 'internal',
    options: [
      {
        label: 'Internal',
        value: 'internal',
      },
      {
        label: 'External',
        value: 'external',
      },
    ],
  },
  {
    type: 'row',
    admin: {
      condition: (_, siblingData) => siblingData?.type === 'internal',
    },
    fields: [
      {
        name: 'relationship',
        label: 'Page',
        type: 'relationship',
        relationTo: 'pages',
        required: true,
        admin: {
          condition: (_, siblingData) => siblingData?.type === 'internal',
          width: '50%',
        },
      },
      {
        name: 'anchor',
        type: 'text',
        admin: {
          condition: (_, siblingData) => siblingData?.type === 'internal',
          width: '50%',
        },
      },
    ],
  },
  {
    type: 'row',
    admin: {
      condition: (_, siblingData) => siblingData?.type === 'external',
    },
    fields: [
      {
        name: 'url',
        label: 'External URL',
        type: 'text',
        required: true,
        admin: {
          condition: (_, siblingData) => siblingData?.type === 'external',
          width: '50%',
        },
      },
      {
        name: 'rel',
        label: 'Rel Attribute',
        type: 'select',
        interfaceName: 'PayloadRelField',
        hasMany: true,
        options: ['noopener', 'noreferrer', 'nofollow'],
        admin: {
          condition: (_, siblingData) => siblingData?.type === 'external',
          width: '50%',
        },
      },
    ],
  },
  {
    name: 'newTab',
    label: 'Open in new tab',
    type: 'checkbox',
    defaultValue: false,
  },
  {
    type: 'row',
    fields: [
      {
        name: 'umamiEvent',
        type: 'text',
        admin: {
          width: '50%',
        },
      },
      {
        name: 'umamiEventId',
        label: 'Umami Event ID',
        type: 'text',
        admin: {
          width: '50%',
        },
      },
    ],
  },
];

export const richTextLinkFields: Field[] = baseFields;

export const linkFields: Field[] = [
  {
    type: 'row',
    fields: [
      {
        name: 'text',
        type: 'text',
        required: true,
        admin: {
          width: '50%',
        },
      },
      deepMerge<Field>(icon, {
        admin: {
          width: '50%',
        },
      }),
    ],
  },
  ...baseFields,
];

export const linkGroup: Field = {
  name: 'link',
  type: 'group',
  interfaceName: 'PayloadLinkGroupField',
  fields: linkFields,
};

export const linkArray: Field = {
  name: 'links',
  type: 'array',
  interfaceName: 'PayloadLinkArrayField',
  admin: {
    components: {
      RowLabel: {
        path: '@/payload/components/row-label.tsx',
        exportName: 'RowLabel',
        clientProps: {
          path: 'text',
          fallback: 'Link',
        },
      },
    },
  },
  fields: linkFields,
};
