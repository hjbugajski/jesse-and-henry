import type { CollectionConfig } from 'payload';

import { TagsBase } from '@/payload/collections/base-configs/tags-base';
import { deepMerge } from '@/payload/utils/deep-merge';

export const Sides: CollectionConfig<'sides'> = deepMerge<CollectionConfig<'sides'>>(TagsBase, {
  slug: 'sides',
  typescript: {
    interface: 'PayloadSidesCollection',
  },
});
