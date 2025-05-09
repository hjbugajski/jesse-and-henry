'use client';

import type { ComponentProps } from 'react';

import { Content, Header, Item, Root, Trigger } from '@radix-ui/react-accordion';

import { Icons } from '@/icons';
import { cn } from '@/utils/cn';

const Accordion = Root;

const AccordionItem = ({ className, ...props }: ComponentProps<typeof Item>) => (
  <Item
    className={cn('group border-b-2 border-neutral-variant-50/80 last:border-b-0', className)}
    {...props}
  />
);

const AccordionHeader = ({ className, ...props }: ComponentProps<typeof Header>) => (
  <Header
    className={cn('flex font-sans font-bold tracking-normal normal-case', className)}
    {...props}
  />
);

const AccordionTrigger = ({ className, children, ...props }: ComponentProps<typeof Trigger>) => (
  <Trigger
    className={cn(
      'flex flex-1 justify-between overflow-clip py-4 text-left text-xl group-first:pt-0 hover:text-neutral-10 focus:outline-neutral-variant-50/80 [&[data-state=open]>svg]:rotate-180',
      className,
    )}
    {...props}
  >
    {children}
    <Icons name="chevronDown" className="size-6 shrink-0 transition-transform duration-200" />
  </Trigger>
);

const AccordionContent = ({ className, children, ...props }: ComponentProps<typeof Content>) => (
  <Content
    className={cn(
      'overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
      className,
    )}
    {...props}
  >
    <div className="pt-0 pb-4 group-last:pb-0">{children}</div>
  </Content>
);

export { Accordion, AccordionItem, AccordionHeader, AccordionTrigger, AccordionContent };
