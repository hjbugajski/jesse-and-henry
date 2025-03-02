import type { ComponentProps, JSX } from 'react';

import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';

import { IconAlert } from '@/lib/components/icons/alert';
import { IconArrowRight } from '@/lib/components/icons/arrow-right';
import { IconBorgoCorsignano } from '@/lib/components/icons/borgo-corsignano';
import { IconChevronDown } from '@/lib/components/icons/chevron-down';
import { IconCircleCheck } from '@/lib/components/icons/circle-check';
import { IconCircleX } from '@/lib/components/icons/circle-x';
import { IconClose } from '@/lib/components/icons/close';
import { IconExternalLink } from '@/lib/components/icons/external-link';
import { IconHeart } from '@/lib/components/icons/heart';
import { IconHelp } from '@/lib/components/icons/help';
import { IconInfo } from '@/lib/components/icons/info';
import { IconLogout } from '@/lib/components/icons/logout';
import { IconMaximize } from '@/lib/components/icons/maximize';
import { IconMenu } from '@/lib/components/icons/menu';
import { IconMinimize } from '@/lib/components/icons/minimize';
import type { BaseProps } from '@/lib/types/base-props';
import { cn } from '@/lib/utils/cn';
import type { PayloadIconField } from '@/payload/payload-types';

const icons: Record<
  NonNullable<PayloadIconField>,
  (props: ComponentProps<'svg'>) => JSX.Element
> = {
  alert: IconAlert,
  arrowRight: IconArrowRight,
  borgoCorsignano: IconBorgoCorsignano,
  chevronDown: IconChevronDown,
  circleCheck: IconCircleCheck,
  circleX: IconCircleX,
  close: IconClose,
  externalLink: IconExternalLink,
  heart: IconHeart,
  help: IconHelp,
  info: IconInfo,
  logout: IconLogout,
  maximize: IconMaximize,
  menu: IconMenu,
  minimize: IconMinimize,
};

const iconVariants = cva('', {
  variants: {
    size: {
      sm: 'size-4',
      md: 'size-5',
      lg: 'size-6',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export interface IconProps extends Omit<BaseProps, 'children'>, VariantProps<typeof iconVariants> {
  name: keyof typeof icons;
}

export function Icons({ className, name, size, ...rest }: IconProps) {
  const IconComponent = icons[name];

  return <IconComponent className={cn(iconVariants({ size }), 'shrink-0', className)} {...rest} />;
}
