import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = NextResponse.json({ message: 'Logged out successfully' });

    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 0, // Expire the cookie immediately
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Something went wrong during logout' },
      { status: 500 }
    );
  }
}
