'use server';

import { unstable_cache } from 'next/cache';
import type { GlobalSlug } from 'payload';
import { getPayload } from 'payload';

import config from '@payload-config';

async function fetchGlobal(slug: GlobalSlug) {
  const payload = await getPayload({ config });

  return payload.findGlobal({ slug });
}

export async function fetchCachedGlobal<T>(slug: GlobalSlug) {
  return unstable_cache(fetchGlobal, [slug], { tags: [`global_${slug}`] })(slug) as Promise<T>;
}
