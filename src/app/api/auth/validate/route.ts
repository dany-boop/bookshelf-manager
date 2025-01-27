import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    const decoded = verifyToken(token);
    return NextResponse.json({ decoded });
  } catch (error) {
    return NextResponse.json(
      { message: 'Invalid or expired token' },
      { status: 401 }
    );
  }
}
