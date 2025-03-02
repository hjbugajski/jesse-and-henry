import type { CollectionConfig } from 'payload';

import { TagsBase } from '@/payload/collections/base-configs/tags-base';
import { deepMerge } from '@/payload/utils/deep-merge';

export const Relations: CollectionConfig<'relations'> = deepMerge<CollectionConfig<'relations'>>(
  TagsBase,
  {
    slug: 'relations',
    typescript: {
      interface: 'PayloadRelationsCollection',
    },
  },
);
