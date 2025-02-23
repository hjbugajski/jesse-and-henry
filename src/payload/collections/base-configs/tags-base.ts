import type { CollectionConfig } from 'payload';

import { Role, hasRole } from '@/payload/access';

export const TagsBase: Partial<CollectionConfig> = {
  admin: {
    useAsTitle: 'value',
    group: 'Guest Collections',
    defaultColumns: ['value', 'sort', 'id'],
  },
  access: {
    create: hasRole(Role.Admin),
    read: hasRole(Role.Admin),
    update: hasRole(Role.Admin),
    delete: hasRole(Role.Admin),
  },
  defaultSort: 'sort',
  fields: [
    {
      name: 'value',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'color',
      type: 'select',
      interfaceName: 'PayloadTagColorField',
      defaultValue: 'gray',
      admin: {
        isClearable: true,
      },
      options: [
        {
          label: 'Gray',
          value: 'gray',
        },
        {
          label: 'Green',
          value: 'green',
        },
        {
          label: 'Teal',
          value: 'teal',
        },
        {
          label: 'Cyan',
          value: 'cyan',
        },
        {
          label: 'Blue',
          value: 'blue',
        },
        {
          label: 'Violet',
          value: 'violet',
        },
        {
          label: 'Purple',
          value: 'purple',
        },
        {
          label: 'Plum',
          value: 'plum',
        },
        {
          label: 'Pink',
          value: 'pink',
        },
        {
          label: 'Red',
          value: 'red',
        },
        {
          label: 'Orange',
          value: 'orange',
        },
      ],
    },
    {
      name: 'sort',
      type: 'number',
      defaultValue: 0,
    },
  ],
};
