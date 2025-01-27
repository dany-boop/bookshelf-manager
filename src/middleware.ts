import { NextResponse } from 'next/server';

export function middleware(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  // Exclude the login route from token validation
  const url = new URL(request.url);
  if (url.pathname === '/api/auth/login' || '/api/auth/register') {
    return NextResponse.next();
  }
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
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
