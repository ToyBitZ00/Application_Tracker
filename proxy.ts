import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE_KEY = 'application_tracker_session';
const ADMIN_SESSION_COOKIE_KEY = 'application_tracker_admin_session';

const PROTECTED_ROUTES = [
  '/dashboard',
  '/applications',
  '/settings',
  '/reports',
  '/onboarding',
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute =
    pathname === '/admin' ||
    pathname.startsWith('/admin/');

  if (isAdminRoute) {
    const hasAdminSession = Boolean(
      request.cookies.get(ADMIN_SESSION_COOKIE_KEY)?.value
    );

    if (hasAdminSession) {
      return NextResponse.next();
    }

    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);

    return NextResponse.redirect(loginUrl);
  }

  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const hasSession = Boolean(
    request.cookies.get(SESSION_COOKIE_KEY)?.value
  );

  if (hasSession) {
    return NextResponse.next();
  }

  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('next', pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/applications/:path*',
    '/settings/:path*',
    '/reports/:path*',
    '/onboarding/:path*',
    '/admin/:path*',
  ],
};
