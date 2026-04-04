import type { ComponentType } from 'react';

import Link from 'next/link';

import { Alert, AlertBody, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Icons } from '@/icons';
import type { PayloadAlertBlock } from '@/payload/payload-types';
import { linkProps } from '@/utils/link';

interface AlertBlockProps extends PayloadAlertBlock {
  RichText: ComponentType<{ data?: PayloadAlertBlock['content'] }>;
}

export function AlertBlock(props: AlertBlockProps) {
  const { action, color, content, heading, icon, link, RichText } = props;

  return (
    <Alert color={color} className="my-6 first:mt-0 last:mb-0">
      <Icons name={icon!} />
      <AlertBody>
        <AlertTitle>{heading}</AlertTitle>
        <RichText data={content} />
      </AlertBody>
      {action && link && (
        <Button
          asChild
          color={color}
          iconPosition={link.icon ? 'right' : 'none'}
          size="sm"
          className="mt-4"
        >
          <Link {...linkProps(link)}>
            {link.text}
            {link.icon && <Icons name={link.icon} size="sm" />}
          </Link>
        </Button>
      )}
    </Alert>
  );
}
