import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  try {
    const friends = await prisma.friendship.findMany({
      where: {
        status: 'accepted',
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: { select: { id: true, username: true, photo_url: true } },
        receiver: { select: { id: true, username: true, photo_url: true } },
      },
    });

    const friendList = friends.map((f) =>
      f.senderId === userId ? f.receiver : f.sender
    );

    return NextResponse.json(friendList, { status: 200 });
  } catch (err) {
    console.error('[FRIEND_LIST_ERROR]', err);
    return NextResponse.json(
      { error: 'Failed to fetch friends' },
      { status: 500 }
    );
  }
}
