/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ComponentProps } from 'react';

import Image from 'next/image';

import type { PayloadMediaCollection } from '@/payload/payload-types';

export type PayloadImageProps = PayloadMediaCollection & {
  className?: string;
  loading?: ComponentProps<typeof Image>['loading'];
};

const PayloadImage = ({
  alt,
  className,
  createdAt,
  dataUrl,
  displayOriginal,
  filename,
  filesize,
  focalX,
  focalY,
  height: propsHeight,
  mimeType,
  sizes,
  thumbnailURL,
  updatedAt,
  url,
  width: propsWidth,
  ...props
}: PayloadImageProps) => {
  const src = displayOriginal ? url : sizes?.preview?.url;
  const width = displayOriginal ? propsWidth : sizes?.preview?.width;
  const height = displayOriginal ? propsHeight : sizes?.preview?.height;

  if (!src || !width || !height) {
    return null;
  }

  return (
    <Image
      src={src}
      width={width}
      height={height}
      placeholder="blur"
      blurDataURL={dataUrl ?? undefined}
      alt={alt}
      className={className}
      {...props}
    />
  );
};

export { PayloadImage };
