import type { ComponentProps, JSX } from 'react';

import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';

import { IconAlert } from '@/icons/alert';
import { IconArrowRight } from '@/icons/arrow-right';
import { IconBorgoCorsignano } from '@/icons/borgo-corsignano';
import { IconChevronDown } from '@/icons/chevron-down';
import { IconCircleCheck } from '@/icons/circle-check';
import { IconCircleX } from '@/icons/circle-x';
import { IconClose } from '@/icons/close';
import { IconExternalLink } from '@/icons/external-link';
import { IconHeart } from '@/icons/heart';
import { IconHelp } from '@/icons/help';
import { IconInfo } from '@/icons/info';
import { IconLogout } from '@/icons/logout';
import { IconMaximize } from '@/icons/maximize';
import { IconMenu } from '@/icons/menu';
import { IconMinimize } from '@/icons/minimize';
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
