import Link from 'next/link';

import { PayloadImage } from '@/components/ui/payload-image';
import { Icons } from '@/icons';
import { linkProps } from '@/lib/utils/link';
import type { PayloadImageLinkBlock } from '@/payload/payload-types';

export function ImageLinkBlock({ image, ...link }: PayloadImageLinkBlock) {
  return (
    <div className="relative my-4 flex h-96 w-full items-center justify-center overflow-clip rounded-xl">
      {typeof image === 'string' ? null : (
        <PayloadImage {...image} className="absolute object-cover object-center" />
      )}
      <div className="absolute inset-0 z-0 h-full w-full rounded-xl bg-neutral-10/50" />
      <Link
        {...linkProps(link)}
        className="z-10 flex h-full w-full flex-col items-center justify-center gap-4 rounded-xl text-neutral-95 no-underline drop-shadow-xs drop-shadow-neutral-10 hover:text-primary-95"
      >
        {link.icon && <Icons name={link.icon} className="h-32 w-32" />}
        <span className="mx-auto max-w-xs text-center font-serif text-xl tracking-wider uppercase">
          {link.text}
        </span>
      </Link>
    </div>
  );
}
