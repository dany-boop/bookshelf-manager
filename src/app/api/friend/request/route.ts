import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { senderId, receiverId } = body;

  if (!senderId || !receiverId || senderId === receiverId) {
    return NextResponse.json({ error: 'Invalid user IDs' }, { status: 400 });
  }

  try {
    const existing = await prisma.friendship.findFirst({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          error: 'Friend request already exists or users are already connected',
        },
        { status: 409 }
      );
    }

    const newRequest = await prisma.friendship.create({
      data: { senderId, receiverId },
    });

    return NextResponse.json(newRequest, { status: 201 });
  } catch (err) {
    console.error('[SEND_REQUEST_ERROR]', err);
    return NextResponse.json(
      { error: 'Failed to send friend request' },
      { status: 500 }
    );
  }
}
