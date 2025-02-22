'use server';

import { redirect } from 'next/navigation';
import { type CollectionSlug } from 'payload';

import { env } from '@/env/server';
import type { ActionState } from '@/lib/types/action-state';
import { deleteCookie, getCookieValue, setCookie } from '@/lib/utils/cookies';
import type { PayloadUsersCollection } from '@/payload/payload-types';

type AuthCollection = Extract<CollectionSlug, 'users'>;

interface PayloadApiMe<T = any> {
  collection: string;
  exp: number;
  token: string;
  user: T;
}

const SERVER_API_URL = env.SERVER_URL + '/api';

const fetchMe = async <T>(collection: AuthCollection): Promise<PayloadApiMe<T> | null> => {
  const jwt = await getCookieValue(env.PAYLOAD_PROTECTED_TOKEN);
  const res = await fetch(`${SERVER_API_URL}/${collection}/me`, {
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

  return (await res.json()) as PayloadApiMe<T>;
};

export const fetchUser = async () => await fetchMe<PayloadUsersCollection>('users');

interface PayloadApiLogin<T = any> {
  exp: number;
  message: string;
  token: string;
  user: T;
}

const fetchLogin = async <T>(
  collection: AuthCollection,
  body: { email: string; password: string },
): Promise<PayloadApiLogin<T> | null> => {
  const res = await fetch(`${SERVER_API_URL}/${collection}/login`, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    return null;
  }

  return (await res.json()) as PayloadApiLogin<T>;
};

export const fetchLogout = async (
  collection: AuthCollection,
  redirectUrl: string,
): Promise<ActionState | undefined> => {
  const token = env.PAYLOAD_PROTECTED_TOKEN;
  const jwt = await getCookieValue(token);
  const res = await fetch(`${SERVER_API_URL}/${collection}/logout`, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${jwt}`,
    },
  });

  if (!res.ok) {
    return {
      status: 'error',
      message: 'There was an error logging out.',
    };
  }

  await deleteCookie(token);
  redirect(redirectUrl);
};

interface ProtectedLoginParams {
  password: string;
}

export async function fetchUserLogin({ password }: ProtectedLoginParams): Promise<ActionState> {
  const data = await fetchLogin<PayloadUsersCollection>('users', {
    email: env.PROTECTED_EMAIL,
    password,
  });

  if (!data) {
    return { status: 'error', message: 'The provided password is incorrect.' };
  }

  await setCookie(env.PAYLOAD_PROTECTED_TOKEN, data.token, data.exp);

  return { status: 'valid', message: data.message };
}
