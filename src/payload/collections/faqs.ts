import {
  AlignFeature,
  BlocksFeature,
  BoldFeature,
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
import type { CollectionConfig } from 'payload';

import { Role, hasRole, hasRoleOrPublished } from '@/payload/access';
import { Alert } from '@/payload/blocks/alert';
import { ButtonLink } from '@/payload/blocks/button-link';
import { richTextLinkFields } from '@/payload/fields/link';

export const Faqs: CollectionConfig<'faqs'> = {
  slug: 'faqs',
  typescript: {
    interface: 'PayloadFaqsCollection',
  },
  labels: {
    singular: 'FAQs',
    plural: 'FAQs',
  },
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'updatedAt'],
  },
  versions: {
    drafts: true,
  },
  access: {
    create: hasRole(Role.Admin),
    read: hasRoleOrPublished(Role.Admin),
    update: hasRole(Role.Admin),
    delete: hasRole(Role.Admin),
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
    },
    {
      name: 'answer',
      type: 'richText',
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
          AlignFeature(),
          LinkFeature({ fields: richTextLinkFields }),
          BlocksFeature({
            blocks: [Alert, ButtonLink],
          }),
        ],
      }),
    },
  ],
};
