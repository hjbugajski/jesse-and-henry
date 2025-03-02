import { customAlphabet } from 'nanoid';
import type { CollectionBeforeValidateHook, CollectionConfig } from 'payload';

import { TagsBase } from '@/payload/collections/base-configs/tags-base';
import type { PayloadPartiesCollection } from '@/payload/payload-types';
import { deepMerge } from '@/payload/utils/deep-merge';

const beforeValidateHook: CollectionBeforeValidateHook<PayloadPartiesCollection> = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== 'create' || !data || data.code) {
    return data;
  }

  const nanoid = customAlphabet('1234567890', 6);
  const codes = await req.payload
    .find({ collection: 'parties', pagination: false })
    .then((data) => data.docs.map((doc) => doc.code))
    .then((codes) => new Set(codes));
  let code: string;

  do {
    code = nanoid();
  } while (codes.has(code));

  return Object.assign(data, { code });
};

export const Parties: CollectionConfig<'parties'> = deepMerge<CollectionConfig<'parties'>>(
  TagsBase,
  {
    slug: 'parties',
    typescript: {
      interface: 'PayloadPartiesCollection',
    },
    admin: {
      defaultColumns: ['value', 'code', 'color', 'sort'],
    },
    hooks: {
      beforeValidate: [beforeValidateHook],
    },
    fields: [
      {
        name: 'code',
        type: 'text',
        unique: true,
        admin: {
          position: 'sidebar',
          readOnly: true,
        },
      },
    ],
  },
);
