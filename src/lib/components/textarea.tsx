import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils/cn';

const Textarea = ({ className, ...props }: ComponentProps<'textarea'>) => (
  <textarea
    className={cn(
      'bg-neutral-98 placeholder:text-neutral-variant-70 hover:bg-neutral-99 focus:bg-neutral-99 block w-full rounded-lg border-2 border-neutral-50/80 p-3 text-inherit hover:border-neutral-50 focus:ring-2 focus:ring-neutral-50/50 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
  />
);

export { Textarea };
