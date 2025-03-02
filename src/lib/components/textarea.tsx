import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils/cn';

const Textarea = ({ className, ...props }: ComponentProps<'textarea'>) => (
  <textarea
    className={cn(
      'block w-full rounded-lg border-2 border-neutral-50/80 bg-neutral-98 p-3 text-inherit placeholder:text-neutral-variant-70 hover:border-neutral-50 hover:bg-neutral-99 focus:bg-neutral-99 focus:ring-2 focus:ring-neutral-50/50 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
  />
);

export { Textarea };
