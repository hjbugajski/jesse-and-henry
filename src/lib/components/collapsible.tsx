'use client';

import {
  CollapsibleContent as PrimitiveCollapsibleContent,
  CollapsibleTrigger as PrimitiveCollapsibleTrigger,
  Root,
} from '@radix-ui/react-collapsible';

const Collapsible = Root;

const CollapsibleTrigger = PrimitiveCollapsibleContent;

const CollapsibleContent = PrimitiveCollapsibleTrigger;

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
