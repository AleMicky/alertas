import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login'];
const SESSION_COOKIE = 'dashboard_session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.get(SESSION_COOKIE)?.value === '1';
  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  if (pathname === '/dashboard') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!hasSession && !isPublicPath) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
