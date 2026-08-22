'use server';

import { redirect } from 'next/navigation';

import { env as clientEnv } from '@/env/client';
import { env } from '@/env/server';
import type { PayloadGuestsCollection, PayloadUsersCollection } from '@/payload/payload-types';
import { getServerSideUrl } from '@/payload/utils/get-server-side-url';
import type { ActionState } from '@/types/action-state';
import type { AuthCollection } from '@/types/auth-collection';
import { deleteCookie, getCookieValue, setCookie } from '@/utils/cookies';

interface PayloadApiMe<T = unknown> {
  collection: string;
  exp: number;
  token: string;
  user: T;
}

const SERVER_API_URL = `${getServerSideUrl()}/api`;

/** Server-action args arrive untrusted at runtime; the TS type alone does not constrain callers. */
function assertAuthCollection(collection: string): asserts collection is AuthCollection {
  if (collection !== 'users' && collection !== 'guests') {
    throw new Error('Invalid auth collection');
  }
}

/** Browsers strip these before parsing a URL, so `/\t/evil.com` would resolve to `//evil.com`. */
// oxlint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/;

/** Server-action args arrive untrusted at runtime; anything but a same-site path is an open redirect. */
function safeRedirectUrl(url: string) {
  return !CONTROL_CHARS.test(url) && /^\/(?![/\\])/.test(url) ? url : '/';
}

function getTokenEnv(collection: AuthCollection) {
  return collection === 'guests' ? env.PAYLOAD_GUEST_TOKEN : env.PAYLOAD_PROTECTED_TOKEN;
}

async function fetchMe<T>(collection: AuthCollection): Promise<PayloadApiMe<T> | null> {
  const jwt = await getCookieValue(getTokenEnv(collection));
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
}

export async function fetchUser() {
  return fetchMe<PayloadUsersCollection>('users');
}

export async function fetchGuest() {
  return fetchMe<PayloadGuestsCollection>('guests');
}

interface PayloadApiLogin<T = unknown> {
  exp: number;
  message: string;
  token: string;
  user: T;
}

async function fetchLogin<T>(
  collection: AuthCollection,
  body: { email: string; password: string },
): Promise<PayloadApiLogin<T> | null> {
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
}

export async function fetchLogout(
  collection: AuthCollection,
  redirectUrl: string,
): Promise<ActionState | undefined> {
  assertAuthCollection(collection);
  const token = getTokenEnv(collection);
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
  redirect(safeRedirectUrl(redirectUrl));
}

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
  await deleteCookie(env.PAYLOAD_GUEST_TOKEN);

  return { status: 'valid', message: data.message };
}

interface GuestLoginParams {
  first: string;
  middle?: string;
  last: string;
  password: string;
  code: string;
}

function cleanString(str: string) {
  return str.toLowerCase().trim();
}

export async function fetchGuestLogin(values: GuestLoginParams): Promise<ActionState> {
  const { first, middle, last, password: providedPassword, code } = values;
  const middleName = middle ? `.${cleanString(middle)}` : '';
  const email = `${cleanString(first)}${middleName}.${cleanString(last)}@${clientEnv.NEXT_PUBLIC_DOMAIN}`;
  const password = `${providedPassword}-${code}`;

  const data = await fetchLogin<PayloadGuestsCollection>('guests', { email, password });

  if (!data) {
    return {
      status: 'error',
      message:
        'The provided information is incorrect. Verify that your name, password, and party code match your invitation. Only include your middle name if it is included in your invitation.',
    };
  }

  await setCookie(env.PAYLOAD_GUEST_TOKEN, data.token, data.exp);
  await deleteCookie(env.PAYLOAD_PROTECTED_TOKEN);

  return { status: 'valid', message: data.message };
}
