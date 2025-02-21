import type { GlobalConfig } from 'payload';

import { Role, hasRole } from '@/payload/access';
import { revalidateGlobalAfterChange } from '@/payload/hooks/revalidate-global';

export const Config: GlobalConfig = {
  slug: 'config',
  typescript: {
    interface: 'PayloadConfigGlobal',
  },
  access: {
    read: () => true,
    update: hasRole(Role.Admin),
  },
  hooks: {
    afterChange: [revalidateGlobalAfterChange],
  },
  fields: [
    {
      name: 'rsvpDeadline',
      label: 'RSVP Deadline',
      type: 'date',
      required: true,
    },
  ],
};
