import type { ComponentProps, InputHTMLAttributes } from 'react';

import { cn } from '@/utils/cn';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = ({ className, ...props }: ComponentProps<'input'>) => (
  <input
    className={cn(
      'block h-11 w-full rounded-lg border-2 border-neutral-50/80 bg-neutral-98 px-3 text-inherit placeholder:text-neutral-variant-70 hover:border-neutral-50 hover:bg-neutral-99 focus:bg-neutral-99 focus:ring-2 focus:ring-neutral-50/50 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
  />
);

export { Input };
