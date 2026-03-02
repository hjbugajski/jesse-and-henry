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
  createdAt: _createdAt,
  dataUrl,
  displayOriginal,
  filename: _filename,
  filesize: _filesize,
  focalX: _focalX,
  focalY: _focalY,
  height: propsHeight,
  mimeType: _mimeType,
  sizes,
  thumbnailURL: _thumbnailURL,
  updatedAt: _updatedAt,
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
