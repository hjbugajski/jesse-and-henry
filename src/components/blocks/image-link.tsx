import Image from 'next/image';
import Link from 'next/link';

import { Icons } from '@/lib/components/icons';
import { linkProps } from '@/lib/utils/link';
import type { PayloadImageLinkBlock } from '@/payload/payload-types';

export function ImageLinkBlock({ image, ...link }: PayloadImageLinkBlock) {
  return (
    <div className="relative my-4 flex h-96 w-full items-center justify-center overflow-clip rounded-xl">
      {typeof image === 'string' ? null : (
        <Image
          src={image.url!}
          alt={image.alt}
          width={image.width!}
          height={image.height!}
          placeholder="blur"
          blurDataURL={image.dataUrl!}
          className="absolute object-cover object-center"
        />
      )}
      <div className="bg-neutral-10/50 absolute inset-0 z-0 h-full w-full rounded-xl" />
      <Link
        {...linkProps(link)}
        className="drop-shadow-neutral-10 text-neutral-95 hover:text-primary-95 z-10 flex h-full w-full flex-col items-center justify-center gap-4 rounded-xl no-underline drop-shadow-xs"
      >
        {link.icon && <Icons name={link.icon} className="h-32 w-32" />}
        <span className="mx-auto max-w-xs text-center font-serif text-xl tracking-wider uppercase">
          {link.text}
        </span>
      </Link>
    </div>
  );
}
