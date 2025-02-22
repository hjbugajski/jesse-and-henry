import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { fetchUser } from '@/actions/auth';

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/protected')) {
    const redirectUrl = request.nextUrl.searchParams.get('redirectUrl') || '/';
    const user = await fetchUser();

    if (user?.user) {
      return NextResponse.redirect(new URL(redirectUrl, request.nextUrl.origin));
    }
  }

  // if (request.nextUrl.pathname.startsWith('/rsvp/login')) {
  //   const guest = await fetchGuest();

  //   if (guest && guest.user) {
  //     return NextResponse.redirect(new URL('/rsvp', request.nextUrl.origin));
  //   }
  // }

  // if (request.nextUrl.pathname === '/rsvp') {
  //   const guest = await fetchGuest();

  //   if (!guest || !guest.user) {
  //     return NextResponse.redirect(new URL('/rsvp/login', request.nextUrl.origin));
  //   }
  // }
}
