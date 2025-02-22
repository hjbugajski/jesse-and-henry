import type { ComponentProps, InputHTMLAttributes } from 'react';

import { cn } from '@/lib/utils/cn';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = ({ className, ...props }: ComponentProps<'input'>) => (
  <input
    className={cn(
      'bg-neutral-98 placeholder:text-neutral-variant-70 hover:bg-neutral-99 focus:bg-neutral-99 block h-11 w-full rounded-lg border-2 border-neutral-50/80 px-3 text-inherit hover:border-neutral-50 focus:ring-2 focus:ring-neutral-50/50 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
  />
);

export { Input };
