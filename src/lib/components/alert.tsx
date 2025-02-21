import type { ComponentProps } from 'react';

import { type VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/lib/utils/cn';

const alertVariants = cva(
  'relative rounded-xl py-4 pr-4 pl-12 text-left text-sm [&>svg]:absolute [&>svg]:top-4.75 [&>svg]:left-4.75 [&>svg]:size-4.5',
  {
    variants: {
      color: {
        neutral: 'text-neutral-25 bg-neutral-90/50',
        'neutral-variant': 'text-neutral-variant-20 bg-neutral-variant-90/50',
        primary: 'text-primary-20 bg-primary-90/50',
        secondary: 'text-secondary-20 bg-secondary-90/50',
        tertiary: 'text-tertiary-20 bg-tertiary-90/50',
        danger: 'text-danger-20 bg-danger-90/50',
      },
    },
    defaultVariants: {
      color: 'neutral',
    },
  },
);

const Alert = ({
  className,
  color,
  ...props
}: ComponentProps<'div'> & VariantProps<typeof alertVariants>) => (
  <div role="alert" {...props} className={cn(alertVariants({ color }), className)} />
);

const AlertBody = ({ className, ...props }: ComponentProps<'div'>) => (
  <div {...props} className={className} />
);

const AlertTitle = ({ className, ...props }: ComponentProps<'h1'>) => (
  <h1
    {...props}
    className={cn('mb-1 font-sans text-base font-bold tracking-wider normal-case', className)}
  />
);

export { Alert, AlertBody, AlertTitle };
