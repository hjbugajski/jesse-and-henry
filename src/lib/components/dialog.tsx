'use client';

import type { ComponentProps } from 'react';

import {
  Close,
  Content,
  Description,
  Overlay,
  Portal,
  Root,
  Title,
  Trigger,
} from '@radix-ui/react-dialog';

import { Button } from '@/lib/components/button';
import { Icons } from '@/lib/components/icons';
import { cn } from '@/lib/utils/cn';

const Dialog = Root;

const DialogTrigger = Trigger;

const DialogPortal = Portal;

const DialogClose = Close;

const DialogOverlay = ({ className, ...props }: ComponentProps<typeof Overlay>) => (
  <Overlay
    className={cn(
      'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 backdrop-blur-xs',
      className,
    )}
    {...props}
  />
);

const DialogContent = ({ className, children, ...props }: ComponentProps<typeof Content>) => (
  <DialogPortal>
    <DialogOverlay />
    <Content
      className={cn('fixed inset-0 z-50 flex w-full items-center justify-center p-4', className)}
      {...props}
    >
      <div className="bg-neutral-99/75 relative flex w-full max-w-md flex-col rounded-2xl border-2 border-neutral-50/50 p-6 backdrop-blur-md">
        {children}
        <Close asChild>
          <Button className="absolute top-4 right-4" size="icon">
            <Icons name="close" size="lg" />
            <span className="sr-only">Close</span>
          </Button>
        </Close>
      </div>
    </Content>
  </DialogPortal>
);

const DialogHeader = ({ className, ...props }: ComponentProps<'div'>) => (
  <div className={cn('mb-2', className)} {...props} />
);

const DialogFooter = ({ className, ...props }: ComponentProps<'div'>) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
    {...props}
  />
);

const DialogTitle = ({ className, ...props }: ComponentProps<typeof Title>) => (
  <Title
    className={cn('font-sans text-lg font-bold tracking-normal normal-case', className)}
    {...props}
  />
);

const DialogDescription = ({ className, ...props }: ComponentProps<typeof Description>) => (
  <Description className={cn('text-sm', className)} {...props} />
);

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
