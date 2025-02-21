import type { Block } from 'payload';

export const Faq: Block = {
  slug: 'faq',
  interfaceName: 'PayloadFaqBlock',
  labels: {
    singular: 'FAQ',
    plural: 'FAQ',
  },
  fields: [
    {
      name: 'faqs',
      type: 'relationship',
      relationTo: 'faqs',
      hasMany: true,
      minRows: 1,
    },
  ],
};
