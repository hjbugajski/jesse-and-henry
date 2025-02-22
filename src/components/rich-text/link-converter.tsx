import type { SerializedLinkNode } from '@payloadcms/richtext-lexical';
import Link from 'next/link';

import type { JSXConverter } from '@/components/rich-text';
import { cn } from '@/lib/utils/cn';
import { linkProps } from '@/lib/utils/link';
import type { PayloadLinkGroupField } from '@/payload/payload-types';

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
        'hover:text-neutral-10 focus-visible:ring-neutral-40/50 rounded-md underline underline-offset-4 transition-all focus-visible:no-underline focus-visible:ring-2 focus-visible:outline-hidden',
        additionalClass,
      )
    }
  >
    {nodesToJSX({ nodes: node.children })}
  </Link>
);
