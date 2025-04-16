import type { ComponentProps } from 'react';

import { cn } from '@/utils/cn';

const Spinner = ({ className, ...props }: ComponentProps<'span'>) => (
  <span
    className={cn(
      'h-4 w-4 animate-spin rounded-full border-2 border-neutral-80/80 border-t-neutral-60/80',
      className,
    )}
    {...props}
  />
);

export { Spinner };
