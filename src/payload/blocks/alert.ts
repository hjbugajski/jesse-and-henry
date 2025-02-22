import {
  BoldFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  UnderlineFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical';
import type { Block, Field } from 'payload';

import { color } from '@/payload/fields/color';
import { heading } from '@/payload/fields/heading';
import { icon } from '@/payload/fields/icon';
import { linkGroup, richTextLinkFields } from '@/payload/fields/link';
import { deepMerge } from '@/payload/utils/deep-merge';

export const Alert: Block = {
  slug: 'alert',
  interfaceName: 'PayloadAlertBlock',
  fields: [
    heading,
    {
      type: 'row',
      fields: [
        deepMerge<Field>(icon, {
          required: true,
          admin: {
            width: '50%',
          },
        }),
        deepMerge<Field>(color, {
          admin: {
            width: '50%',
          },
        }),
      ],
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: () => [
          ParagraphFeature(),
          BoldFeature(),
          ItalicFeature(),
          UnderlineFeature(),
          StrikethroughFeature(),
          UnorderedListFeature(),
          OrderedListFeature(),
          SuperscriptFeature(),
          SubscriptFeature(),
          LinkFeature({ fields: richTextLinkFields }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
    {
      name: 'action',
      type: 'checkbox',
      defaultValue: false,
    },
    deepMerge<Field>(linkGroup, {
      admin: {
        condition: (_, siblingData) => siblingData.action,
      },
    }),
  ],
};
