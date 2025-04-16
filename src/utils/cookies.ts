'use server';

import { cookies } from 'next/headers';

export async function getCookieValue(key: string) {
  const c = await cookies();

  return c.get(key)?.value;
}

export async function setCookie(key: string, value: string, exp: number) {
  const c = await cookies();

  c.set(key, value, {
    httpOnly: true,
    expires: exp * 1000,
    path: '/',
  });
}

export async function deleteCookie(key: string) {
  const c = await cookies();

  c.delete(key);
}
