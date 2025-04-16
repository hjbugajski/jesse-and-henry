'use server';

import { env } from '@/env/server';
import type { PayloadGuestsCollection } from '@/payload/payload-types';
import type { ActionState } from '@/types/action-state';
import type { PayloadCollectionsGetApi, PayloadCollectionsPatchApi } from '@/types/payload-api';
import { getCookieValue } from '@/utils/cookies';

const SERVER_API_URL = env.SERVER_URL + '/api';

export async function fetchGuests(): Promise<PayloadGuestsCollection[] | null> {
  const jwt = await getCookieValue(env.PAYLOAD_GUEST_TOKEN);
  const res = await fetch(`${SERVER_API_URL}/guests?pagination=false`, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${jwt}`,
    },
  });

  if (!res.ok) {
    return null;
  }

  const data = (await res.json()) as PayloadCollectionsGetApi<PayloadGuestsCollection>;

  return data.docs;
}

export async function updateGuest(
  id: string,
  fields: Partial<PayloadGuestsCollection>,
): Promise<ActionState> {
  const jwt = await getCookieValue(env.PAYLOAD_GUEST_TOKEN);
  const res = await fetch(`${SERVER_API_URL}/guests/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${jwt}`,
    },
    body: JSON.stringify(fields),
  });
  const data = (await res.json()) as PayloadCollectionsPatchApi<PayloadGuestsCollection>;

  if (!res.ok) {
    return {
      status: 'error',
      message: data?.errors?.[0]?.message || 'Something went wrong',
    };
  }

  return { status: 'valid', message: data.message };
}
