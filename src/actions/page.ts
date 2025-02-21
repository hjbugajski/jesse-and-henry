'use server';

import { cache } from 'react';

import { draftMode } from 'next/headers';
import { getPayload } from 'payload';

import { fetchUser } from '@/actions/auth';
import config from '@payload-config';

export const queryPage = cache(async ({ slug: segments }: { slug: string[] }) => {
  const slugSegments = segments || ['home'];
  const slug = slugSegments[slugSegments.length - 1];
  const [{ isEnabled: draft }, payload, user] = await Promise.all([
    draftMode(),
    getPayload({ config }),
    fetchUser(),
  ]);
  const result = await payload.find({
    collection: 'pages',
    draft,
    pagination: false,
    limit: 1,
    overrideAccess: user?.user ? false : draft,
    where: {
      slug: {
        equals: slug,
      },
    },
    user: user?.user || undefined,
  });

  return result.docs?.[0] || null;
});
