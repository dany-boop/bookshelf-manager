// import { NextRequest, NextResponse } from 'next/server';

// export function middleware(request: NextRequest) {
//   const url = new URL(request.url);
//   const token = request.headers.get('Authorization')?.replace('Bearer ', '');

//   // Exclude authentication routes from token validation
//   if (
//     url.pathname.startsWith('/auth/login') ||
//     url.pathname.startsWith('/api/auth/login') ||
//     url.pathname.startsWith('/api/auth/register')
//   ) {
//     return NextResponse.next();
//   } else if (!token) {
//     return NextResponse.redirect(new URL('/auth/login', request.url));
//   }

//   // // If no token is found, return an unauthorized response
//   // if (!token) {
//   // }

//   return NextResponse.next();
// }

// // Apply middleware to specific paths
// export const config = {
//   matcher: ['/dashboard', '/profile', '/api/books/:path*'], // Protect pages & API
// };

import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const token = request.cookies.get('token')?.value; // Get token from cookies

  console.log('Current Path:', url.pathname);
  console.log('Token:', token);

  // ✅ Allow access to authentication routes
  if (
    url.pathname.startsWith('/auth/login') ||
    url.pathname.startsWith('/api/auth/login') ||
    url.pathname.startsWith('/api/auth/register')
  ) {
    // If user is already authenticated, redirect them away from the login page
    if (token) {
      console.log('User is already logged in, redirecting to dashboard...');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // ❌ If no token and accessing a protected route, redirect to login
  const protectedRoutes = ['/dashboard', '/profile', '/api/books'];
  if (
    !token &&
    protectedRoutes.some((route) => url.pathname.startsWith(route))
  ) {
    console.log('User is not authenticated, redirecting to login...');
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  console.log('User is authenticated, allowing access...');
  return NextResponse.next();
}

// ✅ Apply middleware only to protected routes
export const config = {
  matcher: ['/dashboard', '/profile', '/api/books/:path*'],
};
