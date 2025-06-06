import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Icons } from '@/icons';
import type { PayloadButtonLinkBlock } from '@/payload/payload-types';
import { linkProps } from '@/utils/link';

export function ButtonLinkBlock(props: PayloadButtonLinkBlock) {
  const { color, icon, text } = props;

  return (
    <div className="my-4 first:mt-0 last:mb-0">
      <Button asChild color={color} iconPosition={icon ? 'right' : 'none'}>
        <Link {...linkProps(props)}>
          {text}
          {icon && <Icons name={icon} />}
        </Link>
      </Button>
    </div>
  );
}
