import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { fetchUser } from '@/actions/auth';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - admin (Payload admin)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, robots.txt, manifest.webmanifest, icons (static assets)
     */
    '/((?!api|admin|_next/static|_next/image|favicon.ico|manifest.webmanifest|robots.txt|icons).*)',
  ],
};

export async function middleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;
  const pathNameArray = pathName.split('/');

  // protected login page
  if (pathNameArray.pop() === 'protected') {
    const redirectUrl = request.nextUrl.searchParams.get('redirectUrl') || '/';
    const user = await fetchUser();

    if (user?.user) {
      return NextResponse.redirect(new URL(redirectUrl, request.nextUrl.origin));
    }
  }

  // protected page
  if (pathNameArray.includes('protected')) {
    const user = await fetchUser();

    if (!user?.user) {
      return NextResponse.redirect(
        new URL(`/protected?redirectUrl=${encodeURIComponent(pathName)}`, request.nextUrl.origin),
      );
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
