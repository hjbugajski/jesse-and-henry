'use client';

import type { ComponentProps } from 'react';

import { Root } from '@radix-ui/react-label';

import { cn } from '@/utils/cn';

const Label = ({ className, ...props }: ComponentProps<typeof Root>) => (
  <Root
    className={cn(
      'text-sm font-bold tracking-wider text-neutral-variant-25 peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      className,
    )}
    {...props}
  />
);

export { Label };
