import { cacheLife, cacheTag } from 'next/cache';
import type { GlobalSlug } from 'payload';
import { getPayload } from 'payload';

import config from '@payload-config';

export async function fetchCachedGlobal<T>(slug: GlobalSlug): Promise<T> {
  'use cache';
  cacheLife('max');
  cacheTag(`global_${slug}`);

  const payload = await getPayload({ config });

  return (await payload.findGlobal({ slug })) as T;
}
