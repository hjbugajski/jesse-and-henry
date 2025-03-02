import type { ComponentProps } from 'react';

import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/lib/utils/cn';
import type { PayloadColorField } from '@/payload/payload-types';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-bold whitespace-nowrap no-underline transition-colors focus-visible:ring-2 focus-visible:outline-hidden disabled:pointer-events-none',
  {
    variants: {
      variant: {
        outline:
          'border-2 disabled:border-neutral-80/80 disabled:bg-transparent disabled:text-neutral-80',
        solid: 'disabled:bg-neutral-90/80 disabled:text-neutral-70',
      },
      color: {
        neutral: 'focus-visible:ring-neutral-40/50',
        'neutral-variant': 'focus-visible:ring-neutral-variant-40/50',
        primary: 'focus-visible:ring-primary-40/50',
        secondary: 'focus-visible:ring-secondary-40/50',
        tertiary: 'focus-visible:ring-tertiary-40/50',
        danger: 'focus-visible:ring-danger-40/50',
      },
      size: {
        sm: 'h-7 gap-1 text-xs [&>.material-symbols-rounded]:text-sm',
        md: 'h-9 gap-1 text-sm [&>.material-symbols-rounded]:text-base',
        lg: 'h-11 gap-1.5 text-sm [&>.material-symbols-rounded]:text-base',
        icon: 'h-9 w-9 border-0 [&>.material-symbols-rounded]:text-2xl',
      },
      iconPosition: {
        left: 'pr-4 pl-3',
        right: 'pr-3 pl-4',
        none: 'px-4',
      },
    },
    compoundVariants: [
      {
        variant: 'outline',
        color: 'neutral',
        className:
          'border-neutral-50/80 bg-neutral-90/25 text-neutral-25 hover:border-neutral-10 hover:bg-neutral-90/50 hover:text-neutral-10',
      },
      {
        variant: 'outline',
        color: 'neutral-variant',
        className:
          'border-neutral-variant-50/80 bg-neutral-variant-90/25 text-neutral-variant-25 hover:border-neutral-variant-30 hover:bg-neutral-variant-90/50 hover:text-neutral-variant-30',
      },
      {
        variant: 'outline',
        color: 'primary',
        className:
          'border-primary-50/80 bg-primary-90/25 text-primary-25 hover:border-primary-10 hover:bg-primary-90/50 hover:text-primary-10',
      },
      {
        variant: 'outline',
        color: 'secondary',
        className:
          'border-secondary-50/80 bg-secondary-90/25 text-secondary-25 hover:border-secondary-10 hover:bg-secondary-90/50 hover:text-secondary-10',
      },
      {
        variant: 'outline',
        color: 'tertiary',
        className:
          'border-tertiary-50/80 bg-tertiary-90/25 text-tertiary-25 hover:border-tertiary-10 hover:bg-tertiary-90/50 hover:text-tertiary-10',
      },
      {
        variant: 'outline',
        color: 'danger',
        className:
          'border-danger-50/80 bg-danger-90/25 text-danger-25 hover:border-danger-10 hover:bg-danger-90/50 hover:text-danger-10',
      },
      {
        variant: 'solid',
        color: 'neutral',
        className: 'bg-neutral-10/75 text-neutral-99 hover:bg-neutral-10/80 hover:text-neutral-99',
      },
      {
        variant: 'solid',
        color: 'neutral-variant',
        className:
          'bg-neutral-variant-10/75 text-neutral-variant-99 hover:bg-neutral-variant-10/80 hover:text-neutral-variant-99',
      },
      {
        variant: 'solid',
        color: 'primary',
        className: 'hover:text-primary-100 bg-primary-10/75 text-primary-99 hover:bg-primary-10/80',
      },
      {
        variant: 'solid',
        color: 'secondary',
        className:
          'hover:text-secondary-100 bg-secondary-10/75 text-secondary-99 hover:bg-secondary-10/80',
      },
      {
        variant: 'solid',
        color: 'tertiary',
        className:
          'hover:text-tertiary-100 bg-tertiary-10/75 text-tertiary-99 hover:bg-tertiary-10/80',
      },
      {
        variant: 'solid',
        color: 'danger',
        className: 'hover:text-danger-100 bg-danger-10/75 text-danger-99 hover:bg-danger-10/80',
      },
      {
        size: 'sm',
        iconPosition: 'left',
        className: 'pr-3 pl-2',
      },
      {
        size: 'sm',
        iconPosition: 'right',
        className: 'pr-2 pl-3',
      },
      {
        size: 'sm',
        iconPosition: 'none',
        className: 'px-3',
      },
      {
        size: 'lg',
        iconPosition: 'left',
        className: 'pr-5 pl-4',
      },
      {
        size: 'lg',
        iconPosition: 'right',
        className: 'pr-4 pl-5',
      },
      {
        size: 'lg',
        iconPosition: 'none',
        className: 'px-5',
      },
    ],
    defaultVariants: {
      variant: 'outline',
      color: 'neutral',
      size: 'md',
      iconPosition: 'none',
    },
  },
);

export interface ButtonProps extends ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  color?: NonNullable<PayloadColorField>;
}

const Button = ({
  asChild = false,
  className,
  color,
  iconPosition,
  size,
  variant,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      {...props}
      className={cn(buttonVariants({ className, color, iconPosition, size, variant }))}
    />
  );
};

export { Button, buttonVariants };
