import type { SerializedHeadingNode } from '@payloadcms/richtext-lexical';

import type { JSXConverter } from '@/components/rich-text';
import { cn } from '@/utils/cn';
import { slugify } from '@/utils/slugify';

const headingClasses = (node: SerializedHeadingNode) => {
  switch (node.tag) {
    case 'h1':
      return 'mb-6 mt-9 text-3xl';
    case 'h2':
      return 'mb-4 mt-7 font-sans text-2xl font-bold normal-case tracking-normal w-full border-b-2 border-neutral-variant-50/50 pb-2';
    default:
      return 'mb-3 mt-6 font-sans text-xl font-bold normal-case tracking-normal';
  }
};

export const headingConverter: JSXConverter<SerializedHeadingNode> = ({
  additionalClass,
  node,
  nodesToJSX,
  overrideClass,
}) => (
  <node.tag
    // @ts-expect-error – valid key
    id={slugify(node.children?.map((c) => c.text).join(' '))}
    className={overrideClass || cn('first:mt-0 last:mb-0', headingClasses(node), additionalClass)}
  >
    {nodesToJSX({ nodes: node.children })}
  </node.tag>
);
