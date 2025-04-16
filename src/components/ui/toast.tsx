import type { ComponentProps } from 'react';

import { Close, Description, Provider, Root, Title, Viewport } from '@radix-ui/react-toast';
import { type VariantProps, cva } from 'class-variance-authority';

import { Icons } from '@/icons';
import { cn } from '@/utils/cn';

const ToastProvider = Provider;

const ToastViewport = ({ className, ...props }: ComponentProps<typeof Viewport>) => (
  <Viewport
    className={cn(
      'fixed top-0 right-0 z-100 flex max-h-screen w-full flex-col gap-2 p-2 md:max-w-[420px]',
      className,
    )}
    {...props}
  />
);

const toastVariants = cva(
  'data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-xl border-2 px-4 py-3 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none',
  {
    variants: {
      variant: {
        default:
          'group border-neutral-variant-50/50 bg-neutral-99/75 text-neutral-25 backdrop-blur-md',
        danger: 'group danger border-danger-50/80 bg-danger-90/75 text-danger-10 backdrop-blur-md',
        success:
          'group success border-secondary-50/80 bg-secondary-90/75 text-secondary-10 backdrop-blur-md',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const Toast = ({
  className,
  variant,
  ...props
}: ComponentProps<typeof Root> & VariantProps<typeof toastVariants>) => (
  <Root className={cn(toastVariants({ variant }), className)} {...props} />
);

const ToastClose = ({ className, ...props }: ComponentProps<typeof Close>) => (
  <Close
    className={cn(
      'absolute top-3 right-3 flex size-5 items-center justify-center rounded-md opacity-0 transition-opacity group-hover:opacity-100 hover:bg-neutral-90/50 hover:group-[.danger]:bg-danger-90/50 hover:group-[.success]:bg-secondary-90/50 focus:opacity-100 focus:ring-2 focus:ring-neutral-40/50 focus:outline-hidden focus:group-[.danger]:ring-danger-40/50 focus:group-[.success]:ring-secondary-40/50',
      className,
    )}
    toast-close=""
    {...props}
  >
    <Icons name="close" className="shrink-0" />
  </Close>
);

const ToastTitle = ({ className, ...props }: ComponentProps<typeof Title>) => (
  <Title className={cn('text-base font-semibold', className)} {...props} />
);

const ToastDescription = ({ className, ...props }: ComponentProps<typeof Description>) => (
  <Description className={cn('text-sm', className)} {...props} />
);

type ToastProps = ComponentProps<typeof Toast>;

export {
  type ToastProps,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
};
