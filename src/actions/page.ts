import { cache } from 'react';

import { cacheLife, cacheTag } from 'next/cache';
import { draftMode } from 'next/headers';
import { getPayload } from 'payload';

import config from '@payload-config';

import { fetchGuest, fetchUser } from '@/actions/auth';

function pagePath(segments: string[] | undefined) {
  return `/${(segments || ['home']).join('/')}`;
}

/**
 * Title and description of a published page. These fields carry no field-level access control, so
 * the public variant is safe to cache and share across visitors, which keeps metadata out of the
 * request-time path and lets the route prerender a static shell.
 */
export async function fetchCachedPageMeta({ slug }: { slug?: string[] }) {
  'use cache';

  const path = pagePath(slug);

  cacheLife('max');
  cacheTag(`page_${path}`);

  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: 'pages',
    draft: false,
    pagination: false,
    limit: 1,
    overrideAccess: false,
    select: {
      title: true,
      description: true,
    },
    where: {
      path: {
        equals: path,
      },
    },
  });

  return result.docs?.[0] || null;
}

export const fetchCachedPage = cache(async ({ slug: segments }: { slug: string[] }) => {
  const [{ isEnabled: draft }, payload, user, guest] = await Promise.all([
    draftMode(),
    getPayload({ config }),
    fetchUser(),
    fetchGuest(),
  ]);
  const auth = user?.user || guest?.user;
  const result = await payload.find({
    collection: 'pages',
    draft,
    pagination: false,
    limit: 1,
    overrideAccess: auth ? false : draft,
    where: {
      path: {
        equals: pagePath(segments),
      },
    },
    user: auth || undefined,
  });

  return result.docs?.[0] || null;
});
