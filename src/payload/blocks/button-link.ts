import type { Block } from 'payload';

import { color } from '@/payload/fields/color';
import { linkFields } from '@/payload/fields/link';

export const ButtonLink: Block = {
  slug: 'buttonLink',
  interfaceName: 'PayloadButtonLinkBlock',
  fields: [...linkFields, color],
};
