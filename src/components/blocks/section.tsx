import Link from 'next/link';

import { RichText } from '@/components/rich-text';
import type { PayloadSectionBlock } from '@/payload/payload-types';
import { cn } from '@/utils/cn';
import { slugify } from '@/utils/slugify';

export function SectionBlock({ border, content, heading }: PayloadSectionBlock) {
  return (
    <section
      className={cn(
        border && 'border-t-2 border-b-2 border-neutral-variant-50/50 xl:rounded-3xl xl:border-2',
        'mx-auto w-full max-w-7xl',
      )}
    >
      <div className="mx-auto w-full max-w-5xl px-4 py-12">
        {heading && (
          <Link
            href={`#${slugify(heading)}`}
            className="mb-6 block w-fit rounded-md no-underline focus:ring-2 focus:ring-neutral-40/50 focus:outline-hidden"
          >
            <h1 id={slugify(heading)} className="w-fit text-3xl">
              {heading}
            </h1>
          </Link>
        )}
        <RichText data={content} />
      </div>
    </section>
  );
}
