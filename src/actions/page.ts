'use server';

import { cache } from 'react';

import { draftMode } from 'next/headers';
import { getPayload } from 'payload';

import { fetchGuest, fetchUser } from '@/actions/auth';
import config from '@payload-config';

export const fetchCachedPage = cache(async ({ slug: segments }: { slug: string[] }) => {
  const slugSegments = segments || ['home'];
  const slug = slugSegments[slugSegments.length - 1];
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
      slug: {
        equals: slug,
      },
    },
    user: auth || undefined,
  });

  return result.docs?.[0] || null;
});
