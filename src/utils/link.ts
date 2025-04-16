import type { PayloadLinkGroupField } from '@/payload/payload-types';
import { slugify } from '@/utils/slugify';

function internalLink(link: PayloadLinkGroupField) {
  if (typeof link.relationship === 'string' || !link.relationship?.path) {
    return '/';
  }

  const path = link.relationship.path === '/home' ? '/' : link.relationship.path;
  const anchor = link.anchor ? `#${link.anchor}` : '';

  return path + anchor;
}

export function linkProps(link: PayloadLinkGroupField) {
  const href = link.type === 'internal' && link.relationship ? internalLink(link) : link.url;
  const rel = link.rel && link.rel.length > 0 ? { rel: link.rel.join(',') } : {};

  return {
    href: href ?? '/',
    target: link.newTab ? '_blank' : '_self',
    ...rel,
    'aria-label': link.text,
    'data-umami-event': link.umamiEvent ?? 'Link',
    'data-umami-event-id': link.umamiEventId ?? slugify(link.text),
    'data-umami-event-url': href,
  };
}
