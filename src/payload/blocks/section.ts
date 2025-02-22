import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical';
import type { Block, Field } from 'payload';

import { Alert } from '@/payload/blocks/alert';
import { ButtonLink } from '@/payload/blocks/button-link';
import { Faq } from '@/payload/blocks/faq';
import { Gallery } from '@/payload/blocks/gallery';
import { ImageLink } from '@/payload/blocks/image-link';
import { heading } from '@/payload/fields/heading';
import { deepMerge } from '@/payload/utils/deep-merge';

export const Section: Block = {
  slug: 'section',
  interfaceName: 'PayloadSectionBlock',
  fields: [
    deepMerge<Field>(heading, { required: false }),
    {
      name: 'border',
      type: 'checkbox',
      required: true,
      defaultValue: false,
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          BlocksFeature({
            blocks: [Alert, ButtonLink, Faq, Gallery, ImageLink],
          }),
        ],
      }),
    },
  ],
};
