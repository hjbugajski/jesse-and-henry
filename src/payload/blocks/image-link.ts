import { linkFields } from '@/payload/fields/link';
import { Block } from 'payload';

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
