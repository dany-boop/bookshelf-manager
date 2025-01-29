import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  // Exclude the login route from token validation
  const url = new URL(request.url);
  if (url.pathname === '/api/auth/login' || '/api/auth/register') {
    return NextResponse.next();
  }
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const protectedRoutes = ['/dashboard', '/profile']; // Add protected routes here
  const isAuthenticated =
    token && JSON.parse(token)?.auth?.isAuthenticated === 'true';
  if (
    protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
  ) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/auth/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  try {
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
}

export const config = {
  matcher: ['/api/:path*'],
};
