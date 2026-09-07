import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE_KEY = 'application_tracker_session';
const ADMIN_SESSION_COOKIE_KEY = 'application_tracker_admin_session';
const SESSION_ACTIVITY_COOKIE_KEY = 'application_tracker_session_activity';
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

const PROTECTED_ROUTES = [
  '/dashboard',
  '/applications',
  '/settings',
  '/reports',
  '/onboarding',
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const lastActivity = Number(
    request.cookies.get(SESSION_ACTIVITY_COOKIE_KEY)?.value
  );
  const hasActiveSession =
    Number.isFinite(lastActivity) &&
    Date.now() - lastActivity < SESSION_TIMEOUT_MS;

  const isAdminRoute =
    pathname === '/admin' ||
    pathname.startsWith('/admin/');

  if (isAdminRoute) {
    const hasAdminSession = Boolean(
      request.cookies.get(ADMIN_SESSION_COOKIE_KEY)?.value
    );

    if (hasAdminSession && hasActiveSession) {
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

  if (hasSession && hasActiveSession) {
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
