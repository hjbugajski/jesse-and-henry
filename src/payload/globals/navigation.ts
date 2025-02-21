import type { Field, GlobalConfig } from 'payload';

import { Role, hasRole } from '@/payload/access';
import { color } from '@/payload/fields/color';
import { linkArray, linkGroup } from '@/payload/fields/link';
import { revalidateGlobalAfterChange } from '@/payload/hooks/revalidate-global';
import { deepMerge } from '@/payload/utils/deep-merge';

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  typescript: {
    interface: 'PayloadNavigationGlobal',
  },
  access: {
    read: () => true,
    update: hasRole(Role.Admin),
  },
  hooks: {
    afterChange: [revalidateGlobalAfterChange],
  },
  fields: [
    linkArray,
    {
      name: 'showCta',
      label: 'Show Call to Action',
      type: 'checkbox',
      defaultValue: false,
    },
    deepMerge<Field>(linkGroup, {
      name: 'callToAction',
      label: 'Call to Action',
      admin: {
        condition: (_, siblingData) => siblingData.showCta,
      },
      fields: [color],
    }),
  ],
};
