import type { ComponentProps } from 'react';

import { type VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/lib/utils/cn';

const alertVariants = cva(
  'relative rounded-xl py-4 pr-4 pl-12 text-left text-sm [&>svg]:absolute [&>svg]:top-4.75 [&>svg]:left-4.75 [&>svg]:size-4.5',
  {
    variants: {
      color: {
        neutral: 'bg-neutral-90/50 text-neutral-25',
        'neutral-variant': 'bg-neutral-variant-90/50 text-neutral-variant-20',
        primary: 'bg-primary-90/50 text-primary-20',
        secondary: 'bg-secondary-90/50 text-secondary-20',
        tertiary: 'bg-tertiary-90/50 text-tertiary-20',
        danger: 'bg-danger-90/50 text-danger-20',
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
  <h1 {...props} className={cn('mb-1 font-sans text-base font-bold normal-case', className)} />
);

export { Alert, AlertBody, AlertTitle };
