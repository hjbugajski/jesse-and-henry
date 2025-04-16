import type { SerializedLinkNode } from '@payloadcms/richtext-lexical';
import Link from 'next/link';

import type { JSXConverter } from '@/components/rich-text';
import type { PayloadLinkGroupField } from '@/payload/payload-types';
import { cn } from '@/utils/cn';
import { linkProps } from '@/utils/link';

export const linkConverter: JSXConverter<SerializedLinkNode> = ({
  additionalClass,
  node,
  nodesToJSX,
  overrideClass,
}) => (
  <Link
    {...linkProps(node.fields as unknown as PayloadLinkGroupField)}
    className={
      overrideClass ||
      cn(
        'rounded-md underline underline-offset-4 transition-all hover:text-neutral-10 focus-visible:no-underline focus-visible:ring-2 focus-visible:ring-neutral-40/50 focus-visible:outline-hidden',
        additionalClass,
      )
    }
  >
    {nodesToJSX({ nodes: node.children })}
  </Link>
);
