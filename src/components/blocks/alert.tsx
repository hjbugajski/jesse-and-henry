import Link from 'next/link';

import { RichText } from '@/components/rich-text';
import { Alert, AlertBody, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Icons } from '@/icons';
import type { PayloadAlertBlock } from '@/payload/payload-types';
import { linkProps } from '@/utils/link';

export function AlertBlock(props: PayloadAlertBlock) {
  const { action, color, content, heading, icon, link } = props;

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
