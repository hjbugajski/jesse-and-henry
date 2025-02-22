import { PayloadImage } from '@/lib/components/payload-image';
import type { PayloadGalleryBlock } from '@/payload/payload-types';

export function GalleryBlock({ images }: PayloadGalleryBlock) {
  return (
    <ul className="grid grid-cols-1 items-center gap-4 md:grid-cols-2 lg:grid-cols-3">
      {images
        .filter((image) => typeof image !== 'string')
        .map((image) => (
          <li key={image.id} className={image.width! > image.height! ? 'md:col-span-2' : ''}>
            <PayloadImage {...image} loading="lazy" className="rounded-xl" />
          </li>
        ))}
    </ul>
  );
}
