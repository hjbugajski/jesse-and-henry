import type { Block } from 'payload';

import { linkFields } from '@/payload/fields/link';

export const ImageLink: Block = {
  slug: 'imageLink',
  interfaceName: 'PayloadImageLinkBlock',
  fields: [
    ...linkFields,
    {
      name: 'image',
      type: 'relationship',
      relationTo: 'media',
      required: true,
    },
  ],
};
